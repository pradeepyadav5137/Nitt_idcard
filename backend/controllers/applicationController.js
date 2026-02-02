import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Application from '../models/Application.js';
import { uploadToFirebase, isFirebaseEnabled } from '../config/firebase.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../uploads');

const generateAppId = (userType) => {
  const prefix = userType === 'student' ? 'STU' : userType === 'faculty' ? 'FAC' : 'STF';
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(5, '0');
  return `NITT-${prefix}-${year}-${random}`;
};

async function saveFile(fieldName, file, applicationId) {
  const ext = path.extname(file.originalname) || (file.mimetype?.includes('png') ? '.png' : '.jpg');
  const basePath = `applications/${applicationId}/${fieldName}${ext}`;

  if (isFirebaseEnabled()) {
    const url = await uploadToFirebase(file.buffer, basePath, file.mimetype || 'application/octet-stream');
    return url;
  }

  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  const dir = path.join(uploadsDir, applicationId);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filename = `${fieldName}-${Date.now()}${ext}`;
  const filepath = path.join(dir, filename);
  fs.writeFileSync(filepath, file.buffer);
  return `${applicationId}/${filename}`;
}

// Submit application (with optional photo, fir, payment, applicationPdf files)
export const submitApplication = async (req, res) => {
  try {
    const body = req.body || {};
    const userType = body.userType;

    if (!userType || !['student', 'faculty', 'staff'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    const applicationId = generateAppId(userType);

    const applicationData = {
      ...body,
      applicationId,
      userType,
      status: 'submitted'
    };

    // Clean up dates and empty strings
    Object.keys(applicationData).forEach(key => {
      if (applicationData[key] === '' || applicationData[key] === 'null' || applicationData[key] === 'undefined') {
        delete applicationData[key];
      }
    });

    // Handle files
    const files = req.files || {};
    console.log('Received files:', Object.keys(files));

    if (files.photo && files.photo[0]) {
      applicationData.photoPath = await saveFile('photo', files.photo[0], applicationId);
    }
    if (files.fir && files.fir[0]) {
      applicationData.firPath = await saveFile('fir', files.fir[0], applicationId);
    }
    if (files.payment && files.payment[0]) {
      applicationData.paymentPath = await saveFile('payment', files.payment[0], applicationId);
    }
    if (files.applicationPdf && files.applicationPdf[0]) {
      applicationData.applicationPdfUrl = await saveFile('applicationPdf', files.applicationPdf[0], applicationId);
    }

    console.log('Application data to save:', { ...applicationData, photoPath: !!applicationData.photoPath });

    const application = new Application(applicationData);
    await application.save();

    res.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId,
      application
    });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ message: 'Error submitting application' });
  }
};

export const getApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findOne({
      applicationId: req.params.applicationId
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({ message: 'Error fetching application' });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Error fetching applications' });
  }
};
