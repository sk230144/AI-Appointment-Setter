// Twilio voice service - handles call flow and state management
const { VoiceResponse } = require('../config/twilio');
const { businessHours } = require('../config/businessHours');
const { parseSpokenTime, formatTime12Hour } = require('../utils/timeUtils');
const { checkSlotAvailability, findNearestAvailableSlots } = require('./slotService');
const { createAppointment, getAppointmentsByPhone, cancelAppointment } = require('./appointmentService');
const { getAvailableSlotsSummary } = require('./slotSummaryService');

// Call state machine states
const CALL_STATES = {
  GREETING: 'GREETING',
  COLLECT_TIME: 'COLLECT_TIME',
  VALIDATE_SLOT: 'VALIDATE_SLOT',
  SUGGEST_ALTERNATIVES: 'SUGGEST_ALTERNATIVES',
  COLLECT_NAME: 'COLLECT_NAME',
  COLLECT_CALLBACK: 'COLLECT_CALLBACK',
  COLLECT_ALT_NUMBER: 'COLLECT_ALT_NUMBER',
  CONFIRMATION: 'CONFIRMATION',
  CANCEL_FLOW: 'CANCEL_FLOW',
  RESCHEDULE_FLOW: 'RESCHEDULE_FLOW',
  END: 'END',
};

// In-memory session storage (use Redis in production)
const callSessions = new Map();

/**
 * Handles incoming voice calls - Entry point with smart slot announcement
 * @param {string} callSid - Twilio call SID
 * @param {string} from - Caller's phone number
 * @returns {string} - TwiML response
 */
async function handleIncomingCall(callSid, from) {
  try {
    console.log(`📞 Incoming call: ${callSid} from ${from}`);

    // Initialize call session
    callSessions.set(callSid, {
      state: CALL_STATES.GREETING,
      from,
      createdAt: new Date(),
      data: {},
    });

    const twiml = new VoiceResponse();

    // Greeting message
    twiml.say(
      {
        voice: 'Polly.Joanna',
        language: 'en-US',
      },
      `Hello! Welcome to ${businessHours.businessName}. I can help you book an appointment, check your existing appointment, or cancel an appointment.`
    );

    // Get smart slot summary for today
    const today = new Date();
    const slotSummary = await getAvailableSlotsSummary(today);

    // Announce available slots intelligently
    twiml.say(
      {
        voice: 'Polly.Joanna',
      },
      slotSummary.message
    );

    // Gather user intent
    const gather = twiml.gather({
      input: 'speech',
      timeout: 5,
      action: `/api/twilio/gather?state=${CALL_STATES.COLLECT_TIME}&callSid=${callSid}`,
      speechTimeout: 'auto',
    });

    gather.say(
      { voice: 'Polly.Joanna' },
      'Please say the time you would like to book, or say cancel to cancel an existing appointment, or say reschedule to change your appointment time.'
    );

    // Fallback if no input
    twiml.say(
      { voice: 'Polly.Joanna' },
      'I did not receive any input. Goodbye!'
    );

    console.log(`✅ Generated greeting TwiML for call ${callSid}`);

    return twiml.toString();
  } catch (error) {
    console.error('❌ Error handling incoming call:', error.message);
    return generateErrorResponse('Sorry, an error occurred. Please try again later.');
  }
}

/**
 * Handles speech input gathering based on current state
 * @param {string} callSid - Twilio call SID
 * @param {string} state - Current call state
 * @param {string} speechResult - Recognized speech
 * @returns {string} - TwiML response
 */
async function handleGatherInput(callSid, state, speechResult) {
  try {
    console.log(`🎤 Processing input for call ${callSid}, state: ${state}`);
    console.log(`   Speech: "${speechResult}"`);

    const session = callSessions.get(callSid);

    if (!session) {
      console.error('❌ Session not found for call:', callSid);
      return generateErrorResponse('Sorry, your session has expired. Please call again.');
    }

    // Route to appropriate handler based on state
    switch (state) {
      case CALL_STATES.COLLECT_TIME:
        return await handleTimeCollection(callSid, session, speechResult);

      case CALL_STATES.COLLECT_NAME:
        return await handleNameCollection(callSid, session, speechResult);

      case CALL_STATES.COLLECT_CALLBACK:
        return await handleCallbackCollection(callSid, session, speechResult);

      case CALL_STATES.COLLECT_ALT_NUMBER:
        return await handleAltNumberCollection(callSid, session, speechResult);

      case CALL_STATES.SUGGEST_ALTERNATIVES:
        return await handleAlternativeSelection(callSid, session, speechResult);

      case CALL_STATES.CANCEL_FLOW:
        return await handleCancellation(callSid, session, speechResult);

      default:
        console.error('❌ Unknown state:', state);
        return generateErrorResponse('Sorry, something went wrong. Please call again.');
    }
  } catch (error) {
    console.error('❌ Error handling gather input:', error.message);
    console.error('Stack:', error.stack);
    return generateErrorResponse('Sorry, an error occurred while processing your request.');
  }
}

