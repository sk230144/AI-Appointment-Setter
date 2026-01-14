// Slot controller - handles slot availability and blocking
const slotService = require('../services/slotService');
const { isValidTimeFormat } = require('../utils/timeUtils');

/**
 * Get available slots for a specific date
 * GET /api/slots/available?date=YYYY-MM-DD
 */
async function getAvailableSlots(req, res) {
  try {
    const { date } = req.query;
    console.log(`🔍 GET /api/slots/available?date=${date}`);

    if (!date) {
      console.error('❌ Missing date parameter');
      return res.status(400).json({
        success: false,
        error: 'Date parameter is required (format: YYYY-MM-DD)',
      });
    }

    // Validate date format
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      console.error('❌ Invalid date format');
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD',
      });
    }

    const slots = await slotService.getAvailableSlots(date);

    console.log(`✅ Returning slot availability for ${date}`);

    res.status(200).json({
      success: true,
      data: slots,
    });
  } catch (error) {
    console.error('❌ Error in getAvailableSlots:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available slots',
      message: error.message,
    });
  }
}

/**
 * Check if a specific slot is available
 * GET /api/slots/check?date=YYYY-MM-DD&time=HH:MM
 */
async function checkSlotAvailability(req, res) {
  try {
    const { date, time } = req.query;
    console.log(`🔍 GET /api/slots/check?date=${date}&time=${time}`);

    if (!date || !time) {
      console.error('❌ Missing parameters');
      return res.status(400).json({
        success: false,
        error: 'Date and time parameters are required',
      });
    }

    // Validate time format
    if (!isValidTimeFormat(time)) {
      console.error('❌ Invalid time format');
      return res.status(400).json({
        success: false,
        error: 'Invalid time format. Use HH:MM (24-hour format)',
      });
    }

    const availability = await slotService.checkSlotAvailability(date, time);

    console.log(`✅ Slot availability checked: ${availability.available ? 'Available' : 'Not available'}`);

    res.status(200).json({
      success: true,
      data: availability,
    });
  } catch (error) {
    console.error('❌ Error in checkSlotAvailability:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to check slot availability',
      message: error.message,
    });
  }
}

/**
 * Block specific time slots
 * POST /api/slots/block
 */
async function blockSlots(req, res) {
  try {
    console.log('🚫 POST /api/slots/block');
    console.log('Body:', JSON.stringify(req.body, null, 2));

    const { date, times, reason } = req.body;

    if (!date || !times || !Array.isArray(times) || times.length === 0) {
      console.error('❌ Invalid request body');
      return res.status(400).json({
        success: false,
        error: 'Date and times array are required',
      });
    }

    // Validate all times
    const invalidTimes = times.filter(time => !isValidTimeFormat(time));
    if (invalidTimes.length > 0) {
      console.error('❌ Invalid time formats:', invalidTimes);
      return res.status(400).json({
        success: false,
        error: `Invalid time formats: ${invalidTimes.join(', ')}. Use HH:MM format`,
      });
    }

    const blockedSlot = await slotService.blockTimeSlots(date, times, reason);

    console.log(`✅ Blocked ${times.length} slots on ${date}`);

    res.status(200).json({
      success: true,
      data: blockedSlot,
      message: `Successfully blocked ${times.length} time slots`,
    });
  } catch (error) {
    console.error('❌ Error in blockSlots:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to block time slots',
      message: error.message,
    });
  }
}

/**
 * Unblock specific time slots
 * POST /api/slots/unblock
 */
async function unblockSlots(req, res) {
  try {
    console.log('✅ POST /api/slots/unblock');
    console.log('Body:', JSON.stringify(req.body, null, 2));

    const { date, times } = req.body;

    if (!date || !times || !Array.isArray(times) || times.length === 0) {
      console.error('❌ Invalid request body');
      return res.status(400).json({
        success: false,
        error: 'Date and times array are required',
      });
    }

    // Validate all times
    const invalidTimes = times.filter(time => !isValidTimeFormat(time));
    if (invalidTimes.length > 0) {
      console.error('❌ Invalid time formats:', invalidTimes);
      return res.status(400).json({
        success: false,
        error: `Invalid time formats: ${invalidTimes.join(', ')}. Use HH:MM format`,
      });
    }

    const result = await slotService.unblockTimeSlots(date, times);

    console.log(`✅ Unblocked ${times.length} slots on ${date}`);

    res.status(200).json({
      success: true,
      data: result,
      message: `Successfully unblocked ${times.length} time slots`,
    });
  } catch (error) {
    console.error('❌ Error in unblockSlots:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to unblock time slots',
      message: error.message,
    });
  }
}

/**
 * Get slot availability for a date range (calendar view)
 * GET /api/slots/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
async function getSlotAvailabilityRange(req, res) {
  try {
    const { startDate, endDate } = req.query;
    console.log(`📅 GET /api/slots/range?startDate=${startDate}&endDate=${endDate}`);

    if (!startDate || !endDate) {
      console.error('❌ Missing parameters');
      return res.status(400).json({
        success: false,
        error: 'startDate and endDate parameters are required',
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error('❌ Invalid date format');
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD',
      });
    }

    if (start > end) {
      console.error('❌ Start date is after end date');
      return res.status(400).json({
        success: false,
        error: 'startDate must be before or equal to endDate',
      });
    }

    const availability = await slotService.getSlotAvailabilityRange(startDate, endDate);

    console.log(`✅ Returning availability for ${availability.length} dates`);

    res.status(200).json({
      success: true,
      data: availability,
    });
  } catch (error) {
    console.error('❌ Error in getSlotAvailabilityRange:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch slot availability range',
      message: error.message,
    });
  }
}

module.exports = {
  getAvailableSlots,
  checkSlotAvailability,
  blockSlots,
  unblockSlots,
  getSlotAvailabilityRange,
};
