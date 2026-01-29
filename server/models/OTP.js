const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      index: true
    },
    identifierType: {
      type: String,
      enum: ['email', 'rollno'],
      required: true
    },
    otp: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean,
      default: false
    },
    attempts: {
      type: Number,
      default: 0
    },
    maxAttempts: {
      type: Number,
      default: 5
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // Auto-delete after expiry
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300 // 5 minutes
    }
  }
);

module.exports = mongoose.model('OTP', otpSchema);
