const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    // Common fields
    applicationId: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['student', 'faculty', 'staff'],
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected'],
      default: 'draft'
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date,
    rejectionReason: String,

    // Student specific
    rollNumber: String,
    studentEmail: String,
    studentName: String,
    fathersName: String,
    programme: String,
    branch: String,
    duration: String,
    parentMobileNumber: String,

    // Faculty/Staff specific
    employeeId: String,
    staffEmail: String,
    staffName: String,
    title: String,
    designation: String,
    department: String,
    dateOfJoining: Date,
    dateOfRetirement: Date,

    // Common personal info
    gender: String,
    bloodGroup: String,
    dateOfBirth: Date,
    mobileNumber: String,
    address: String,

    // Request details
    requestCategory: {
      type: String,
      enum: ['Lost', 'Damaged', 'Correction', 'New', 'Update'],
      required: true
    },
    dataToBeChanged: [String],
    reasonForDuplicate: String,

    // File uploads
    photoFile: {
      filename: String,
      path: String,
      size: Number,
      uploadedAt: Date
    },
    firCopyFile: {
      filename: String,
      path: String,
      size: Number,
      uploadedAt: Date
    },
    paymentReceiptFile: {
      filename: String,
      path: String,
      size: Number,
      uploadedAt: Date
    },

    // Verification status
    emailVerified: {
      type: Boolean,
      default: false
    },
    emailVerifiedAt: Date,

    // Step tracking
    currentStep: {
      type: Number,
      enum: [0, 1, 2, 3, 4],
      default: 0
    },
    stepsCompleted: {
      emailVerification: Boolean,
      formFilled: Boolean,
      documentsUploaded: Boolean,
      previewConfirmed: Boolean
    },

    // Admin notes
    adminNotes: String,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    approvedAt: Date,

    submittedAt: Date
  },
  {
    timestamps: true
  }
);

// Index for faster queries
applicationSchema.index({ type: 1, status: 1 });
applicationSchema.index({ createdAt: -1 });
applicationSchema.index({ emailVerified: 1, status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
