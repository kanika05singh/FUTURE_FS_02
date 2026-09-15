const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const Admin = require('../models/Admin');

/**
 * Protects routes by requiring a valid JWT, read from the httpOnly cookie.
 * Attaches the authenticated admin (minus password) to req.admin.
 */
const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Not authorized, admin not found' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, invalid or expired token' });
  }
});

module.exports = { protect };
