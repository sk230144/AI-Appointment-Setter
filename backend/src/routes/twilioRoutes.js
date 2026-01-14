// Twilio webhook routes
const express = require('express');
const router = express.Router();
const twilioController = require('../controllers/twilioController');

/**
 * POST /api/twilio/voice
 * Handles incoming voice calls from Twilio
 */
router.post('/voice', twilioController.handleVoiceWebhook);

/**
 * POST /api/twilio/gather
 * Handles speech/digit gathering from Twilio
 */
router.post('/gather', twilioController.handleGatherWebhook);

/**
 * POST /api/twilio/status
 * Handles call status callbacks from Twilio
 */
router.post('/status', twilioController.handleStatusCallback);

module.exports = router;
