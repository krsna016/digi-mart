const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', registerUser);

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser);

// @desc    Get/Update user profile
// @route   GET/PUT /api/auth/profile
// @access  Private
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
