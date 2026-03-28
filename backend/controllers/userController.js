const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Enforce Gmail only
  if (!email.endsWith('@gmail.com')) {
    return res.status(400).json({ message: 'Only Gmail accounts are allowed for registration' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      user.verificationToken = verificationToken;
      user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      await user.save();

      // Send verification email
      const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
      let frontendUrl = process.env.FRONTEND_URL || (isProduction ? 'https://digi-mart-uppt.vercel.app' : 'http://localhost:3000');
      
      // Clean trailing slash
      if (frontendUrl.endsWith('/')) {
        frontendUrl = frontendUrl.slice(0, -1);
      }
      
      const verifyUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;
      
      const message = `
        <h1>Verify your email</h1>
        <p>Thank you for registering at DigiMart. Please verify your email by clicking the link below:</p>
        <a href="${verifyUrl}" style="background: #1C1917; color: white; padding: 12px 24px; text-decoration: none; border-radius: 44px; display: inline-block; font-weight: bold; margin-top: 20px;">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `;

      try {
        await sendEmail({
          email: user.email,
          subject: 'Email Verification - DigiMart',
          html: message,
        });

        res.status(201).json({
          message: 'Verification email sent. Please check your inbox.',
          email: user.email
        });
      } catch (err) {
        console.error('[Signup] Email Service Failed:', err.message);
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();
        return res.status(500).json({ 
          message: 'Account created, but verification email could not be sent. Please ensure the email service is configured correctly on Render.',
          error: err.message
        });
      }
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email to login' });
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        createdAt: user.createdAt
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
      createdAt: updatedUser.createdAt
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now login.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  verifyEmail
};
