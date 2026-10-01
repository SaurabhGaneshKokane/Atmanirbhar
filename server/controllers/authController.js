import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// Helper to generate signed JWT
const generateToken = (userId, role) => {
  const jwtSecret = process.env.JWT_SECRET || 'atmanirbhar_jwt_production_secret_key_2026';
  return jwt.sign({ id: userId, role }, jwtSecret, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new consumer or kisan
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, phone, email, password, role, location, farmDetails } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, phone number, and password.',
      });
    }

    // Check if phone number already registered
    const existingUser = await User.findOne({ phone: phone.trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this mobile phone number already exists.',
      });
    }

    // Hash password with bcryptjs (10 rounds)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in database
    const userRole = (role || 'consumer').toLowerCase();
    const user = await User.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : undefined,
      password: hashedPassword,
      role: userRole,
      location: location || { city: 'Pune' },
      farmDetails: userRole === 'farmer' ? farmDetails : undefined,
    });

    const token = generateToken(user._id, user.role);

    // Response user object without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
export const login = async (req, res) => {
  try {
    const { identifier, phone, email, password } = req.body;
    const loginId = identifier || phone || email;

    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone/email and password.',
      });
    }

    // Search user by phone or email
    const trimmedId = loginId.trim();
    const user = await User.findOne({
      $or: [{ phone: trimmedId }, { email: trimmedId.toLowerCase() }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No user found with provided identifier.',
      });
    }

    // Compare password hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
    }

    const token = generateToken(user._id, user.role);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
};

// @route   GET /api/auth/me
// @desc    Get current logged in user profile
// @access  Private (protect middleware required)
export const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user profile.',
    });
  }
};

// @route   POST /api/auth/demo-login
// @desc    1-Click Demo Login without password entry
// @access  Public
export const demoLogin = async (req, res) => {
  try {
    const targetRole = (req.body.role || 'consumer').toLowerCase();

    // Demo account presets
    const demoAccounts = {
      farmer: {
        name: 'Ramesh Patil',
        phone: '+91 98230 11223',
        email: 'ramesh.patil@kisanmail.in',
        role: 'farmer',
        location: {
          city: 'Pune',
          village: 'Shindewadi',
          coordinates: [73.8567, 18.5204],
        },
        farmDetails: {
          landSizeAcres: 4.5,
          cropsGrown: ['Fresh Desi Tomatoes', 'Hydroponic Spinach', 'A2 Gir Cow Milk'],
          isVerified: true,
          certification: 'PGS-Green Certified',
        },
      },
      consumer: {
        name: 'Aditi Sharma',
        phone: '+91 99221 44556',
        email: 'aditi.sharma@techcorp.io',
        role: 'consumer',
        location: {
          city: 'Pune',
          societyName: 'Green Acres Residency',
          coordinates: [73.8052, 18.5074],
        },
      },
      admin: {
        name: 'District Agriculture Desk',
        phone: '+91 20 2553 4100',
        email: 'agridirect.pune@mahagov.in',
        role: 'admin',
        location: {
          city: 'Pune',
          coordinates: [73.8567, 18.5204],
        },
      },
    };

    const targetAccountData = demoAccounts[targetRole] || demoAccounts.consumer;

    // Find existing demo account or upsert
    let user = await User.findOne({ phone: targetAccountData.phone });

    if (!user) {
      const defaultPasswordHash = await bcrypt.hash('DemoPass@2026', 10);
      user = await User.create({
        ...targetAccountData,
        password: defaultPasswordHash,
      });
    }

    const token = generateToken(user._id, user.role);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: `Demo login successful as ${user.role}`,
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Demo Login Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during demo login.',
    });
  }
};
