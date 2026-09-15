const Admin = require('../models/Admin');
const asyncHandler = require('../utils/asyncHandler');
const generateTokenAndSetCookie = require('../utils/generateToken');

/**
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  generateTokenAndSetCookie(res, admin._id);

  res.status(200).json({
    success: true,
    data: { id: admin._id, name: admin.name, email: admin.email },
  });
});

/**
 * POST /api/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ success: true, data: {} });
});

/**
 * GET /api/auth/me — used by the frontend on page load to check the session
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: { id: req.admin._id, name: req.admin.name, email: req.admin.email },
  });
});

module.exports = { login, logout, getMe };
