// Time utility functions for appointment booking system
const chrono = require('chrono-node');

/**
 * Parses spoken time input and converts it to 24-hour format (HH:MM)
 * Handles various speech patterns like "nine thirty", "9:30 AM", "2 PM", etc.
 * @param {string} speech - The spoken time input
 * @returns {string|null} - Time in HH:MM format or null if parsing fails
 */
function parseSpokenTime(speech) {
  try {
    console.log(`🎤 Parsing spoken time: "${speech}"`);

    if (!speech || typeof speech !== 'string') {
      console.error('❌ Invalid speech input');
      return null;
    }

    // Clean up the input
    const cleanedSpeech = speech.trim().toLowerCase();

    // Try to parse using chrono-node (handles natural language)
    const parsedDate = chrono.parse(cleanedSpeech);

    if (parsedDate && parsedDate.length > 0) {
      const date = parsedDate[0].start.date();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const time = `${hours}:${minutes}`;
      console.log(`✅ Parsed time: ${time}`);
      return time;
    }

    // Manual parsing for common patterns
    const time = manualTimeParsing(cleanedSpeech);
    if (time) {
      console.log(`✅ Manually parsed time: ${time}`);
      return time;
    }

    console.error('❌ Could not parse time from speech');
    return null;
  } catch (error) {
    console.error('❌ Error parsing spoken time:', error.message);
    return null;
  }
}

/**
 * Manual parsing for specific time patterns
 * @param {string} speech - Cleaned speech input
 * @returns {string|null} - Time in HH:MM format or null
 */
function manualTimeParsing(speech) {
  try {
    // Pattern: "9:30", "09:30", "9 30"
    let match = speech.match(/(\d{1,2})[:\s](\d{2})/);
    if (match) {
      let hours = parseInt(match[1]);
      const minutes = match[2];

      // Check for AM/PM
      if (speech.includes('pm') && hours < 12) {
        hours += 12;
      } else if (speech.includes('am') && hours === 12) {
        hours = 0;
      }

      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    }

    // Pattern: "9 o'clock", "9 oclock"
    match = speech.match(/(\d{1,2})\s*o['\s]?clock/);
    if (match) {
      let hours = parseInt(match[1]);

      if (speech.includes('pm') && hours < 12) {
        hours += 12;
      } else if (speech.includes('am') && hours === 12) {
        hours = 0;
      }

      return `${hours.toString().padStart(2, '0')}:00`;
    }

    // Pattern: "9 am", "2 pm"
    match = speech.match(/(\d{1,2})\s*(am|pm)/);
    if (match) {
      let hours = parseInt(match[1]);
      const period = match[2];

      if (period === 'pm' && hours < 12) {
        hours += 12;
      } else if (period === 'am' && hours === 12) {
        hours = 0;
      }

      return `${hours.toString().padStart(2, '0')}:00`;
    }

    // Pattern: "half past nine", "quarter past two"
    match = speech.match(/(half|quarter)\s*past\s*(\d{1,2})/);
    if (match) {
      const fraction = match[1];
      let hours = parseInt(match[2]);
      const minutes = fraction === 'half' ? '30' : '15';

      if (speech.includes('pm') && hours < 12) {
        hours += 12;
      }

      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    }

    return null;
  } catch (error) {
    console.error('❌ Error in manual time parsing:', error.message);
    return null;
  }
}

/**
 * Formats 24-hour time to 12-hour format for display
 * @param {string} time24 - Time in HH:MM format
 * @returns {string} - Time in 12-hour format (e.g., "9:30 AM")
 */
function formatTime12Hour(time24) {
  try {
    const [hours, minutes] = time24.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes)) {
      throw new Error('Invalid time format');
    }

    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('❌ Error formatting time:', error.message);
    return time24;
  }
}

/**
 * Validates if a time string is in valid HH:MM format
 * @param {string} time - Time string to validate
 * @returns {boolean} - True if valid
 */
function isValidTimeFormat(time) {
  if (!time || typeof time !== 'string') {
    return false;
  }

  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

/**
 * Gets the current date in ISO format (YYYY-MM-DD)
 * @returns {string} - Current date
 */
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Gets the current time in HH:MM format
 * @returns {string} - Current time
 */
function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Adds minutes to a time string
 * @param {string} time - Time in HH:MM format
 * @param {number} minutesToAdd - Minutes to add
 * @returns {string} - New time in HH:MM format
 */
function addMinutesToTime(time, minutesToAdd) {
  try {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + minutesToAdd;

    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;

    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('❌ Error adding minutes to time:', error.message);
    return time;
  }
}

/**
 * Calculates the difference between two times in minutes
 * @param {string} time1 - First time in HH:MM format
 * @param {string} time2 - Second time in HH:MM format
 * @returns {number} - Difference in minutes
 */
function getTimeDifferenceInMinutes(time1, time2) {
  try {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    const totalMinutes1 = hours1 * 60 + minutes1;
    const totalMinutes2 = hours2 * 60 + minutes2;

    return Math.abs(totalMinutes2 - totalMinutes1);
  } catch (error) {
    console.error('❌ Error calculating time difference:', error.message);
    return 0;
  }
}

/**
 * Checks if time1 is before time2
 * @param {string} time1 - First time in HH:MM format
 * @param {string} time2 - Second time in HH:MM format
 * @returns {boolean} - True if time1 is before time2
 */
function isTimeBefore(time1, time2) {
  try {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    const totalMinutes1 = hours1 * 60 + minutes1;
    const totalMinutes2 = hours2 * 60 + minutes2;

    return totalMinutes1 < totalMinutes2;
  } catch (error) {
    console.error('❌ Error comparing times:', error.message);
    return false;
  }
}

/**
 * Parses a date string to a Date object
 * @param {string} dateString - Date string in various formats
 * @returns {Date|null} - Parsed date or null if invalid
 */
function parseDate(dateString) {
  try {
    const parsed = chrono.parseDate(dateString);
    if (parsed) {
      return parsed;
    }

    // Try standard date parsing
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date;
    }

    return null;
  } catch (error) {
    console.error('❌ Error parsing date:', error.message);
    return null;
  }
}

/**
 * Formats a date to a readable string
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('❌ Error formatting date:', error.message);
    return date.toISOString().split('T')[0];
  }
}

module.exports = {
  parseSpokenTime,
  formatTime12Hour,
  isValidTimeFormat,
  getCurrentDate,
  getCurrentTime,
  addMinutesToTime,
  getTimeDifferenceInMinutes,
  isTimeBefore,
  parseDate,
  formatDate,
};
