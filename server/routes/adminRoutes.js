const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Application = require('../models/Application');
const { authenticateAdmin } = require('../middleware/auth');
const { generateToken, verifyToken } = require('../utils/authToken');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const admin = await Admin.findOne({ email, isActive: true });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken({
      adminId: admin._id,
      email: admin.email,
      role: admin.role
    });

    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login successful',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin logout
router.post('/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.json({ message: 'Logged out successfully' });
});

// Get dashboard statistics
router.get('/dashboard/stats', authenticateAdmin, async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments({ isDeleted: false });
    const studentApplications = await Application.countDocuments({
      type: 'student',
      isDeleted: false
    });
    const facultyApplications = await Application.countDocuments({
      type: 'faculty',
      isDeleted: false
    });
    const staffApplications = await Application.countDocuments({
      type: 'staff',
      isDeleted: false
    });

    const draftApplications = await Application.countDocuments({
      status: 'draft',
      isDeleted: false
    });
    const pendingApplications = await Application.countDocuments({
      status: 'pending',
      isDeleted: false
    });
    const approvedApplications = await Application.countDocuments({
      status: 'approved',
      isDeleted: false
    });
    const rejectedApplications = await Application.countDocuments({
      status: 'rejected',
      isDeleted: false
    });

    res.json({
      totalApplications,
      byType: {
        student: studentApplications,
        faculty: facultyApplications,
        staff: staffApplications
      },
      byStatus: {
        draft: draftApplications,
        pending: pendingApplications,
        approved: approvedApplications,
        rejected: rejectedApplications
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get all applications (paginated)
router.get('/applications', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const type = req.query.type;

    let query = { isDeleted: false };

    if (status) query.status = status;
    if (type) query.type = type;

    const applications = await Application.find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-photoFile.path -firCopyFile.path -paymentReceiptFile.path');

    const total = await Application.countDocuments(query);

    res.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Get single application
router.get('/applications/:appId', authenticateAdmin, async (req, res) => {
  try {
    const application = await Application.findById(req.params.appId);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// Approve application
router.put('/applications/:appId/approve', authenticateAdmin, async (req, res) => {
  try {
    const application = await Application.findById(req.params.appId);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.status = 'approved';
    application.approvedBy = req.admin.adminId;
    application.approvedAt = new Date();
    application.adminNotes = req.body.adminNotes || '';

    await application.save();

    res.json({
      message: 'Application approved',
      application
    });
  } catch (error) {
    console.error('Error approving application:', error);
    res.status(500).json({ error: 'Failed to approve application' });
  }
});

// Reject application
router.put('/applications/:appId/reject', authenticateAdmin, async (req, res) => {
  try {
    const { rejectionReason, adminNotes } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({ error: 'Rejection reason required' });
    }

    const application = await Application.findById(req.params.appId);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.status = 'rejected';
    application.rejectionReason = rejectionReason;
    application.adminNotes = adminNotes || '';

    await application.save();

    res.json({
      message: 'Application rejected',
      application
    });
  } catch (error) {
    console.error('Error rejecting application:', error);
    res.status(500).json({ error: 'Failed to reject application' });
  }
});

// Soft delete application
router.put('/applications/:appId/soft-delete', authenticateAdmin, async (req, res) => {
  try {
    const application = await Application.findById(req.params.appId);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.isDeleted = true;
    application.deletedAt = new Date();

    await application.save();

    res.json({
      message: 'Application soft deleted',
      application
    });
  } catch (error) {
    console.error('Error soft deleting application:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

// Hard delete application
router.delete('/applications/:appId/hard-delete', authenticateAdmin, async (req, res) => {
  try {
    const application = await Application.findById(req.params.appId);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // TODO: Delete associated files from storage

    await Application.findByIdAndDelete(req.params.appId);

    res.json({
      message: 'Application permanently deleted'
    });
  } catch (error) {
    console.error('Error hard deleting application:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

module.exports = router;
