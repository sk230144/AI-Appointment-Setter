// Validation utility functions
const { isValidTimeFormat } = require('./timeUtils');

/**
 * Validates phone number format
 * Accepts various formats: +1234567890, (123) 456-7890, 123-456-7890, etc.
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} - True if valid
 */
function isValidPhoneNumber(phoneNumber) {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return false;
  }

  // Remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  // Check if it has 10-15 digits (accommodates international numbers)
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

/**
 * Validates customer name
 * @param {string} name - Name to validate
 * @returns {object} - { valid: boolean, error: string }
 */
function validateCustomerName(name) {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Name is required' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters long' };
  }

  if (trimmedName.length > 100) {
    return { valid: false, error: 'Name cannot exceed 100 characters' };
  }

  // Check for valid name characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(trimmedName)) {
    return { valid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { valid: true, error: null };
}

/**
 * Validates appointment date
 * @param {Date|string} date - Date to validate
 * @returns {object} - { valid: boolean, error: string }
 */
function validateAppointmentDate(date) {
  try {
    const appointmentDate = new Date(date);

    if (isNaN(appointmentDate.getTime())) {
      return { valid: false, error: 'Invalid date format' };
    }

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return { valid: false, error: 'Cannot book appointments in the past' };
    }

    // Check if date is too far in the future (e.g., 90 days)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);

    if (appointmentDate > maxDate) {
      return { valid: false, error: 'Cannot book appointments more than 90 days in advance' };
    }

    return { valid: true, error: null };
  } catch (error) {
    console.error('❌ Error validating date:', error.message);
    return { valid: false, error: 'Invalid date' };
  }
}

/**
 * Validates appointment time format and value
 * @param {string} time - Time in HH:MM format
 * @returns {object} - { valid: boolean, error: string }
 */
function validateAppointmentTime(time) {
  if (!isValidTimeFormat(time)) {
    return { valid: false, error: 'Time must be in HH:MM format' };
  }

  return { valid: true, error: null };
}

/**
 * Validates callback preference
 * @param {string} preference - Callback preference value
 * @returns {boolean} - True if valid
 */
function isValidCallbackPreference(preference) {
  const validPreferences = ['same_number', 'different_number', 'no_callback'];
  return validPreferences.includes(preference);
}

/**
 * Validates appointment status
 * @param {string} status - Status value
 * @returns {boolean} - True if valid
 */
function isValidAppointmentStatus(status) {
  const validStatuses = ['scheduled', 'completed', 'cancelled', 'no_show'];
  return validStatuses.includes(status);
}

/**
 * Validates slot duration
 * @param {number} duration - Duration in minutes
 * @returns {object} - { valid: boolean, error: string }
 */
function validateSlotDuration(duration) {
  if (typeof duration !== 'number' || isNaN(duration)) {
    return { valid: false, error: 'Slot duration must be a number' };
  }

  if (duration < 15) {
    return { valid: false, error: 'Slot duration must be at least 15 minutes' };
  }

  if (duration > 120) {
    return { valid: false, error: 'Slot duration cannot exceed 120 minutes' };
  }

  return { valid: true, error: null };
}

/**
 * Validates business hours configuration
 * @param {object} hours - Business hours object
 * @returns {object} - { valid: boolean, error: string }
 */
function validateBusinessHours(hours) {
  try {
    const { morningStart, morningEnd, afternoonStart, afternoonEnd } = hours;

    // Validate time formats
    if (!isValidTimeFormat(morningStart) || !isValidTimeFormat(morningEnd) ||
        !isValidTimeFormat(afternoonStart) || !isValidTimeFormat(afternoonEnd)) {
      return { valid: false, error: 'All times must be in HH:MM format' };
    }

    // Convert to minutes for comparison
    const msMinutes = timeToMinutes(morningStart);
    const meMinutes = timeToMinutes(morningEnd);
    const asMinutes = timeToMinutes(afternoonStart);
    const aeMinutes = timeToMinutes(afternoonEnd);

    // Morning start must be before morning end
    if (msMinutes >= meMinutes) {
      return { valid: false, error: 'Morning start time must be before morning end time' };
    }

    // Afternoon start must be before afternoon end
    if (asMinutes >= aeMinutes) {
      return { valid: false, error: 'Afternoon start time must be before afternoon end time' };
    }

    // Morning end should be before or equal to afternoon start (no overlap)
    if (meMinutes > asMinutes) {
      return { valid: false, error: 'Morning and afternoon hours should not overlap' };
    }

    return { valid: true, error: null };
  } catch (error) {
    console.error('❌ Error validating business hours:', error.message);
    return { valid: false, error: 'Invalid business hours configuration' };
  }
}

/**
 * Helper function to convert time to minutes
 * @param {string} time - Time in HH:MM format
 * @returns {number} - Minutes since midnight
 */
function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Validates email format (for future features)
 * @param {string} email - Email address
 * @returns {boolean} - True if valid
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitizes user input to prevent XSS attacks
 * @param {string} input - User input string
 * @returns {string} - Sanitized string
 */
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .substring(0, 500); // Limit length
}

/**
 * Validates pagination parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {object} - { valid: boolean, page: number, limit: number, error: string }
 */
function validatePagination(page, limit) {
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 10;

  if (parsedPage < 1) {
    return { valid: false, page: 1, limit: parsedLimit, error: 'Page must be at least 1' };
  }

  if (parsedLimit < 1 || parsedLimit > 100) {
    return { valid: false, page: parsedPage, limit: 10, error: 'Limit must be between 1 and 100' };
  }

  return { valid: true, page: parsedPage, limit: parsedLimit, error: null };
}

module.exports = {
  isValidPhoneNumber,
  validateCustomerName,
  validateAppointmentDate,
  validateAppointmentTime,
  isValidCallbackPreference,
  isValidAppointmentStatus,
  validateSlotDuration,
  validateBusinessHours,
  isValidEmail,
  sanitizeInput,
  validatePagination,
};
