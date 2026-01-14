// API client with error handling and toast notifications
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import { config } from './config';
import type {
  ApiResponse,
  Appointment,
  AppointmentFilters,
  SlotAvailability,
  Settings,
  DashboardStats,
  CalendarDateAvailability,
} from '@/types';

/**
 * Creates an Axios instance with default configuration
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: config.apiUrl,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor for logging
  client.interceptors.request.use(
    (config) => {
      console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      if (config.data) {
        console.log('   Data:', config.data);
      }
      return config;
    },
    (error) => {
      console.error('❌ Request error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for logging and error handling
  client.interceptors.response.use(
    (response) => {
      console.log(`📥 API Response: ${response.config.url}`, response.data);
      return response;
    },
    (error: AxiosError) => {
      console.error('❌ Response error:', error.message);

      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Data:', error.response.data);
      }

      return Promise.reject(error);
    }
  );

  return client;
};

const apiClient = createApiClient();

/**
 * Handles API errors and shows toast notifications
 * @param error - Axios error object
 * @param customMessage - Custom error message
 */
function handleApiError(error: unknown, customMessage?: string): never {
  console.error('❌ API Error:', error);

  let errorMessage = customMessage || 'An error occurred. Please try again.';

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;

    if (axiosError.response?.data?.error) {
      errorMessage = axiosError.response.data.error;
    } else if (axiosError.response?.data?.message) {
      errorMessage = axiosError.response.data.message;
    } else if (axiosError.message) {
      errorMessage = axiosError.message;
    }

    // Show specific error messages for different status codes
    if (axiosError.response?.status === 404) {
      errorMessage = 'Resource not found';
    } else if (axiosError.response?.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    } else if (axiosError.response?.status === 401) {
      errorMessage = 'Unauthorized. Please log in.';
    } else if (axiosError.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please check your connection.';
    } else if (axiosError.code === 'ERR_NETWORK') {
      errorMessage = 'Network error. Please check your connection.';
    }
  }

  toast.error(errorMessage);
  throw new Error(errorMessage);
}

// ============================================
// APPOINTMENT API
// ============================================

/**
 * Fetches all appointments with optional filtering
 */
export async function getAppointments(
  filters?: AppointmentFilters
): Promise<ApiResponse<Appointment[]>> {
  try {
    const response = await apiClient.get<ApiResponse<Appointment[]>>('/appointments', {
      params: filters,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch appointments');
  }
}

/**
 * Fetches a single appointment by ID
 */
export async function getAppointment(id: string): Promise<ApiResponse<Appointment>> {
  try {
    const response = await apiClient.get<ApiResponse<Appointment>>(`/appointments/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch appointment');
  }
}

/**
 * Creates a new appointment
 */
export async function createAppointment(
  data: Partial<Appointment>
): Promise<ApiResponse<Appointment>> {
  try {
    const response = await apiClient.post<ApiResponse<Appointment>>('/appointments', data);
    toast.success('Appointment created successfully!');
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to create appointment');
  }
}

/**
 * Updates an existing appointment
 */
export async function updateAppointment(
  id: string,
  data: Partial<Appointment>
): Promise<ApiResponse<Appointment>> {
  try {
    const response = await apiClient.put<ApiResponse<Appointment>>(
      `/appointments/${id}`,
      data
    );
    toast.success('Appointment updated successfully!');
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to update appointment');
  }
}

/**
 * Cancels an appointment
 */
export async function cancelAppointment(id: string): Promise<ApiResponse<Appointment>> {
  try {
    const response = await apiClient.delete<ApiResponse<Appointment>>(`/appointments/${id}`);
    toast.success('Appointment cancelled successfully!');
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to cancel appointment');
  }
}

// ============================================
// SLOT API
// ============================================

/**
 * Fetches available slots for a specific date
 */
export async function getAvailableSlots(date: string): Promise<ApiResponse<SlotAvailability>> {
  try {
    const response = await apiClient.get<ApiResponse<SlotAvailability>>('/slots/available', {
      params: { date },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch available slots');
  }
}

/**
 * Checks if a specific slot is available
 */
export async function checkSlotAvailability(
  date: string,
  time: string
): Promise<ApiResponse<{ available: boolean; reason: string; message: string }>> {
  try {
    const response = await apiClient.get<
      ApiResponse<{ available: boolean; reason: string; message: string }>
    >('/slots/check', {
      params: { date, time },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to check slot availability');
  }
}

/**
 * Blocks specific time slots
 */
export async function blockSlots(
  date: string,
  times: string[],
  reason?: string
): Promise<ApiResponse> {
  try {
    const response = await apiClient.post<ApiResponse>('/slots/block', {
      date,
      times,
      reason,
    });
    toast.success('Time slots blocked successfully!');
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to block time slots');
  }
}

/**
 * Unblocks specific time slots
 */
export async function unblockSlots(date: string, times: string[]): Promise<ApiResponse> {
  try {
    const response = await apiClient.post<ApiResponse>('/slots/unblock', {
      date,
      times,
    });
    toast.success('Time slots unblocked successfully!');
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to unblock time slots');
  }
}

/**
 * Fetches slot availability for a date range
 */
export async function getSlotAvailabilityRange(
  startDate: string,
  endDate: string
): Promise<ApiResponse<CalendarDateAvailability[]>> {
  try {
    const response = await apiClient.get<ApiResponse<CalendarDateAvailability[]>>(
      '/slots/range',
      {
        params: { startDate, endDate },
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch slot availability range');
  }
}

// ============================================
// SETTINGS API
// ============================================

/**
 * Fetches current business settings
 */
export async function getSettings(): Promise<ApiResponse<Settings>> {
  try {
    const response = await apiClient.get<ApiResponse<Settings>>('/settings');
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch settings');
  }
}

/**
 * Updates business settings
 */
export async function updateSettings(data: Partial<Settings>): Promise<ApiResponse<Settings>> {
  try {
    const response = await apiClient.put<ApiResponse<Settings>>('/settings', data);
    toast.success('Settings updated successfully!');
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to update settings');
  }
}

/**
 * Resets settings to default values
 */
export async function resetSettings(): Promise<ApiResponse<Settings>> {
  try {
    const response = await apiClient.post<ApiResponse<Settings>>('/settings/reset');
    toast.success('Settings reset to defaults!');
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to reset settings');
  }
}

// ============================================
// DASHBOARD API
// ============================================

/**
 * Fetches dashboard statistics
 */
export async function getDashboardStats(): Promise<
  ApiResponse<{
    statistics: DashboardStats;
    recentAppointments: Appointment[];
    todayAppointments: Appointment[];
  }>
> {
  try {
    const response = await apiClient.get<
      ApiResponse<{
        statistics: DashboardStats;
        recentAppointments: Appointment[];
        todayAppointments: Appointment[];
      }>
    >('/dashboard/stats');
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch dashboard statistics');
  }
}

/**
 * Fetches appointment trends
 */
export async function getAppointmentTrends(days: number = 7): Promise<ApiResponse<any[]>> {
  try {
    const response = await apiClient.get<ApiResponse<any[]>>('/dashboard/trends', {
      params: { days },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch appointment trends');
  }
}

export default apiClient;
