import express from 'express';
import rateLimit from 'express-rate-limit';
import { Admin } from '../models/Admin';
import { auth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Login route
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = admin.generateAuthToken();

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify token route
router.get('/verify', auth, async (req: AuthRequest, res) => {
  try {
    const admin = await Admin.findById(req.user?.id).select('-password');
    if (!admin) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout route (client-side token removal)
router.post('/logout', auth, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Create initial admin (only for first-time setup)
router.post('/setup', async (req, res) => {
  try {
    // Check if any admin exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(403).json({ message: 'Admin already exists' });
    }

    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const admin = new Admin({
      username,
      password,
      email,
      role: 'super_admin'
    });

    await admin.save();

    const token = admin.generateAuthToken();

    res.status(201).json({
      message: 'Admin created successfully',
      token,
      user: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 