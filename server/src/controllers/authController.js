import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const sendToken = (res, user, statusCode) => {
  const token = generateToken(user._id);
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,                      // HTTPS only in production
    sameSite: isProd ? 'none' : 'lax',  // cross-origin in prod, same-site in dev
    maxAge: 100 * 365 * 24 * 60 * 60 * 1000, // 100 years
  });
  res.status(statusCode).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required.' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered.' });
    // Only allow admin creation if a special admin key is provided
    const userRole = role === 'admin' && req.body.adminKey === process.env.JWT_SECRET ? 'admin' : 'customer';
    const user = await User.create({ name, email, password, role: userRole });
    sendToken(res, user, 201);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password.' });
    sendToken(res, user, 200);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/auth/logout
export const logout = (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', '', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    expires: new Date(0),
  });
  res.json({ message: 'Logged out successfully.' });
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};
