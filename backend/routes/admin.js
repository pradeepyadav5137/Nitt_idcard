import express from 'express';
import { verifyAdmin } from '../middleware/auth.js';
import {
  addAdmin,
  approveApplication,
  rejectApplication,
  getDashboardStats,
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/add', verifyAdmin, addAdmin);

// Approve application
router.put('/approve/:applicationId', verifyAdmin, approveApplication);

// Reject application
router.put('/reject/:applicationId', verifyAdmin, rejectApplication);

// Get dashboard stats
router.get('/stats', verifyAdmin, getDashboardStats);

export default router;
