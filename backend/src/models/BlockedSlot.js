// BlockedSlot model - manages blocked time slots
const mongoose = require('mongoose');

/**
 * BlockedSlot Schema
 * Allows administrators to block specific time slots on certain dates
 */
const blockedSlotSchema = new mongoose.Schema(
  {
    // The date for which slots are blocked
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true,
    },

    // Array of blocked time slots in HH:MM format
    blockedTimes: {
      type: [String],
      required: [true, 'At least one blocked time is required'],
      validate: {
        validator: function (times) {
          // Ensure all times are in HH:MM format
          const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
          return times.every((time) => timeRegex.test(time));
        },
        message: 'All blocked times must be in HH:MM format',
      },
    },

    // Reason for blocking
    reason: {
      type: String,
      trim: true,
      maxlength: [200, 'Reason cannot exceed 200 characters'],
      default: 'Unavailable',
    },

    // Who created this block (optional for future admin tracking)
    createdBy: {
      type: String,
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient date-based queries
blockedSlotSchema.index({ date: 1 });

/**
 * Static method to check if a specific time slot is blocked on a given date
 * @param {Date} date - The date to check
 * @param {string} time - The time slot in HH:MM format
 * @returns {Promise<boolean>} - True if slot is blocked
 */
blockedSlotSchema.statics.isSlotBlocked = async function (date, time) {
  try {
    // Normalize date to start of day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const blockedSlot = await this.findOne({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      blockedTimes: time,
    });

    return !!blockedSlot;
  } catch (error) {
    console.error('❌ Error checking if slot is blocked:', error.message);
    throw error;
  }
};

/**
 * Static method to get all blocked slots for a specific date
 * @param {Date} date - The date to query
 * @returns {Promise<Array>} - Array of blocked time slots
 */
blockedSlotSchema.statics.getBlockedSlotsForDate = async function (date) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const blockedSlots = await this.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    // Flatten all blocked times into a single array
    const allBlockedTimes = blockedSlots.reduce((acc, slot) => {
      return acc.concat(slot.blockedTimes);
    }, []);

    return [...new Set(allBlockedTimes)]; // Remove duplicates
  } catch (error) {
    console.error('❌ Error fetching blocked slots for date:', error.message);
    throw error;
  }
};

/**
 * Static method to block multiple time slots on a date
 * @param {Date} date - The date to block slots on
 * @param {Array<string>} times - Array of time slots to block
 * @param {string} reason - Reason for blocking
 * @returns {Promise<Object>} - The created blocked slot document
 */
blockedSlotSchema.statics.blockSlots = async function (date, times, reason = 'Unavailable') {
  try {
    console.log(`🚫 Blocking ${times.length} slots on ${date.toISOString().split('T')[0]}`);

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    // Check if there's already a blocked slot document for this date
    let blockedSlot = await this.findOne({
      date: {
        $gte: startOfDay,
        $lte: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (blockedSlot) {
      // Add new times to existing blocked times
      const uniqueTimes = [...new Set([...blockedSlot.blockedTimes, ...times])];
      blockedSlot.blockedTimes = uniqueTimes;
      blockedSlot.reason = reason;
      await blockedSlot.save();
      console.log(`✅ Updated blocked slots for ${startOfDay.toISOString().split('T')[0]}`);
    } else {
      // Create new blocked slot document
      blockedSlot = await this.create({
        date: startOfDay,
        blockedTimes: times,
        reason,
      });
      console.log(`✅ Created new blocked slots for ${startOfDay.toISOString().split('T')[0]}`);
    }

    return blockedSlot;
  } catch (error) {
    console.error('❌ Error blocking slots:', error.message);
    throw error;
  }
};

// Pre-save middleware
blockedSlotSchema.pre('save', function (next) {
  console.log(`🚫 Blocking ${this.blockedTimes.length} time slots for ${this.date.toISOString().split('T')[0]}`);
  next();
});

const BlockedSlot = mongoose.model('BlockedSlot', blockedSlotSchema);

module.exports = BlockedSlot;
