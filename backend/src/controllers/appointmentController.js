// Appointment controller - handles appointment-related HTTP requests
const appointmentService = require('../services/appointmentService');
const { validatePagination } = require('../utils/validators');

/**
 * Get all appointments with optional filtering
 * GET /api/appointments
 */
async function getAllAppointments(req, res) {
  try {
    console.log('📋 GET /api/appointments');
    console.log('Query params:', JSON.stringify(req.query, null, 2));

    const { status, date, startDate, endDate, customerName, page, limit } = req.query;

    // Validate pagination
    const paginationValidation = validatePagination(page, limit);
    if (!paginationValidation.valid) {
      console.error('❌ Invalid pagination:', paginationValidation.error);
      return res.status(400).json({
        success: false,
        error: paginationValidation.error,
      });
    }

    // Build filters
    const filters = {};
    if (status) filters.status = status;
    if (date) filters.date = date;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (customerName) filters.customerName = customerName;

    // Get appointments
    const result = await appointmentService.getAppointments(
      filters,
      {
        page: paginationValidation.page,
        limit: paginationValidation.limit,
      }
    );

    console.log(`✅ Returning ${result.appointments.length} appointments`);

    res.status(200).json({
      success: true,
      data: result.appointments,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('❌ Error in getAllAppointments:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch appointments',
      message: error.message,
    });
  }
}

/**
 * Get single appointment by ID
 * GET /api/appointments/:id
 */
async function getAppointment(req, res) {
  try {
    const { id } = req.params;
    console.log(`🔍 GET /api/appointments/${id}`);

    const appointment = await appointmentService.getAppointmentById(id);

    console.log(`✅ Found appointment for ${appointment.customerName}`);

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error('❌ Error in getAppointment:', error.message);

    if (error.message === 'Appointment not found') {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch appointment',
      message: error.message,
    });
  }
}

/**
 * Create new appointment (manual booking from admin)
 * POST /api/appointments
 */
async function createAppointment(req, res) {
  try {
    console.log('➕ POST /api/appointments');
    console.log('Body:', JSON.stringify(req.body, null, 2));

    const {
      customerName,
      appointmentDate,
      appointmentTime,
      phoneNumber,
      callbackPreference,
      notes,
    } = req.body;

    // Validate required fields
    if (!customerName || !appointmentDate || !appointmentTime) {
      console.error('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: customerName, appointmentDate, appointmentTime',
      });
    }

    // Create appointment
    const appointment = await appointmentService.createAppointment({
      customerName,
      appointmentDate,
      appointmentTime,
      phoneNumber: phoneNumber || null,
      callingNumber: phoneNumber || 'manual',
      callbackPreference: callbackPreference || 'same_number',
      notes: notes || '',
      status: 'scheduled',
    });

    console.log(`✅ Created appointment: ${appointment._id}`);

    res.status(201).json({
      success: true,
      data: appointment,
      message: 'Appointment created successfully',
    });
  } catch (error) {
    console.error('❌ Error in createAppointment:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to create appointment',
      message: error.message,
    });
  }
}

/**
 * Update appointment
 * PUT /api/appointments/:id
 */
async function updateAppointment(req, res) {
  try {
    const { id } = req.params;
    console.log(`📝 PUT /api/appointments/${id}`);
    console.log('Body:', JSON.stringify(req.body, null, 2));

    const updates = req.body;

    // Update appointment
    const appointment = await appointmentService.updateAppointment(id, updates);

    console.log(`✅ Updated appointment: ${id}`);

    res.status(200).json({
      success: true,
      data: appointment,
      message: 'Appointment updated successfully',
    });
  } catch (error) {
    console.error('❌ Error in updateAppointment:', error.message);

    if (error.message === 'Appointment not found') {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update appointment',
      message: error.message,
    });
  }
}

/**
 * Cancel appointment (soft delete - sets status to cancelled)
 * DELETE /api/appointments/:id
 */
async function cancelAppointment(req, res) {
  try {
    const { id } = req.params;
    console.log(`🚫 DELETE /api/appointments/${id}`);

    const appointment = await appointmentService.cancelAppointment(id);

    console.log(`✅ Cancelled appointment: ${id}`);

    res.status(200).json({
      success: true,
      data: appointment,
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    console.error('❌ Error in cancelAppointment:', error.message);

    if (error.message === 'Appointment not found') {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to cancel appointment',
      message: error.message,
    });
  }
}

/**
 * Get appointments by phone number
 * GET /api/appointments/phone/:phoneNumber
 */
async function getAppointmentsByPhone(req, res) {
  try {
    const { phoneNumber } = req.params;
    console.log(`📞 GET /api/appointments/phone/${phoneNumber}`);

    const appointments = await appointmentService.getAppointmentsByPhone(phoneNumber);

    console.log(`✅ Found ${appointments.length} appointments for this phone`);

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error('❌ Error in getAppointmentsByPhone:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch appointments',
      message: error.message,
    });
  }
}

module.exports = {
  getAllAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getAppointmentsByPhone,
};
