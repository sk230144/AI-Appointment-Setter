// Type definitions for the application

/**
 * Appointment type
 */
export interface Appointment {
  _id: string;
  customerName: string;
  appointmentDate: string;
  appointmentTime: string;
  phoneNumber: string | null;
  callingNumber: string;
  callbackPreference: 'same_number' | 'different_number' | 'no_callback';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  twilioCallSid?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Slot type
 */
export interface Slot {
  time: string;
  formatted: string;
  status: 'available' | 'booked' | 'blocked';
}

/**
 * Slot availability response
 */
export interface SlotAvailability {
  date: string;
  totalSlots: number;
  availableSlots: Slot[];
  bookedSlots: Slot[];
  blockedSlots: Slot[];
}

/**
 * Settings type
 */
export interface Settings {
  _id: string;
  businessName: string;
  morningStart: string;
  morningEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
  slotDuration: number;
  greetingMessage: string;
  timezone: string;
  allowWeekendBookings: boolean;
  advanceBookingDays: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Dashboard statistics type
 */
export interface DashboardStats {
  totalScheduled: number;
  todayAppointments: number;
  upcomingThisWeek: number;
  completedTotal: number;
  cancelledTotal: number;
  calculatedAt: string;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Appointment filters
 */
export interface AppointmentFilters {
  status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  date?: string;
  startDate?: string;
  endDate?: string;
  customerName?: string;
  page?: number;
  limit?: number;
}

/**
 * Date range type
 */
export interface DateRange {
  startDate: string;
  endDate: string;
}

/**
 * Calendar date availability
 */
export interface CalendarDateAvailability {
  date: string;
  totalSlots: number;
  availableCount: number;
  bookedCount: number;
  blockedCount: number;
  availabilityPercentage: number;
}
