const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/verify-email-otp', authController.verifyEmailOtp);
router.post('/login', authController.loginUser);
router.post('/refresh-token', authController.refreshToken); 
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password' , authController.resetPassword);
router.post('/signin-phone', authController.signInWithPhone);
router.post('/verify-otp', authController.verifyOtp);


module.exports = router;