/**
 * Handles time collection from user
 */
async function handleTimeCollection(callSid, session, speechResult) {
  const twiml = new VoiceResponse();
  const lowerSpeech = speechResult.toLowerCase();

  // Check for special commands
  if (lowerSpeech.includes('cancel')) {
    session.state = CALL_STATES.CANCEL_FLOW;
    callSessions.set(callSid, session);
    return await handleCancellation(callSid, session, speechResult);
  }

  if (lowerSpeech.includes('reschedule')) {
    session.state = CALL_STATES.RESCHEDULE_FLOW;
    callSessions.set(callSid, session);
    twiml.say({ voice: 'Polly.Joanna' }, 'To reschedule, first let me cancel your existing appointment.');
    return await handleCancellation(callSid, session, 'cancel');
  }

  // Parse time from speech
  const parsedTime = parseSpokenTime(speechResult);

  if (!parsedTime) {
    console.log('❌ Could not parse time from speech');

    const gather = twiml.gather({
      input: 'speech',
      timeout: 5,
      action: `/api/twilio/gather?state=${CALL_STATES.COLLECT_TIME}&callSid=${callSid}`,
    });

    gather.say(
      { voice: 'Polly.Joanna' },
      'I could not understand the time. Please say a time like nine thirty AM or two PM.'
    );

    return twiml.toString();
  }

  // Check slot availability
  const today = new Date();
  const availability = await checkSlotAvailability(today, parsedTime);

  if (availability.available) {
    // Slot is available - proceed to collect name
    session.state = CALL_STATES.COLLECT_NAME;
    session.data.requestedTime = parsedTime;
    session.data.appointmentDate = today;
    callSessions.set(callSid, session);

    twiml.say(
      { voice: 'Polly.Joanna' },
      `Great! The slot at ${formatTime12Hour(parsedTime)} is available.`
    );

    const gather = twiml.gather({
      input: 'speech',
      timeout: 5,
      action: `/api/twilio/gather?state=${CALL_STATES.COLLECT_NAME}&callSid=${callSid}`,
    });

    gather.say({ voice: 'Polly.Joanna' }, 'May I have your name please?');

    console.log(`✅ Slot ${parsedTime} is available, collecting name`);

    return twiml.toString();
  } else {
    // Slot not available - suggest alternatives
    console.log(`❌ Slot ${parsedTime} not available: ${availability.reason}`);

    session.state = CALL_STATES.SUGGEST_ALTERNATIVES;
    session.data.requestedTime = parsedTime;
    session.data.appointmentDate = today;
    callSessions.set(callSid, session);

    twiml.say(
      { voice: 'Polly.Joanna' },
      `Sorry, the slot at ${formatTime12Hour(parsedTime)} is not available. ${availability.message}`
    );

    // Find nearest available slots
    const alternatives = await findNearestAvailableSlots(today, parsedTime, 3);

    if (alternatives.length > 0) {
      session.data.alternatives = alternatives;
      callSessions.set(callSid, session);

      const alternativeTimes = alternatives.map(alt => alt.formatted).join(', or ');

      const gather = twiml.gather({
        input: 'speech',
        timeout: 5,
        action: `/api/twilio/gather?state=${CALL_STATES.SUGGEST_ALTERNATIVES}&callSid=${callSid}`,
      });

      gather.say(
        { voice: 'Polly.Joanna' },
        `Would you like one of these available times instead: ${alternativeTimes}? Or say no to end the call.`
      );
    } else {
      twiml.say(
        { voice: 'Polly.Joanna' },
        'Unfortunately, there are no available slots today. Please call back later or try a different day. Goodbye!'
      );
      twiml.hangup();
    }

    return twiml.toString();
  }
}

/**
 * Handles alternative slot selection
 */
