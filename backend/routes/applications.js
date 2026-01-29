import express from 'express';
import { upload } from '../middleware/upload.js';
import { verifyToken } from '../middleware/auth.js';
import {
  submitApplication,
  getApplicationStatus,
  getAllApplications,
} from '../controllers/applicationController.js';

const router = express.Router();

// Submit application
router.post('/submit', verifyToken, upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'fir', maxCount: 1 },
  { name: 'payment', maxCount: 1 }
]), submitApplication);

// Get application status
router.get('/status/:applicationId', getApplicationStatus);

// Get all applications (admin)
router.get('/all', verifyToken, getAllApplications);

export default router;
