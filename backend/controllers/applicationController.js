import Application from '../models/Application.js';

// Generate unique application ID
const generateAppId = (userType) => {
  const prefix = userType === 'student' ? 'STU' : userType === 'faculty' ? 'FAC' : 'STF';
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(5, '0');
  return `NITT-${prefix}-${year}-${random}`;
};

// Submit application
export const submitApplication = async (req, res) => {
  try {
    const { userType, ...formData } = req.body;

    if (!userType || !['student', 'faculty', 'staff'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    const applicationId = generateAppId(userType);

    const application = new Application({
      applicationId,
      userType,
      ...formData,
      photoPath: req.files?.photo?.[0]?.filename,
      firPath: req.files?.fir?.[0]?.filename,
      paymentPath: req.files?.payment?.[0]?.filename
    });

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

// Get application status
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

// Get all applications (admin)
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

