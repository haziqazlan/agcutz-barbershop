import Admin from '../models/Admin.js';
import generateToken from '../utils/generateToken.js';

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordCorrect = await admin.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(admin._id);

    res.json({
      _id: admin._id,
      email: admin.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin profile
// @route   GET /api/auth/profile
// @access  Private
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
