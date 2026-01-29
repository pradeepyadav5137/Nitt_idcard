const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.NODEMAILER_SERVICE,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp, identifierType = 'email') => {
  try {
    const subject = `NITT ID Card - OTP Verification`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%); color: white; padding: 30px; text-align: center;">
          <h1>NIT Tiruchirappalli</h1>
          <p>ID Card Re-issue Application</p>
        </div>
        <div style="padding: 30px; background: #f5f5f5;">
          <h2 style="color: #1a365d;">Email Verification</h2>
          <p>Your OTP for ID Card application is:</p>
          <div style="background: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <p style="font-size: 32px; font-weight: bold; color: #c9a227; letter-spacing: 5px;">${otp}</p>
          </div>
          <p style="color: #666; font-size: 14px;">This OTP will expire in 5 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you did not request this OTP, please ignore this email.</p>
        </div>
        <div style="padding: 20px; background: #1a365d; color: white; text-align: center; font-size: 12px;">
          <p>&copy; 2024 National Institute of Technology, Tiruchirappalli</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject,
      html
    });

    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send OTP email');
  }
};

const sendApplicationConfirmation = async (email, applicationId, applicantName) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%); color: white; padding: 30px; text-align: center;">
          <h1>NIT Tiruchirappalli</h1>
          <p>ID Card Re-issue Application</p>
        </div>
        <div style="padding: 30px; background: #f5f5f5;">
          <h2 style="color: #1a365d;">Application Submitted Successfully</h2>
          <p>Dear ${applicantName},</p>
          <p>Your ID card re-issue application has been submitted successfully.</p>
          <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #c9a227;">
            <p><strong>Application ID:</strong> ${applicationId}</p>
            <p style="margin: 0; color: #666; font-size: 14px;">Please save this ID for future reference.</p>
          </div>
          <p>You will be notified once your application is reviewed and approved.</p>
        </div>
        <div style="padding: 20px; background: #1a365d; color: white; text-align: center; font-size: 12px;">
          <p>&copy; 2024 National Institute of Technology, Tiruchirappalli</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: `ID Card Application Submitted - ${applicationId}`,
      html
    });

    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send confirmation email');
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendApplicationConfirmation,
  transporter
};
