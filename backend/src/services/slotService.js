// Slot service - manages time slot availability and blocking
const Appointment = require('../models/Appointment');
const BlockedSlot = require('../models/BlockedSlot');
const { generateTimeSlots, isWithinBusinessHours } = require('../config/businessHours');
const { formatTime12Hour } = require('../utils/timeUtils');

/**
 * Gets all available slots for a specific date
 * Excludes booked appointments and blocked slots
 * @param {Date|string} date - The date to check
 * @returns {Promise<Object>} - Available and booked slots
 */
async function getAvailableSlots(date) {
  try {
    console.log(`🔍 Checking available slots for ${date}`);

    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all possible time slots from business hours
    const allSlots = generateTimeSlots();

    // Get booked appointments for this date
    const bookedAppointments = await Appointment.find({
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: 'scheduled',
    }).select('appointmentTime');

    const bookedTimes = bookedAppointments.map(apt => apt.appointmentTime);

    // Get blocked slots for this date
    const blockedTimes = await BlockedSlot.getBlockedSlotsForDate(targetDate);

    // Combine booked and blocked times
    const unavailableTimes = new Set([...bookedTimes, ...blockedTimes]);

    // Filter available slots
    const availableSlots = allSlots.filter(slot => !unavailableTimes.has(slot));
    const bookedSlots = allSlots.filter(slot => bookedTimes.includes(slot));
    const blockedSlots = allSlots.filter(slot => blockedTimes.includes(slot));

    console.log(`✅ Found ${availableSlots.length} available slots out of ${allSlots.length} total`);
    console.log(`   Booked: ${bookedSlots.length}, Blocked: ${blockedSlots.length}`);

    return {
      date: targetDate.toISOString().split('T')[0],
      totalSlots: allSlots.length,
      availableSlots: availableSlots.map(slot => ({
        time: slot,
        formatted: formatTime12Hour(slot),
        status: 'available',
      })),
      bookedSlots: bookedSlots.map(slot => ({
        time: slot,
        formatted: formatTime12Hour(slot),
        status: 'booked',
      })),
      blockedSlots: blockedSlots.map(slot => ({
        time: slot,
        formatted: formatTime12Hour(slot),
        status: 'blocked',
      })),
    };
  } catch (error) {
    console.error('❌ Error getting available slots:', error.message);
    throw error;
  }
}

/**
 * Checks if a specific slot is available
 * @param {Date|string} date - Appointment date
 * @param {string} time - Time in HH:MM format
 * @returns {Promise<Object>} - Availability status and details
 */
async function checkSlotAvailability(date, time) {
  try {
    console.log(`🔍 Checking slot availability: ${time} on ${date}`);

    // Check if time is within business hours
    if (!isWithinBusinessHours(time)) {
      console.log('❌ Time is outside business hours');
      return {
        available: false,
        reason: 'outside_business_hours',
        message: 'This time is outside our business hours',
      };
    }

    const targetDate = new Date(date);

    // Check if slot is blocked
    const isBlocked = await BlockedSlot.isSlotBlocked(targetDate, time);
    if (isBlocked) {
      console.log('❌ Slot is blocked');
      return {
        available: false,
        reason: 'blocked',
        message: 'This time slot has been blocked',
      };
    }

    // Check if slot is already booked
    const isBooked = !(await Appointment.isSlotAvailable(targetDate, time));
    if (isBooked) {
      console.log('❌ Slot is already booked');
      return {
        available: false,
        reason: 'booked',
        message: 'This time slot is already booked',
      };
    }

    console.log('✅ Slot is available');
    return {
      available: true,
      reason: null,
      message: 'This time slot is available',
    };
  } catch (error) {
    console.error('❌ Error checking slot availability:', error.message);
    throw error;
  }
}

/**
 * Finds the nearest available slots to a requested time
 * @param {Date|string} date - Appointment date
 * @param {string} requestedTime - Requested time in HH:MM format
 * @param {number} count - Number of alternatives to suggest (default: 3)
 * @returns {Promise<Array>} - Array of suggested alternative slots
 */
