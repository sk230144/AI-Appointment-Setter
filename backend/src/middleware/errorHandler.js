// Global error handling middleware
const { config } = require('../config/environment');

/**
 * Centralized error handler middleware
 * Catches all errors and sends appropriate responses
 */
function errorHandler(err, req, res, next) {
  console.error('❌ Error Handler Triggered:');
  console.error('   Error:', err.message);
  console.error('   Stack:', err.stack);
  console.error('   Path:', req.path);
  console.error('   Method:', req.method);
  console.error('   Body:', JSON.stringify(req.body));

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errors,
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format',
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      error: `Duplicate value for field: ${field}`,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired',
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(config.isDevelopment && { stack: err.stack }),
  });
}

/**
 * Handle 404 Not Found errors
 */
function notFoundHandler(req, res, next) {
  console.log(`⚠️  404 Not Found: ${req.method} ${req.path}`);

  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
  });
}

/**
 * Async error wrapper to catch errors in async route handlers
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
