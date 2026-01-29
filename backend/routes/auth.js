import express from 'express';
import {
  adminLogin,
  verifyEmailOtp,
  sendOtp,
} from '../controllers/authController.js';

const router = express.Router();

// Admin Login
router.post('/admin-login', adminLogin);

// Verify OTP (Email verification)
router.post('/verify-email', verifyEmailOtp);

// Send OTP
router.post('/send-otp', sendOtp);

export default router;
