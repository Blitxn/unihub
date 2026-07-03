const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'unihub_jwt_secret';

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const tokenFromHeader = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  const token = req.cookies?.token || tokenFromHeader;

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

module.exports = { authenticateToken };