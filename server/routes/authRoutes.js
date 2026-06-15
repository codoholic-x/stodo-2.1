// server/routes/authRoutes.js
const express = require('express');
const {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const router = express.Router();

// 📝 Register User
router.post('/register', register);

// 🔐 Verify OTP
router.post('/verify-otp', verifyOtp);

// 🔑 Login (Email/Username + Password)
router.post('/login', login);

// 🔁 Forgot Password
router.post('/forgot-password', forgotPassword);

// 🔄 Reset Password
router.post('/reset-password/:token', resetPassword);

module.exports = router;
