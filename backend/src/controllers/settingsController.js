// Settings controller - handles business settings management
const Settings = require('../models/Settings');
const { validateBusinessHours, validateSlotDuration } = require('../utils/validators');

/**
 * Get current business settings
 * GET /api/settings
 */
async function getSettings(req, res) {
  try {
    console.log('⚙️  GET /api/settings');

    const settings = await Settings.getCurrentSettings();

    console.log('✅ Returning current settings');

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('❌ Error in getSettings:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch settings',
      message: error.message,
    });
  }
}

/**
 * Update business settings
 * PUT /api/settings
 */
async function updateSettings(req, res) {
  try {
    console.log('⚙️  PUT /api/settings');
    console.log('Body:', JSON.stringify(req.body, null, 2));

    const updates = req.body;

    // Validate business hours if being updated
    if (updates.morningStart || updates.morningEnd || updates.afternoonStart || updates.afternoonEnd) {
      const currentSettings = await Settings.getCurrentSettings();

      const hoursToValidate = {
        morningStart: updates.morningStart || currentSettings.morningStart,
        morningEnd: updates.morningEnd || currentSettings.morningEnd,
        afternoonStart: updates.afternoonStart || currentSettings.afternoonStart,
        afternoonEnd: updates.afternoonEnd || currentSettings.afternoonEnd,
      };

      const validation = validateBusinessHours(hoursToValidate);
      if (!validation.valid) {
        console.error('❌ Invalid business hours:', validation.error);
        return res.status(400).json({
          success: false,
          error: validation.error,
        });
      }
    }

    // Validate slot duration if being updated
    if (updates.slotDuration !== undefined) {
      const validation = validateSlotDuration(updates.slotDuration);
      if (!validation.valid) {
        console.error('❌ Invalid slot duration:', validation.error);
        return res.status(400).json({
          success: false,
          error: validation.error,
        });
      }
    }

    const settings = await Settings.updateSettings(updates);

    console.log('✅ Settings updated successfully');

    res.status(200).json({
      success: true,
      data: settings,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    console.error('❌ Error in updateSettings:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to update settings',
      message: error.message,
    });
  }
}

/**
 * Reset settings to default values from environment variables
 * POST /api/settings/reset
 */
async function resetSettings(req, res) {
  try {
    console.log('🔄 POST /api/settings/reset');

    const defaultSettings = {
      businessName: process.env.BUSINESS_NAME || 'My Business',
      morningStart: process.env.MORNING_START || '09:00',
      morningEnd: process.env.MORNING_END || '12:00',
      afternoonStart: process.env.AFTERNOON_START || '12:30',
      afternoonEnd: process.env.AFTERNOON_END || '20:00',
      slotDuration: parseInt(process.env.SLOT_DURATION) || 30,
      timezone: process.env.TIMEZONE || 'America/New_York',
      greetingMessage: 'Hello! Welcome to our business. I can help you book an appointment.',
    };

    const settings = await Settings.updateSettings(defaultSettings);

    console.log('✅ Settings reset to defaults');

    res.status(200).json({
      success: true,
      data: settings,
      message: 'Settings reset to default values',
    });
  } catch (error) {
    console.error('❌ Error in resetSettings:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to reset settings',
      message: error.message,
    });
  }
}

module.exports = {
  getSettings,
  updateSettings,
  resetSettings,
};
