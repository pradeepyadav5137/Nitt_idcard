import Application from '../models/Application.js';
import Admin from '../models/Admin.js';

// ===== GET ALL APPLICATIONS =====
export const getAllApplications = async (req, res) => {
  try {
    const { status, userType, search } = req.query;

    // Build query
    let query = { isDeleted: { $ne: true } };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (userType && userType !== 'all') {
      query.userType = userType;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } },
        { applicationId: { $regex: search, $options: 'i' } }
      ];
    }

    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      applications,
      count: applications.length
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};

// ===== GET DASHBOARD STATS =====
export const getDashboardStats = async (req, res) => {
  try {
    const total = await Application.countDocuments({ isDeleted: { $ne: true } });
    const submitted = await Application.countDocuments({ status: 'submitted', isDeleted: { $ne: true } });
    const processed = await Application.countDocuments({ status: 'processed', isDeleted: { $ne: true } });
    const approved = await Application.countDocuments({ status: 'approved', isDeleted: { $ne: true } });
    const rejected = await Application.countDocuments({ status: 'rejected', isDeleted: { $ne: true } });
    const student = await Application.countDocuments({ userType: 'student', isDeleted: { $ne: true } });
    const faculty = await Application.countDocuments({ 
      userType: { $in: ['faculty', 'staff'] }, 
      isDeleted: { $ne: true }
    });

    res.json({
      success: true,
      stats: {
        total,
        submitted,
        processed,
        approved,
        rejected,
        student,
        faculty,
        pending: submitted + processed // For backward compatibility with some UI components if needed
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

// Helper to find application by ID or applicationId
const findApp = async (id) => {
  if (!id) return null;

  // Try finding by MongoDB _id first if it looks like one
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    const app = await Application.findById(id);
    if (app) return app;
  }

  // Otherwise try finding by applicationId
  return await Application.findOne({ applicationId: id });
};

// ===== GET SINGLE APPLICATION =====
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await findApp(id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Failed to fetch application' });
  }
};

// ===== UPDATE APPLICATION STATUS =====
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const validStatuses = ['submitted', 'processed', 'approved', 'rejected', 'pending'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status',
        validStatuses
      });
    }

    // Map 'pending' to 'submitted' for backward compatibility
    const finalStatus = status === 'pending' ? 'submitted' : status;

    const updateData = {
      status: finalStatus,
      updatedAt: new Date()
    };

    if (reason) {
      updateData.adminNotes = reason; // Use adminNotes field from schema
      if (status === 'rejected') {
        updateData.rejectionReason = reason;
      }
    }

    // Find application first
    const application = await findApp(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update the found application
    const updatedApp = await Application.findByIdAndUpdate(
      application._id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: `Application status updated to ${finalStatus}`,
      application: updatedApp
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
};

// ===== SOFT DELETE APPLICATION =====
export const softDeleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await findApp(id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await Application.findByIdAndUpdate(
      application._id,
      { 
        isDeleted: true,
        deletedAt: new Date()
      }
    );

    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Soft delete error:', error);
    res.status(500).json({ message: 'Failed to delete application' });
  }
};

// ===== HARD DELETE APPLICATION =====
export const hardDeleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await findApp(id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await Application.findByIdAndDelete(application._id);

    res.json({
      success: true,
      message: 'Application permanently deleted'
    });
  } catch (error) {
    console.error('Hard delete error:', error);
    res.status(500).json({ message: 'Failed to permanently delete application' });
  }
};

// ===== CREATE NEW ADMIN =====
export const createAdmin = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this username or email already exists' });
    }

    // Create new admin
    const admin = new Admin({
      username,
      email,
      password, // Will be hashed by mongoose pre-save hook
      role: role || 'admin'
    });

    await admin.save();

    res.json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Failed to create admin' });
  }
};

// ===== GET ALL ADMINS =====
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      admins,
      count: admins.length
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ message: 'Failed to fetch admins' });
  }
};

// ===== DELETE ADMIN =====
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (req.admin.id === id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const admin = await Admin.findByIdAndDelete(id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ message: 'Failed to delete admin' });
  }
};