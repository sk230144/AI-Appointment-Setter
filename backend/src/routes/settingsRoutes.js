// Settings management routes
const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { authMiddleware } = require('../middleware/auth');

/**
 * GET /api/settings
 * Get current business settings
 */
router.get('/', settingsController.getSettings);

/**
 * PUT /api/settings
 * Update business settings
 */
router.put('/', settingsController.updateSettings);

/**
 * POST /api/settings/reset
 * Reset settings to default values
 */
router.post('/reset', settingsController.resetSettings);

module.exports = router;
