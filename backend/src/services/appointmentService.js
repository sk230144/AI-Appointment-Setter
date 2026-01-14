// Appointment service - handles all appointment-related business logic
const Appointment = require('../models/Appointment');
const { validateCustomerName, validateAppointmentDate, validateAppointmentTime } = require('../utils/validators');
const { formatTime12Hour } = require('../utils/timeUtils');

/**
 * Creates a new appointment after validation
 * @param {Object} appointmentData - Appointment details
 * @returns {Promise<Object>} - Created appointment
 */
async function createAppointment(appointmentData) {
  try {
    console.log('📝 Creating new appointment...');
    console.log('Data:', JSON.stringify(appointmentData, null, 2));

    // Validate customer name
    const nameValidation = validateCustomerName(appointmentData.customerName);
    if (!nameValidation.valid) {
      throw new Error(nameValidation.error);
    }

    // Validate appointment date
    const dateValidation = validateAppointmentDate(appointmentData.appointmentDate);
    if (!dateValidation.valid) {
      throw new Error(dateValidation.error);
    }

    // Validate appointment time
    const timeValidation = validateAppointmentTime(appointmentData.appointmentTime);
    if (!timeValidation.valid) {
      throw new Error(timeValidation.error);
    }

    // Create appointment
    const appointment = await Appointment.create(appointmentData);

    console.log(`✅ Appointment created successfully: ${appointment._id}`);
    console.log(`   Customer: ${appointment.customerName}`);
    console.log(`   Time: ${appointment.appointmentTime} on ${appointment.appointmentDate.toISOString().split('T')[0]}`);

    return appointment;
  } catch (error) {
    console.error('❌ Error creating appointment:', error.message);
    throw error;
  }
}

/**
 * Retrieves all appointments with optional filtering
 * @param {Object} filters - Filter options (status, date range, etc.)
 * @param {Object} pagination - Pagination options (page, limit)
 * @returns {Promise<Object>} - Appointments and metadata
 */
async function getAppointments(filters = {}, pagination = {}) {
  try {
    console.log('📋 Fetching appointments with filters:', filters);

    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};

    // Filter by status
    if (filters.status) {
      query.status = filters.status;
    }

    // Filter by date range
    if (filters.startDate || filters.endDate) {
      query.appointmentDate = {};
      if (filters.startDate) {
        query.appointmentDate.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.appointmentDate.$lte = new Date(filters.endDate);
      }
    }

    // Filter by specific date
    if (filters.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: startOfDay, $lte: endOfDay };
    }

    // Search by customer name
    if (filters.customerName) {
      query.customerName = { $regex: filters.customerName, $options: 'i' };
    }

    // Execute query with pagination
    const appointments = await Appointment.find(query)
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Appointment.countDocuments(query);

    console.log(`✅ Found ${appointments.length} appointments (Total: ${total})`);

    return {
      appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('❌ Error fetching appointments:', error.message);
    throw error;
  }
}

/**
 * Retrieves a single appointment by ID
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<Object>} - Appointment details
 */
async function getAppointmentById(appointmentId) {
  try {
    console.log(`🔍 Fetching appointment: ${appointmentId}`);

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    console.log(`✅ Found appointment for ${appointment.customerName}`);

    return appointment;
  } catch (error) {
    console.error('❌ Error fetching appointment:', error.message);
    throw error;
  }
}

/**
 * Updates an existing appointment
 * @param {string} appointmentId - Appointment ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} - Updated appointment
 */
async function updateAppointment(appointmentId, updates) {
  try {
    console.log(`📝 Updating appointment: ${appointmentId}`);
    console.log('Updates:', JSON.stringify(updates, null, 2));

    // Validate updates if they include certain fields
    if (updates.customerName) {
      const nameValidation = validateCustomerName(updates.customerName);
      if (!nameValidation.valid) {
        throw new Error(nameValidation.error);
      }
    }

    if (updates.appointmentDate) {
      const dateValidation = validateAppointmentDate(updates.appointmentDate);
      if (!dateValidation.valid) {
        throw new Error(dateValidation.error);
      }
    }

    if (updates.appointmentTime) {
      const timeValidation = validateAppointmentTime(updates.appointmentTime);
      if (!timeValidation.valid) {
        throw new Error(timeValidation.error);
      }
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updates,
      { new: true, runValidators: true }
    );

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    console.log(`✅ Appointment updated successfully: ${appointmentId}`);

    return appointment;
  } catch (error) {
    console.error('❌ Error updating appointment:', error.message);
    throw error;
  }
}

/**
 * Cancels an appointment
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<Object>} - Cancelled appointment
 */
async function cancelAppointment(appointmentId) {
  try {
    console.log(`🚫 Cancelling appointment: ${appointmentId}`);

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: 'cancelled' },
      { new: true }
    );

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    console.log(`✅ Appointment cancelled: ${appointmentId}`);

    return appointment;
  } catch (error) {
    console.error('❌ Error cancelling appointment:', error.message);
    throw error;
  }
}

/**
 * Deletes an appointment permanently
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<Object>} - Deleted appointment
 */
async function deleteAppointment(appointmentId) {
  try {
    console.log(`🗑️  Deleting appointment: ${appointmentId}`);

    const appointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    console.log(`✅ Appointment deleted: ${appointmentId}`);

    return appointment;
  } catch (error) {
    console.error('❌ Error deleting appointment:', error.message);
    throw error;
  }
}

/**
 * Gets appointments for a specific customer by phone number
 * @param {string} phoneNumber - Customer phone number
 * @returns {Promise<Array>} - List of appointments
 */
async function getAppointmentsByPhone(phoneNumber) {
  try {
    console.log(`📞 Fetching appointments for phone: ${phoneNumber}`);

    const appointments = await Appointment.find({
      $or: [
        { phoneNumber },
        { callingNumber: phoneNumber },
      ],
      status: { $in: ['scheduled'] },
    }).sort({ appointmentDate: 1, appointmentTime: 1 });

    console.log(`✅ Found ${appointments.length} appointments for this phone number`);

    return appointments;
  } catch (error) {
    console.error('❌ Error fetching appointments by phone:', error.message);
    throw error;
  }
}

/**
 * Gets appointment statistics for the dashboard
 * @returns {Promise<Object>} - Statistics data
 */
async function getAppointmentStats() {
  try {
    console.log('📊 Calculating appointment statistics...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());

    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekStart.getDate() + 7);

    // Get counts for different time periods
    const [
      totalScheduled,
      todayAppointments,
      upcomingThisWeek,
      completedTotal,
      cancelledTotal,
    ] = await Promise.all([
      Appointment.countDocuments({ status: 'scheduled' }),
      Appointment.countDocuments({
        status: 'scheduled',
        appointmentDate: { $gte: today, $lt: tomorrow },
      }),
      Appointment.countDocuments({
        status: 'scheduled',
        appointmentDate: { $gte: thisWeekStart, $lt: thisWeekEnd },
      }),
      Appointment.countDocuments({ status: 'completed' }),
      Appointment.countDocuments({ status: 'cancelled' }),
    ]);

    const stats = {
      totalScheduled,
      todayAppointments,
      upcomingThisWeek,
      completedTotal,
      cancelledTotal,
      calculatedAt: new Date(),
    };

    console.log('✅ Statistics calculated:', stats);

    return stats;
  } catch (error) {
    console.error('❌ Error calculating statistics:', error.message);
    throw error;
  }
}

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
  getAppointmentsByPhone,
  getAppointmentStats,
};
