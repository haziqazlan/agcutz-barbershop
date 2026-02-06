import Admin from '../models/Admin.js';
import { generateToken } from '../utils/jwt.js';

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current admin profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        admin: req.admin,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create initial admin account (for setup only)
// @route   POST /api/auth/setup
// @access  Public (should be disabled after initial setup)
export const setupAdmin = async (req, res, next) => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne();

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin account already exists. Setup not allowed.',
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Create admin
    const admin = await Admin.create({ email, password });

    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};
