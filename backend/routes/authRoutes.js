const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  verifyEmail,
  sendTestEmail 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', registerUser);

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser);

// @desc    Verify user email
// @route   GET /api/auth/verify/:token
// @access  Public
router.get('/verify/:token', verifyEmail);

// @desc    Get/Update user profile
// @route   GET/PUT /api/auth/profile
// @access  Private
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

// @desc    Test email sender
// @route   POST /api/auth/test-email
// @access  Public
router.post('/test-email', sendTestEmail);

module.exports = router;
