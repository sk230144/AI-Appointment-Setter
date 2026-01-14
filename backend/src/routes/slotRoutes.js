// Slot management routes
const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');
const { authMiddleware } = require('../middleware/auth');

/**
 * GET /api/slots/available
 * Get available slots for a specific date
 * Query params: date (YYYY-MM-DD)
 */
router.get('/available', slotController.getAvailableSlots);

/**
 * GET /api/slots/check
 * Check if a specific slot is available
 * Query params: date (YYYY-MM-DD), time (HH:MM)
 */
router.get('/check', slotController.checkSlotAvailability);

/**
 * GET /api/slots/range
 * Get slot availability for a date range (calendar view)
 * Query params: startDate (YYYY-MM-DD), endDate (YYYY-MM-DD)
 */
router.get('/range', slotController.getSlotAvailabilityRange);

/**
 * POST /api/slots/block
 * Block specific time slots
 * Body: { date, times[], reason }
 */
router.post('/block', slotController.blockSlots);

/**
 * POST /api/slots/unblock
 * Unblock specific time slots
 * Body: { date, times[] }
 */
router.post('/unblock', slotController.unblockSlots);

module.exports = router;
