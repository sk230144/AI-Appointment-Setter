// Appointment management routes
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authMiddleware } = require('../middleware/auth');

/**
 * GET /api/appointments
 * Get all appointments with optional filtering
 */
router.get('/', appointmentController.getAllAppointments);

/**
 * GET /api/appointments/phone/:phoneNumber
 * Get appointments by phone number
 * IMPORTANT: Must be before /:id route to avoid conflict
 */
router.get('/phone/:phoneNumber', appointmentController.getAppointmentsByPhone);

/**
 * GET /api/appointments/:id
 * Get single appointment by ID
 */
router.get('/:id', appointmentController.getAppointment);

/**
 * POST /api/appointments
 * Create new appointment (manual booking)
 */
router.post('/', appointmentController.createAppointment);

/**
 * PUT /api/appointments/:id
 * Update existing appointment
 */
router.put('/:id', appointmentController.updateAppointment);

/**
 * DELETE /api/appointments/:id
 * Cancel appointment
 */
router.delete('/:id', appointmentController.cancelAppointment);

module.exports = router;
