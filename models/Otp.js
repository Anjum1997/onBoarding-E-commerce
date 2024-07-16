const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    default: ""
  },
  phone: {
    type: String,
    trim:true,
    default: ""
  },
  code: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;
