// Settings model - stores business configuration
const mongoose = require('mongoose');

/**
 * Settings Schema
 * Stores configurable business settings that can be modified via admin dashboard
 */
const settingsSchema = new mongoose.Schema(
  {
    // Business information
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: [100, 'Business name cannot exceed 100 characters'],
    },

    // Morning hours
    morningStart: {
      type: String,
      required: [true, 'Morning start time is required'],
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'],
      default: '09:00',
    },

    morningEnd: {
      type: String,
      required: [true, 'Morning end time is required'],
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'],
      default: '12:00',
    },

    // Afternoon hours
    afternoonStart: {
      type: String,
      required: [true, 'Afternoon start time is required'],
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'],
      default: '12:30',
    },

    afternoonEnd: {
      type: String,
      required: [true, 'Afternoon end time is required'],
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'],
      default: '20:00',
    },

    // Slot configuration
    slotDuration: {
      type: Number,
      required: [true, 'Slot duration is required'],
      min: [15, 'Slot duration must be at least 15 minutes'],
      max: [120, 'Slot duration cannot exceed 120 minutes'],
      default: 30,
    },

    // Voice greeting message
    greetingMessage: {
      type: String,
      trim: true,
      maxlength: [500, 'Greeting message cannot exceed 500 characters'],
      default: 'Hello! Welcome to our business. I can help you book an appointment.',
    },

    // Timezone
    timezone: {
      type: String,
      required: [true, 'Timezone is required'],
      default: 'America/New_York',
    },

    // Additional settings
    allowWeekendBookings: {
      type: Boolean,
      default: true,
    },

    advanceBookingDays: {
      type: Number,
      min: [1, 'Advance booking days must be at least 1'],
      max: [90, 'Advance booking days cannot exceed 90'],
      default: 30,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Static method to get current settings (singleton pattern)
 * Creates default settings if none exist
 */
settingsSchema.statics.getCurrentSettings = async function () {
  try {
    let settings = await this.findOne();

    // If no settings exist, create default settings
    if (!settings) {
      console.log('📋 No settings found, creating default settings...');
      settings = await this.create({
        businessName: process.env.BUSINESS_NAME || 'My Business',
        morningStart: process.env.MORNING_START || '09:00',
        morningEnd: process.env.MORNING_END || '12:00',
        afternoonStart: process.env.AFTERNOON_START || '12:30',
        afternoonEnd: process.env.AFTERNOON_END || '20:00',
        slotDuration: parseInt(process.env.SLOT_DURATION) || 30,
        timezone: process.env.TIMEZONE || 'America/New_York',
      });
      console.log('✅ Default settings created successfully');
    }

    return settings;
  } catch (error) {
    console.error('❌ Error fetching current settings:', error.message);
    throw error;
  }
};

/**
 * Static method to update settings
 * @param {Object} updates - Object containing settings to update
 */
settingsSchema.statics.updateSettings = async function (updates) {
  try {
    console.log('⚙️  Updating settings...');

    let settings = await this.findOne();

    if (!settings) {
      settings = await this.create(updates);
      console.log('✅ Settings created with updates');
    } else {
      Object.assign(settings, updates);
      await settings.save();
      console.log('✅ Settings updated successfully');
    }

    return settings;
  } catch (error) {
    console.error('❌ Error updating settings:', error.message);
    throw error;
  }
};

/**
 * Instance method to validate business hours logic
 */
settingsSchema.methods.validateBusinessHours = function () {
  const morningStartMinutes = this.timeToMinutes(this.morningStart);
  const morningEndMinutes = this.timeToMinutes(this.morningEnd);
  const afternoonStartMinutes = this.timeToMinutes(this.afternoonStart);
  const afternoonEndMinutes = this.timeToMinutes(this.afternoonEnd);

  // Morning hours should be before afternoon hours
  if (morningStartMinutes >= morningEndMinutes) {
    throw new Error('Morning start time must be before morning end time');
  }

  if (afternoonStartMinutes >= afternoonEndMinutes) {
    throw new Error('Afternoon start time must be before afternoon end time');
  }

  if (morningEndMinutes > afternoonStartMinutes) {
    throw new Error('Morning hours and afternoon hours should not overlap');
  }

  return true;
};

/**
 * Helper method to convert time to minutes
 */
settingsSchema.methods.timeToMinutes = function (time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Pre-save validation
settingsSchema.pre('save', function (next) {
  try {
    console.log('🔍 Validating settings before save...');
    this.validateBusinessHours();
    console.log('✅ Settings validation passed');
    next();
  } catch (error) {
    console.error('❌ Settings validation failed:', error.message);
    next(error);
  }
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
