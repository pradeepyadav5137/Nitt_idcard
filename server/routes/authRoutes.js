const express = require('express');
const router = express.Router();
const OTP = require('../models/OTP');
const Application = require('../models/Application');
const { generateOTP, sendOTPEmail } = require('../utils/emailService');
const { generateToken } = require('../utils/authToken');
const { validateEmail, validateRollNo, validatePhone } = require('../middleware/validation');

// Rate limiting for OTP requests
const otpAttempts = new Map();

const checkRateLimit = (identifier) => {
  const now = Date.now();
  if (!otpAttempts.has(identifier)) {
    otpAttempts.set(identifier, []);
  }

  const attempts = otpAttempts.get(identifier);
  const recentAttempts = attempts.filter(time => now - time < 60000); // 1 minute

  if (recentAttempts.length >= 3) {
    return false;
  }

  recentAttempts.push(now);
  otpAttempts.set(identifier, recentAttempts);
  return true;
};

// Student OTP verification
router.post('/student/request-otp', async (req, res) => {
  try {
    const { rollNumber } = req.body;

    if (!rollNumber || !validateRollNo(rollNumber)) {
      return res.status(400).json({ error: 'Valid roll number required' });
    }

    if (!checkRateLimit(rollNumber)) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    const email = `${rollNumber}@nitt.edu`;
    const otp = generateOTP();

    // Delete existing OTP if any
    await OTP.deleteMany({ identifier: rollNumber, identifierType: 'rollno' });

    // Create new OTP
    const otpDoc = new OTP({
      identifier: rollNumber,
      identifierType: 'rollno',
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    });

    await otpDoc.save();

    // Send OTP via email
    await sendOTPEmail(email, otp, 'rollno');

    res.json({
      message: 'OTP sent to your registered email',
      email: email.replace(rollNumber, '****')
    });
  } catch (error) {
    console.error('OTP request error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Faculty/Staff OTP verification
router.post('/staff/request-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    if (!email.endsWith('@nitt.edu')) {
      return res.status(400).json({ error: 'Must be a valid NITT email' });
    }

    if (!checkRateLimit(email)) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    const otp = generateOTP();

    // Delete existing OTP if any
    await OTP.deleteMany({ identifier: email, identifierType: 'email' });

    // Create new OTP
    const otpDoc = new OTP({
      identifier: email,
      identifierType: 'email',
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    });

    await otpDoc.save();

    // Send OTP via email
    await sendOTPEmail(email, otp, 'email');

    res.json({
      message: 'OTP sent to your email',
      email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    });
  } catch (error) {
    console.error('OTP request error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { identifier, otp, type } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({ error: 'Identifier and OTP required' });
    }

    const otpRecord = await OTP.findOne({
      identifier,
      identifierType: type === 'student' ? 'rollno' : 'email'
    });

    if (!otpRecord) {
      return res.status(400).json({ error: 'OTP not found or expired' });
    }

    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      if (otpRecord.attempts >= otpRecord.maxAttempts) {
        await OTP.deleteOne({ _id: otpRecord._id });
        return res.status(400).json({ error: 'Max attempts exceeded. Request new OTP.' });
      }
      await otpRecord.save();
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Mark as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Create or get application
    let application = await Application.findOne({
      type: type === 'student' ? 'student' : 'faculty',
      $or: [
        { rollNumber: identifier },
        { staffEmail: identifier }
      ]
    });

    if (!application) {
      const email = type === 'student' ? `${identifier}@nitt.edu` : identifier;
      application = new Application({
        type: type === 'student' ? 'student' : 'faculty',
        rollNumber: type === 'student' ? identifier : undefined,
        studentEmail: type === 'student' ? email : undefined,
        staffEmail: type === 'student' ? undefined : identifier,
        emailVerified: true,
        emailVerifiedAt: new Date(),
        currentStep: 1,
        stepsCompleted: {
          emailVerification: true
        }
      });
      await application.save();
    } else {
      application.emailVerified = true;
      application.emailVerifiedAt = new Date();
      application.currentStep = Math.max(application.currentStep, 1);
      application.stepsCompleted.emailVerification = true;
      await application.save();
    }

    // Generate token
    const token = generateToken(
      {
        applicationId: application._id,
        type: application.type,
        identifier
      },
      '24h'
    );

    res.cookie('userToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'OTP verified successfully',
      applicationId: application._id,
      type: application.type
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

module.exports = router;
