import Application from '../models/Application.js';
import Admin from '../models/Admin.js';

// Add new admin (only existing admin can add)
export const addAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }
    const e = email.trim().toLowerCase();
    if (await Admin.findOne({ username })) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    if (await Admin.findOne({ email: e })) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const admin = new Admin({ username, email: e, password, role: 'admin' });
    await admin.save();
    res.json({ success: true, message: 'Admin added successfully', admin: { username, email: e } });
  } catch (error) {
    console.error('Add admin error:', error);
    res.status(500).json({ message: 'Error adding admin' });
  }
};

// Approve application
export const approveApplication = async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const application = await Application.findOneAndUpdate(
      { applicationId: req.params.applicationId },
      {
        status: 'approved',
        adminNotes: adminNotes || '',
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({
      success: true,
      message: 'Application approved',
      application
    });
  } catch (error) {
    console.error('Approve error:', error);
    res.status(500).json({ message: 'Error approving application' });
  }
};

// Reject application
export const rejectApplication = async (req, res) => {
  try {
    const { adminNotes } = req.body;

    if (!adminNotes) {
      return res.status(400).json({ message: 'Reason for rejection required' });
    }

    const application = await Application.findOneAndUpdate(
      { applicationId: req.params.applicationId },
      {
        status: 'rejected',
        adminNotes,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({
      success: true,
      message: 'Application rejected',
      application
    });
  } catch (error) {
    console.error('Reject error:', error);
    res.status(500).json({ message: 'Error rejecting application' });
  }
};

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const total = await Application.countDocuments();
    const pending = await Application.countDocuments({ status: 'pending' });
    const approved = await Application.countDocuments({ status: 'approved' });
    const rejected = await Application.countDocuments({ status: 'rejected' });

    const byType = {
      student: await Application.countDocuments({ userType: 'student' }),
      faculty: await Application.countDocuments({ userType: 'faculty' }),
      staff: await Application.countDocuments({ userType: 'staff' })
    };

    res.json({
      success: true,
      stats: {
        total,
        pending,
        approved,
        rejected,
        byType
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

