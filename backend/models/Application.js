import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    unique: true,
    required: true
  },
  userType: {
    type: String,
    enum: ['student', 'faculty', 'staff'],
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  
  // Student fields
  rollNo: String,
  name: String,
  fatherName: String,
  motherName: String,
  programme: String,
  branch: String,
  batch: String,
  semester: String,
  hostel: String,
  roomNo: String,
  
  // Faculty/Staff fields
  staffNo: String,
  staffName: String,
  title: String,
  designation: String,
  department: String,
  joiningDate: Date,
  retirementDate: Date,
  
  // Common fields
  phone: String,
  parentMobile: String,
  dob: Date,
  gender: String,
  bloodGroup: String,
  
  // Address
  addressLine1: String,
  addressLine2: String,
  district: String,
  state: String,
  pinCode: String,
  
  // Document request
  requestCategory: {
    type: String,
    enum: ['Lost', 'Damaged', 'Correction', 'New', 'Stolen', 'Update']
  },
  reasonDetails: String,
  firNumber: String,
  firDate: Date,
  policeStation: String,
  
  // File URLs (local path or Firebase Storage URL)
  photoPath: String,
  firPath: String,
  paymentPath: String,
  applicationPdfUrl: String,
  
  // Status
  status: {
    type: String,
    enum: ['submitted', 'processed', 'approved', 'rejected'],
    default: 'submitted'
  },
  adminNotes: String,
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Application', applicationSchema);