async function handleAlternativeSelection(callSid, session, speechResult) {
  const twiml = new VoiceResponse();
  const lowerSpeech = speechResult.toLowerCase();

  if (lowerSpeech.includes('no')) {
    twiml.say({ voice: 'Polly.Joanna' }, 'Okay, thank you for calling. Goodbye!');
    twiml.hangup();
    callSessions.delete(callSid);
    return twiml.toString();
  }

  // Try to parse the selected time
  const parsedTime = parseSpokenTime(speechResult);

  if (parsedTime && session.data.alternatives) {
    // Check if parsed time matches one of the alternatives
    const matchingAlt = session.data.alternatives.find(alt => alt.time === parsedTime);

    if (matchingAlt) {
      // Proceed to collect name
      session.state = CALL_STATES.COLLECT_NAME;
      session.data.requestedTime = parsedTime;
      callSessions.set(callSid, session);

      twiml.say(
        { voice: 'Polly.Joanna' },
        `Perfect! I'll book you for ${formatTime12Hour(parsedTime)}.`
      );

      const gather = twiml.gather({
        input: 'speech',
        timeout: 5,
        action: `/api/twilio/gather?state=${CALL_STATES.COLLECT_NAME}&callSid=${callSid}`,
      });

      gather.say({ voice: 'Polly.Joanna' }, 'May I have your name please?');

      return twiml.toString();
    }
  }

  // Could not understand selection
  const gather = twiml.gather({
    input: 'speech',
    timeout: 5,
    action: `/api/twilio/gather?state=${CALL_STATES.SUGGEST_ALTERNATIVES}&callSid=${callSid}`,
  });

  gather.say(
    { voice: 'Polly.Joanna' },
    'I could not understand your selection. Please say one of the suggested times, or say no to cancel.'
  );

  return twiml.toString();
}

/**
 * Handles name collection
 */
async function handleNameCollection(callSid, session, speechResult) {
  const twiml = new VoiceResponse();

  // Store the name
  session.data.customerName = speechResult.trim();
  session.state = CALL_STATES.COLLECT_CALLBACK;
  callSessions.set(callSid, session);

  console.log(`✅ Collected name: ${session.data.customerName}`);

  // Ask about callback preference
  const gather = twiml.gather({
    input: 'speech',
    timeout: 5,
    action: `/api/twilio/gather?state=${CALL_STATES.COLLECT_CALLBACK}&callSid=${callSid}`,
  });

  gather.say(
    { voice: 'Polly.Joanna' },
    'Thank you. Can we call you back on this number if needed? Please say yes, no, or another number.'
  );

  return twiml.toString();
}

/**
 * Handles callback preference collection
 */
async function handleCallbackCollection(callSid, session, speechResult) {
  const twiml = new VoiceResponse();
  const lowerSpeech = speechResult.toLowerCase();

  if (lowerSpeech.includes('yes')) {
    // Use same number
    session.data.callbackPreference = 'same_number';
    session.data.phoneNumber = session.from;
    return await finalizeAppointment(callSid, session, twiml);
  } else if (lowerSpeech.includes('no')) {
    // No callback
    session.data.callbackPreference = 'no_callback';
    session.data.phoneNumber = null;
    return await finalizeAppointment(callSid, session, twiml);
  } else if (lowerSpeech.includes('another') || lowerSpeech.includes('different')) {
    // Collect alternative number
    session.state = CALL_STATES.COLLECT_ALT_NUMBER;
    callSessions.set(callSid, session);

    const gather = twiml.gather({
      input: 'speech dtmf',
      timeout: 10,
      action: `/api/twilio/gather?state=${CALL_STATES.COLLECT_ALT_NUMBER}&callSid=${callSid}`,
    });

    gather.say(
      { voice: 'Polly.Joanna' },
      'Please say or enter the phone number we should call you back on.'
    );

    return twiml.toString();
  } else {
    // Unclear response, ask again
    const gather = twiml.gather({
      input: 'speech',
      timeout: 5,
      action: `/api/twilio/gather?state=${CALL_STATES.COLLECT_CALLBACK}&callSid=${callSid}`,
    });

    gather.say(
      { voice: 'Polly.Joanna' },
      'I did not understand. Please say yes to use this number, no for no callback, or another number to provide a different number.'
    );

    return twiml.toString();
  }
}

/**
 * Handles alternative number collection
 */
