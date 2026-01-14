// Frontend configuration - reads from environment variables

/**
 * Application configuration
 * All values are read from environment variables for easy customization
 */
export const config = {
  // API configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',

  // Business hours configuration
  businessHours: {
    morning: {
      start: process.env.NEXT_PUBLIC_MORNING_START || '09:00',
      end: process.env.NEXT_PUBLIC_MORNING_END || '12:00',
    },
    afternoon: {
      start: process.env.NEXT_PUBLIC_AFTERNOON_START || '12:30',
      end: process.env.NEXT_PUBLIC_AFTERNOON_END || '20:00',
    },
    slotDuration: parseInt(process.env.NEXT_PUBLIC_SLOT_DURATION || '30'),
  },

  // Business information
  businessName: process.env.NEXT_PUBLIC_BUSINESS_NAME || 'My Business',
};

/**
 * Formats time from 24-hour to 12-hour format for display
 * @param time24 - Time in HH:MM format
 * @returns Formatted time string (e.g., "9:30 AM")
 */
export function formatTimeDisplay(time24: string): string {
  try {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return time24;
  }
}

/**
 * Formats a date object to YYYY-MM-DD string
 * @param date - Date object
 * @returns Date string in YYYY-MM-DD format
 */
export function formatDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Formats a date string for display
 * @param dateString - Date string
 * @returns Formatted date (e.g., "January 15, 2024")
 */
export function formatDateDisplay(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Get status color class based on appointment status
 * @param status - Appointment status
 * @returns CSS class name
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    scheduled: 'badge-info',
    completed: 'badge-success',
    cancelled: 'badge-danger',
    no_show: 'badge-warning',
  };
  return colors[status] || 'badge-secondary';
}

/**
 * Get slot status color class
 * @param status - Slot status
 * @returns CSS class name
 */
export function getSlotColor(status: string): string {
  const colors: Record<string, string> = {
    available: 'slot-available',
    booked: 'slot-booked',
    blocked: 'slot-blocked',
  };
  return colors[status] || 'bg-gray-300';
}

console.log('⚙️  Frontend Configuration Loaded:');
console.log('   API URL:', config.apiUrl);
console.log('   Business Name:', config.businessName);
console.log('   Business Hours:', config.businessHours);
