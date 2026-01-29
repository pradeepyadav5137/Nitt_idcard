const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { authenticateUser } = require('../middleware/auth');
const upload = require('../middleware/fileUpload');
const { validateApplicationForm, validatePhone } = require('../middleware/validation');
const { generateApplicationId } = require('../utils/authToken');
const { sendApplicationConfirmation } = require('../utils/emailService');

// Get application by ID
router.get('/application/:appId', authenticateUser, async (req, res) => {
  try {
    const application = await Application.findById(req.params.appId);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check authorization
    if (application._id.toString() !== req.user.applicationId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// Update application form
router.put('/application/:appId/form', authenticateUser, async (req, res) => {
  try {
    const application = await Application.findById(req.params.appId);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check authorization
    if (application._id.toString() !== req.user.applicationId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Validate form
    const validation = validateApplicationForm(req.body, application.type);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Update fields based on type
    if (application.type === 'student') {
      application.studentName = req.body.studentName;
      application.fathersName = req.body.fathersName;
      application.programme = req.body.programme;
      application.branch = req.body.branch;
      application.duration = req.body.duration;
      application.parentMobileNumber = req.body.parentMobileNumber;
    } else {
      application.staffName = req.body.staffName;
      application.employeeId = req.body.employeeId;
      application.designation = req.body.designation;
      application.department = req.body.department;
      application.dateOfJoining = req.body.dateOfJoining;
      if (req.body.dateOfRetirement) {
        application.dateOfRetirement = req.body.dateOfRetirement;
      }
      application.title = req.body.title;
    }

    // Common fields
    application.gender = req.body.gender;
    application.bloodGroup = req.body.bloodGroup;
    application.dateOfBirth = req.body.dateOfBirth;
    application.mobileNumber = req.body.mobileNumber;
    application.address = req.body.address;
    application.requestCategory = req.body.requestCategory;
    application.dataToBeChanged = req.body.dataToBeChanged || [];
    application.reasonForDuplicate = req.body.reasonForDuplicate;

    application.status = 'draft';
    application.currentStep = Math.max(application.currentStep, 1);
    application.stepsCompleted.formFilled = true;

    await application.save();

    res.json({
      message: 'Form saved successfully',
      application
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// Upload files
router.post('/application/:appId/upload', authenticateUser, upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'firCopy', maxCount: 1 },
  { name: 'paymentReceipt', maxCount: 1 }
]), async (req, res) => {
  try {
    const application = await Application.findById(req.params.appId);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check authorization
    if (application._id.toString() !== req.user.applicationId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Process photo
    if (req.files.photo && req.files.photo[0]) {
      application.photoFile = {
        filename: req.files.photo[0].filename,
        path: req.files.photo[0].path,
        size: req.files.photo[0].size,
        uploadedAt: new Date()
      };
    }

    // Process FIR copy
    if (req.files.firCopy && req.files.firCopy[0]) {
      application.firCopyFile = {
        filename: req.files.firCopy[0].filename,
        path: req.files.firCopy[0].path,
        size: req.files.firCopy[0].size,
        uploadedAt: new Date()
      };
    }

    // Process payment receipt
    if (req.files.paymentReceipt && req.files.paymentReceipt[0]) {
      application.paymentReceiptFile = {
        filename: req.files.paymentReceipt[0].filename,
        path: req.files.paymentReceipt[0].path,
        size: req.files.paymentReceipt[0].size,
        uploadedAt: new Date()
      };
    }

    application.currentStep = Math.max(application.currentStep, 2);
    application.stepsCompleted.documentsUploaded = true;

    await application.save();

    res.json({
      message: 'Files uploaded successfully',
      application
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// Preview and submit application
router.post('/application/:appId/submit', authenticateUser, async (req, res) => {
  try {
    const application = await Application.findById(req.params.appId);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check authorization
    if (application._id.toString() !== req.user.applicationId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Validate all required fields and documents
    const validation = validateApplicationForm(application.toObject(), application.type);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    if (!application.photoFile) {
      return res.status(400).json({ error: 'Photo is required' });
    }

    if (!application.firCopyFile) {
      return res.status(400).json({ error: 'FIR copy is required' });
    }

    if (!application.paymentReceiptFile) {
      return res.status(400).json({ error: 'Payment receipt is required' });
    }

    // Generate Application ID
    application.applicationId = generateApplicationId(application.type);
    application.status = 'pending';
    application.currentStep = 4;
    application.stepsCompleted.previewConfirmed = true;
    application.submittedAt = new Date();

    await application.save();

    // Send confirmation email
    const email = application.type === 'student' ? application.studentEmail : application.staffEmail;
    const name = application.type === 'student' ? application.studentName : application.staffName;

    await sendApplicationConfirmation(email, application.applicationId, name);

    res.json({
      message: 'Application submitted successfully',
      applicationId: application.applicationId,
      application
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

module.exports = router;
