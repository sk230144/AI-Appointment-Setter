// Authentication middleware (for future admin authentication)
const jwt = require('jsonwebtoken');
const { config } = require('../config/environment');

/**
 * Middleware to verify JWT token
 * Currently a placeholder for future implementation
 */
function authMiddleware(req, res, next) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('⚠️  No authentication token provided');
      // For now, allow access without auth (can be enabled later)
      return next();
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;

    console.log(`✅ Authenticated user: ${decoded.username || decoded.id}`);

    next();
  } catch (error) {
    console.error('❌ Authentication error:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Please authenticate',
    });
  }
}

/**
 * Generates a JWT token
 * @param {Object} payload - Token payload
 * @returns {string} - JWT token
 */
function generateToken(payload) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiration,
  });
}

/**
 * Middleware to verify API key (for webhook security)
 */
function apiKeyMiddleware(req, res, next) {
  const apiKey = req.header('X-API-Key');

  if (!apiKey) {
    console.log('⚠️  No API key provided');
    // For development, allow without API key
    if (config.isDevelopment) {
      return next();
    }

    return res.status(401).json({
      success: false,
      error: 'API key required',
    });
  }

  // Verify API key (implement your own logic)
  // For now, this is a placeholder
  next();
}

module.exports = {
  authMiddleware,
  generateToken,
  apiKeyMiddleware,
};