async function handleAltNumberCollection(callSid, session, speechResult) {
  const twiml = new VoiceResponse();

  // Extract digits from speech
  const digits = speechResult.replace(/\D/g, '');

  if (digits.length >= 10) {
    session.data.callbackPreference = 'different_number';
    session.data.phoneNumber = digits;
    return await finalizeAppointment(callSid, session, twiml);
  } else {
    const gather = twiml.gather({
      input: 'speech dtmf',
      timeout: 10,
      action: `/api/twilio/gather?state=${CALL_STATES.COLLECT_ALT_NUMBER}&callSid=${callSid}`,
    });

    gather.say(
      { voice: 'Polly.Joanna' },
      'I could not understand the phone number. Please say or enter a valid phone number.'
    );

    return twiml.toString();
  }
}

/**
 * Finalizes the appointment booking
 */
async function finalizeAppointment(callSid, session, twiml) {
  try {
    console.log('💾 Finalizing appointment booking...');

    // Create appointment in database
    const appointment = await createAppointment({
      customerName: session.data.customerName,
      appointmentDate: session.data.appointmentDate,
      appointmentTime: session.data.requestedTime,
      phoneNumber: session.data.phoneNumber,
      callingNumber: session.from,
      callbackPreference: session.data.callbackPreference,
      twilioCallSid: callSid,
      status: 'scheduled',
    });

    console.log(`✅ Appointment created: ${appointment._id}`);

    // Confirmation message
    twiml.say(
      { voice: 'Polly.Joanna' },
      `Perfect! Your appointment is confirmed for ${formatTime12Hour(session.data.requestedTime)} ` +
      `under the name ${session.data.customerName}. Thank you for calling ${businessHours.businessName}. Goodbye!`
    );

    twiml.hangup();

    // Clean up session
    callSessions.delete(callSid);

    return twiml.toString();
  } catch (error) {
    console.error('❌ Error finalizing appointment:', error.message);

    twiml.say(
      { voice: 'Polly.Joanna' },
      'Sorry, there was an error creating your appointment. Please call back later. Goodbye!'
    );

    twiml.hangup();

    return twiml.toString();
  }
}

/**
 * Handles appointment cancellation
 */
async function handleCancellation(callSid, session, speechResult) {
  const twiml = new VoiceResponse();

  try {
    console.log(`🚫 Processing cancellation for ${session.from}`);

    // Get existing appointments for this phone number
    const appointments = await getAppointmentsByPhone(session.from);

    if (appointments.length === 0) {
      twiml.say(
        { voice: 'Polly.Joanna' },
        'I could not find any scheduled appointments for your phone number. Goodbye!'
      );
      twiml.hangup();
      callSessions.delete(callSid);
      return twiml.toString();
    }

    // Cancel the most recent scheduled appointment
    const appointmentToCancel = appointments[0];
    await cancelAppointment(appointmentToCancel._id);

    console.log(`✅ Cancelled appointment: ${appointmentToCancel._id}`);

    twiml.say(
      { voice: 'Polly.Joanna' },
      `Your appointment for ${formatTime12Hour(appointmentToCancel.appointmentTime)} has been cancelled. ` +
      `Thank you for letting us know. Goodbye!`
    );

    twiml.hangup();
    callSessions.delete(callSid);

    return twiml.toString();
  } catch (error) {
    console.error('❌ Error handling cancellation:', error.message);

    twiml.say(
      { voice: 'Polly.Joanna' },
      'Sorry, there was an error cancelling your appointment. Please call back later. Goodbye!'
    );

    twiml.hangup();

    return twiml.toString();
  }
}

/**
 * Generates an error response TwiML
 */
function generateErrorResponse(message) {
  const twiml = new VoiceResponse();
  twiml.say({ voice: 'Polly.Joanna' }, message);
  twiml.hangup();
  return twiml.toString();
}

/**
 * Cleans up old call sessions (call periodically)
 */
function cleanupOldSessions() {
  const now = new Date();
  const maxAge = 30 * 60 * 1000; // 30 minutes

  let cleaned = 0;
  for (const [callSid, session] of callSessions.entries()) {
    if (now - session.createdAt > maxAge) {
      callSessions.delete(callSid);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} old call sessions`);
  }
}

// Clean up sessions every 5 minutes
setInterval(cleanupOldSessions, 5 * 60 * 1000);

module.exports = {
  handleIncomingCall,
  handleGatherInput,
  CALL_STATES,
};
