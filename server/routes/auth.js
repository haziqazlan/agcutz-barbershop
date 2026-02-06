import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { loginValidation, validate } from '../middleware/validation.js';

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', loginValidation, validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token and send response
    const token = generateToken(admin._id);

    res.json({
      _id: admin._id,
      email: admin.email,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;
