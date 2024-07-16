const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  username: {
    type: String,
    trim:true,
  },
  email: {
    type: String,
    trim:true,
  },
  phone: {
    type: String,
    trim:true,
  },
  password: {
    type: String,
    trim:true,
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, 
{ timestamps: true });

const Auth = mongoose.model('Auth', authSchema);
module.exports = Auth;
