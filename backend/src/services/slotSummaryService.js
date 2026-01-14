// Slot summary service - creates human-readable summaries of available slots
const { getAvailableSlots } = require('./slotService');
const { formatTime12Hour } = require('../utils/timeUtils');

/**
 * Groups available slots into time ranges for voice announcements
 * Instead of listing 100+ slots, groups them like "9 AM to 10 AM"
 * @param {Date|string} date - Date to check
 * @returns {Promise<Object>} - Grouped slot ranges and voice message
 */
async function getAvailableSlotsSummary(date) {
  try {
    console.log('📊 Generating available slots summary for voice announcement...');

    const { availableSlots, totalSlots } = await getAvailableSlots(date);

    if (availableSlots.length === 0) {
      console.log('❌ No available slots found');
      return {
        hasSlots: false,
        message: 'Unfortunately, we have no available slots today. Please try a different day.',
        ranges: [],
        totalAvailable: 0,
        totalSlots,
      };
    }

    // Group consecutive slots into ranges
    const ranges = groupSlotsIntoRanges(availableSlots);

    // Create human-readable message
    const message = createVoiceMessage(ranges, availableSlots.length);

    console.log(`✅ Summary created: ${ranges.length} time ranges with ${availableSlots.length} slots`);

    return {
      hasSlots: true,
      message,
      ranges,
      totalAvailable: availableSlots.length,
      totalSlots,
    };
  } catch (error) {
    console.error('❌ Error generating slots summary:', error.message);
    throw error;
  }
}

/**
 * Groups consecutive available slots into hour ranges
 * Example: [9:00, 9:05, 9:10, 10:00, 10:05] becomes:
 * - "9:00 AM to 9:10 AM" (3 slots)
 * - "10:00 AM to 10:05 AM" (2 slots)
 */
function groupSlotsIntoRanges(availableSlots) {
  if (availableSlots.length === 0) return [];

  const ranges = [];
  let currentRange = {
    startTime: availableSlots[0].time,
    startFormatted: availableSlots[0].formatted,
    endTime: availableSlots[0].time,
    endFormatted: availableSlots[0].formatted,
    slotCount: 1,
    slots: [availableSlots[0].time],
  };

  for (let i = 1; i < availableSlots.length; i++) {
    const prevSlot = availableSlots[i - 1];
    const currentSlot = availableSlots[i];

    const prevMinutes = timeToMinutes(prevSlot.time);
    const currentMinutes = timeToMinutes(currentSlot.time);

    // Check if slots are within same hour range (within 60 minutes)
    const timeDiff = currentMinutes - prevMinutes;

    // If gap is less than 90 minutes, consider it same range
    if (timeDiff <= 90) {
      currentRange.endTime = currentSlot.time;
      currentRange.endFormatted = currentSlot.formatted;
      currentRange.slotCount++;
      currentRange.slots.push(currentSlot.time);
    } else {
      // New range started, save previous range
      ranges.push({ ...currentRange });
      currentRange = {
        startTime: currentSlot.time,
        startFormatted: currentSlot.formatted,
        endTime: currentSlot.time,
        endFormatted: currentSlot.formatted,
        slotCount: 1,
        slots: [currentSlot.time],
      };
    }
  }

  // Add the last range
  ranges.push(currentRange);

  return ranges;
}

/**
 * Creates a natural-sounding voice message about available slots
 */
function createVoiceMessage(ranges, totalSlots) {
  if (ranges.length === 0) {
    return 'Unfortunately, we have no available slots today.';
  }

  // If only a few slots (less than 10), list them individually
  if (totalSlots <= 8) {
    const times = ranges
      .flatMap(r => r.slots)
      .slice(0, 8)
      .map(time => formatTime12Hour(time));

    if (times.length <= 3) {
      return `We have ${times.length} slot${times.length > 1 ? 's' : ''} available: ${times.join(', or ')}. Which time works for you?`;
    } else {
      const lastTime = times.pop();
      return `We have slots available at ${times.join(', ')}, or ${lastTime}. What time would you prefer?`;
    }
  }

  // If many slots, describe by time ranges
  let message = 'We have ';

  if (ranges.length === 1) {
    const range = ranges[0];
    if (range.startTime === range.endTime) {
      message += `one slot available at ${range.startFormatted}. Would you like to book this time?`;
    } else {
      message += `${range.slotCount} slots available between ${range.startFormatted} and ${range.endFormatted}. What time would you prefer?`;
    }
  } else if (ranges.length === 2) {
    const [range1, range2] = ranges;
    message += `some slots available between ${range1.startFormatted} and ${range1.endFormatted}, `;
    message += `and also between ${range2.startFormatted} and ${range2.endFormatted}. `;
    message += 'What time works best for you?';
  } else {
    // 3 or more ranges - summarize nicely
    const descriptions = ranges.map(range => {
      if (range.slotCount === 1) {
        return `at ${range.startFormatted}`;
      } else if (range.slotCount <= 3) {
        return `a few slots around ${range.startFormatted}`;
      } else {
        return `several slots between ${range.startFormatted} and ${range.endFormatted}`;
      }
    });

    if (descriptions.length <= 3) {
      const lastDesc = descriptions.pop();
      message += `slots available ${descriptions.join(', ')}, and ${lastDesc}. `;
    } else {
      // Too many ranges, simplify further
      const firstRange = ranges[0];
      const lastRange = ranges[ranges.length - 1];
      message += `multiple time slots available throughout the day, `;
      message += `from ${firstRange.startFormatted} to ${lastRange.endFormatted}. `;
    }

    message += 'What time would you like to book?';
  }

  return message;
}

/**
 * Helper: Convert time string to minutes since midnight
 */
function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Gets available slots summary for a specific hour range
 * Useful for more targeted responses
 */
async function getSlotsSummaryForTimeRange(date, startHour, endHour) {
  try {
    console.log(`📊 Getting slots summary for ${startHour}:00 to ${endHour}:00`);

    const { availableSlots } = await getAvailableSlots(date);

    // Filter slots within the time range
    const slotsInRange = availableSlots.filter(slot => {
      const [hours] = slot.time.split(':').map(Number);
      return hours >= startHour && hours < endHour;
    });

    if (slotsInRange.length === 0) {
      return {
        hasSlots: false,
        message: `Sorry, no slots available between ${startHour}:00 and ${endHour}:00.`,
        count: 0,
      };
    }

    const times = slotsInRange.slice(0, 5).map(s => s.formatted);
    let message = '';

    if (slotsInRange.length === 1) {
      message = `We have one slot at ${times[0]}.`;
    } else if (slotsInRange.length <= 5) {
      const lastTime = times.pop();
      message = `We have slots at ${times.join(', ')}, and ${lastTime}.`;
    } else {
      message = `We have ${slotsInRange.length} slots available between ${formatTime12Hour(slotsInRange[0].time)} and ${formatTime12Hour(slotsInRange[slotsInRange.length - 1].time)}.`;
    }

    console.log(`✅ Found ${slotsInRange.length} slots in range`);

    return {
      hasSlots: true,
      message,
      count: slotsInRange.length,
      slots: slotsInRange,
    };
  } catch (error) {
    console.error('❌ Error getting slots for time range:', error.message);
    throw error;
  }
}

module.exports = {
  getAvailableSlotsSummary,
  getSlotsSummaryForTimeRange,
};
