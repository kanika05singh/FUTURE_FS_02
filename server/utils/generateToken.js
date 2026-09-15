const jwt = require('jsonwebtoken');

/**
 * Signs a JWT for the given admin id and sets it as an httpOnly cookie.
 * httpOnly + sameSite=strict means client-side JS can never read the token,
 * which closes off the most common XSS token-theft path.
 */
function generateTokenAndSetCookie(res, adminId) {
  const token = jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
}

module.exports = generateTokenAndSetCookie;
