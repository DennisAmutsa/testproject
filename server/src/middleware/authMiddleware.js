import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect - must be logged in
export const protect = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Not authorized. Please log in.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found.' });
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired session. Please log in again.' });
  }
};

// Admin only - must be admin role
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  next();
};