async function findNearestAvailableSlots(date, requestedTime, count = 3) {
  try {
    console.log(`🔍 Finding ${count} nearest available slots to ${requestedTime}`);

    const { availableSlots } = await getAvailableSlots(date);

    if (availableSlots.length === 0) {
      console.log('❌ No available slots found');
      return [];
    }

    // Convert requested time to minutes for comparison
    const [reqHours, reqMinutes] = requestedTime.split(':').map(Number);
    const requestedMinutes = reqHours * 60 + reqMinutes;

    // Calculate time difference for each available slot
    const slotsWithDistance = availableSlots.map(slot => {
      const [hours, minutes] = slot.time.split(':').map(Number);
      const slotMinutes = hours * 60 + minutes;
      const distance = Math.abs(slotMinutes - requestedMinutes);
      return { ...slot, distance };
    });

    // Sort by distance and take the nearest ones
    const nearest = slotsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, count);

    console.log(`✅ Found ${nearest.length} nearest available slots`);

    return nearest.map(slot => ({
      time: slot.time,
      formatted: slot.formatted,
    }));
  } catch (error) {
    console.error('❌ Error finding nearest slots:', error.message);
    throw error;
  }
}

/**
 * Blocks specific time slots on a date
 * @param {Date|string} date - Date to block slots on
 * @param {Array<string>} times - Array of time slots to block
 * @param {string} reason - Reason for blocking
 * @returns {Promise<Object>} - Blocked slot document
 */
async function blockTimeSlots(date, times, reason = 'Unavailable') {
  try {
    console.log(`🚫 Blocking ${times.length} slots on ${date}`);

    const targetDate = new Date(date);

    // Validate times are within business hours
    const invalidTimes = times.filter(time => !isWithinBusinessHours(time));
    if (invalidTimes.length > 0) {
      console.warn(`⚠️  Some times are outside business hours: ${invalidTimes.join(', ')}`);
    }

    const blockedSlot = await BlockedSlot.blockSlots(targetDate, times, reason);

    console.log(`✅ Successfully blocked ${times.length} slots`);

    return blockedSlot;
  } catch (error) {
    console.error('❌ Error blocking time slots:', error.message);
    throw error;
  }
}

/**
 * Unblocks specific time slots on a date
 * @param {Date|string} date - Date to unblock slots on
 * @param {Array<string>} times - Array of time slots to unblock
 * @returns {Promise<Object>} - Updated blocked slot document
 */
async function unblockTimeSlots(date, times) {
  try {
    console.log(`✅ Unblocking ${times.length} slots on ${date}`);

    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const blockedSlot = await BlockedSlot.findOne({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!blockedSlot) {
      console.log('ℹ️  No blocked slots found for this date');
      return null;
    }

    // Remove the specified times from blocked times
    blockedSlot.blockedTimes = blockedSlot.blockedTimes.filter(
      time => !times.includes(time)
    );

    // If no blocked times remain, delete the document
    if (blockedSlot.blockedTimes.length === 0) {
      await blockedSlot.deleteOne();
      console.log('✅ All slots unblocked, removed blocked slot document');
      return null;
    }

    await blockedSlot.save();
    console.log(`✅ Successfully unblocked ${times.length} slots`);

    return blockedSlot;
  } catch (error) {
    console.error('❌ Error unblocking time slots:', error.message);
    throw error;
  }
}

/**
 * Gets slot availability for a date range (for calendar view)
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {Promise<Array>} - Availability data for each date
 */
async function getSlotAvailabilityRange(startDate, endDate) {
  try {
    console.log(`📅 Getting slot availability from ${startDate} to ${endDate}`);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateRange = [];

    // Generate all dates in range
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      dateRange.push(new Date(date));
    }

    // Get availability for each date
    const availabilityPromises = dateRange.map(date => getAvailableSlots(date));
    const availabilityData = await Promise.all(availabilityPromises);

    console.log(`✅ Retrieved availability for ${dateRange.length} dates`);

    return availabilityData.map((data, index) => ({
      date: dateRange[index].toISOString().split('T')[0],
      totalSlots: data.totalSlots,
      availableCount: data.availableSlots.length,
      bookedCount: data.bookedSlots.length,
      blockedCount: data.blockedSlots.length,
      availabilityPercentage: Math.round((data.availableSlots.length / data.totalSlots) * 100),
    }));
  } catch (error) {
    console.error('❌ Error getting slot availability range:', error.message);
    throw error;
  }
}

module.exports = {
  getAvailableSlots,
  checkSlotAvailability,
  findNearestAvailableSlots,
  blockTimeSlots,
  unblockTimeSlots,
  getSlotAvailabilityRange,
};
