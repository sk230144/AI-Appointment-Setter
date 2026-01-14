// Dashboard routes
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware } = require('../middleware/auth');

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics and overview
 */
router.get('/stats', dashboardController.getDashboardStats);

/**
 * GET /api/dashboard/trends
 * Get appointment trends for charts
 * Query params: days (default: 7)
 */
router.get('/trends', dashboardController.getAppointmentTrends);

module.exports = router;
