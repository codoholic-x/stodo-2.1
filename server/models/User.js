// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },

  lastName: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  otp: {
    type: String
  },

  otpExpiry: {
    type: Date
  },

  resetToken: {
    type: String
  },

  resetTokenExpiry: {
    type: Date
  }
}, {
  timestamps: true
});



module.exports = mongoose.model('User', userSchema);

