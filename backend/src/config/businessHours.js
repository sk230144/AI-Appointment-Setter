// ============================================
// BUSINESS HOURS CONFIGURATION
// All values are read from environment variables
// Change .env file to modify timings - NO CODE CHANGES NEEDED
// ============================================

/**
 * Business hours configuration loaded from environment variables
 * This allows easy modification of operating hours without code changes
 */
const businessHours = {
  morning: {
    start: process.env.MORNING_START || '09:00',
    end: process.env.MORNING_END || '12:00',
  },
  afternoon: {
    start: process.env.AFTERNOON_START || '12:30',
    end: process.env.AFTERNOON_END || '20:00',
  },
  slotDuration: parseInt(process.env.SLOT_DURATION) || 30, // in minutes
  businessName: process.env.BUSINESS_NAME || 'My Business',
  timezone: process.env.TIMEZONE || 'America/New_York',
};

/**
 * Converts time string (HH:MM) to minutes since midnight
 * @param {string} time - Time in HH:MM format
 * @returns {number} - Minutes since midnight
 */
function timeToMinutes(time) {
  try {
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      throw new Error(`Invalid time format: ${time}`);
    }
    return hours * 60 + minutes;
  } catch (error) {
    console.error('❌ Error converting time to minutes:', error.message);
    throw error;
  }
}

/**
 * Converts minutes since midnight to time string (HH:MM)
 * @param {number} minutes - Minutes since midnight
 * @returns {string} - Time in HH:MM format
 */
function minutesToTime(minutes) {
  try {
    const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    return `${hours}:${mins}`;
  } catch (error) {
    console.error('❌ Error converting minutes to time:', error.message);
    throw error;
  }
}

/**
 * Generates all available time slots based on business hours configuration
 * @returns {string[]} - Array of time slots in HH:MM format
 */
function generateTimeSlots() {
  try {
    console.log('🕐 Generating time slots from business hours configuration...');

    const slots = [];
    const duration = businessHours.slotDuration;

    // Generate morning slots
    let current = timeToMinutes(businessHours.morning.start);
    const morningEnd = timeToMinutes(businessHours.morning.end);

    while (current < morningEnd) {
      slots.push(minutesToTime(current));
      current += duration;
    }

    // Generate afternoon slots
    current = timeToMinutes(businessHours.afternoon.start);
    const afternoonEnd = timeToMinutes(businessHours.afternoon.end);

    while (current < afternoonEnd) {
      slots.push(minutesToTime(current));
      current += duration;
    }

    console.log(`✅ Generated ${slots.length} time slots`);
    console.log(`📋 Slots: ${slots[0]} to ${slots[slots.length - 1]}`);

    return slots;
  } catch (error) {
    console.error('❌ Error generating time slots:', error.message);
    throw error;
  }
}

/**
 * Checks if a given time falls within business hours
 * @param {string} time - Time in HH:MM format
 * @returns {boolean} - True if within business hours
 */
function isWithinBusinessHours(time) {
  try {
    const timeInMinutes = timeToMinutes(time);
    const morningStart = timeToMinutes(businessHours.morning.start);
    const morningEnd = timeToMinutes(businessHours.morning.end);
    const afternoonStart = timeToMinutes(businessHours.afternoon.start);
    const afternoonEnd = timeToMinutes(businessHours.afternoon.end);

    const inMorningSlot = timeInMinutes >= morningStart && timeInMinutes < morningEnd;
    const inAfternoonSlot = timeInMinutes >= afternoonStart && timeInMinutes < afternoonEnd;

    return inMorningSlot || inAfternoonSlot;
  } catch (error) {
    console.error('❌ Error checking business hours:', error.message);
    return false;
  }
}

// Log configuration on startup
console.log('⚙️  Business Hours Configuration:');
console.log(`   Business Name: ${businessHours.businessName}`);
console.log(`   Morning: ${businessHours.morning.start} - ${businessHours.morning.end}`);
console.log(`   Afternoon: ${businessHours.afternoon.start} - ${businessHours.afternoon.end}`);
console.log(`   Slot Duration: ${businessHours.slotDuration} minutes`);
console.log(`   Timezone: ${businessHours.timezone}`);

module.exports = {
  businessHours,
  generateTimeSlots,
  timeToMinutes,
  minutesToTime,
  isWithinBusinessHours,
};
