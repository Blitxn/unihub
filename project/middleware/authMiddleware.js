const jwt = require('jsonwebtoken');
const User = require('../model/User');

const JWT_SECRET = process.env.JWT_SECRET || 'unihub_jwt_secret';

async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Access token required'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: 'User not found'
      });
    }

    req.user = {
      id: user.u_id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();

  } catch (error) {
    return res.status(403).json({
      message: 'Invalid or expired token'
    });
  }
}

function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Forbidden: insufficient permissions'
      });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRole
};