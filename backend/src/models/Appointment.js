// Appointment model - stores booking information
const mongoose = require('mongoose');

/**
 * Appointment Schema
 * Stores all information related to customer appointments
 */
const appointmentSchema = new mongoose.Schema(
  {
    // Customer information
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Customer name must be at least 2 characters long'],
      maxlength: [100, 'Customer name cannot exceed 100 characters'],
    },

    // Appointment date and time
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required'],
      index: true,
    },

    appointmentTime: {
      type: String,
      required: [true, 'Appointment time is required'],
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'],
      index: true,
    },

    // Contact information
    phoneNumber: {
      type: String,
      default: null,
      trim: true,
    },

    callingNumber: {
      type: String,
      required: [true, 'Calling number is required'],
      trim: true,
    },

    // Callback preference
    callbackPreference: {
      type: String,
      enum: {
        values: ['same_number', 'different_number', 'no_callback'],
        message: '{VALUE} is not a valid callback preference',
      },
      required: [true, 'Callback preference is required'],
      default: 'same_number',
    },

    // Appointment status
    status: {
      type: String,
      enum: {
        values: ['scheduled', 'completed', 'cancelled', 'no_show'],
        message: '{VALUE} is not a valid status',
      },
      default: 'scheduled',
      index: true,
    },

    // Twilio reference
    twilioCallSid: {
      type: String,
      trim: true,
      index: true,
    },

    // Additional notes
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Compound index for efficient slot availability queries
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });

// Compound index for status-based queries
appointmentSchema.index({ status: 1, appointmentDate: 1 });

/**
 * Instance method to format appointment details for display
 */
appointmentSchema.methods.formatForDisplay = function () {
  return {
    id: this._id,
    customerName: this.customerName,
    appointmentDate: this.appointmentDate.toISOString().split('T')[0],
    appointmentTime: this.appointmentTime,
    phoneNumber: this.phoneNumber || 'Not provided',
    callbackPreference: this.callbackPreference,
    status: this.status,
    createdAt: this.createdAt,
  };
};

/**
 * Static method to check if a slot is available
 * @param {Date} date - Appointment date
 * @param {string} time - Appointment time in HH:MM format
 * @returns {Promise<boolean>} - True if slot is available
 */
appointmentSchema.statics.isSlotAvailable = async function (date, time) {
  try {
    // Normalize date to start of day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Check for existing appointment at this time
    const existingAppointment = await this.findOne({
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      appointmentTime: time,
      status: { $in: ['scheduled'] }, // Only check scheduled appointments
    });

    return !existingAppointment;
  } catch (error) {
    console.error('❌ Error checking slot availability:', error.message);
    throw error;
  }
};

/**
 * Static method to get all appointments for a specific date
 * @param {Date} date - The date to query
 * @returns {Promise<Array>} - Array of appointments
 */
appointmentSchema.statics.getAppointmentsByDate = async function (date) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.find({
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ appointmentTime: 1 });
  } catch (error) {
    console.error('❌ Error fetching appointments by date:', error.message);
    throw error;
  }
};

// Pre-save middleware to log appointment creation
appointmentSchema.pre('save', function (next) {
  if (this.isNew) {
    console.log(`📅 Creating new appointment for ${this.customerName} at ${this.appointmentTime}`);
  } else {
    console.log(`📝 Updating appointment ${this._id}`);
  }
  next();
});

// Post-save middleware to confirm successful save
appointmentSchema.post('save', function (doc) {
  console.log(`✅ Appointment saved successfully: ${doc._id}`);
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
