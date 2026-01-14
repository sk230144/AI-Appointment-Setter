// Twilio controller - handles Twilio webhook requests
const { handleIncomingCall, handleGatherInput } = require('../services/twilioVoiceService');

/**
 * Handles incoming voice call webhook from Twilio
 * POST /api/twilio/voice
 */
async function handleVoiceWebhook(req, res) {
  try {
    console.log('📞 Twilio voice webhook received');
    console.log('Body:', JSON.stringify(req.body, null, 2));

    const { CallSid, From, To } = req.body;

    if (!CallSid || !From) {
      console.error('❌ Missing required Twilio parameters');
      return res.status(400).send('Missing required parameters');
    }

    console.log(`   Call SID: ${CallSid}`);
    console.log(`   From: ${From}`);
    console.log(`   To: ${To}`);

    // Generate TwiML response (async function - now fetches slot availability)
    const twimlResponse = await handleIncomingCall(CallSid, From);

    // Set correct content type for TwiML
    res.type('text/xml');
    res.send(twimlResponse);

    console.log('✅ TwiML response sent successfully');
  } catch (error) {
    console.error('❌ Error in voice webhook:', error.message);
    console.error('Stack:', error.stack);

    // Send error TwiML
    res.type('text/xml');
    res.send(`
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say voice="Polly.Joanna">Sorry, an error occurred. Please try again later. Goodbye!</Say>
        <Hangup/>
      </Response>
    `);
  }
}

/**
 * Handles gather input webhook from Twilio
 * POST /api/twilio/gather
 */
async function handleGatherWebhook(req, res) {
  try {
    console.log('🎤 Twilio gather webhook received');
    console.log('Query:', JSON.stringify(req.query, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));

    const { state, callSid } = req.query;
    const { SpeechResult, Digits, CallSid } = req.body;

    const actualCallSid = callSid || CallSid;
    const userInput = SpeechResult || Digits;

    if (!actualCallSid || !state) {
      console.error('❌ Missing required parameters');
      return res.status(400).send('Missing required parameters');
    }

    if (!userInput) {
      console.log('⚠️  No speech result received');

      // Ask again
      res.type('text/xml');
      res.send(`
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say voice="Polly.Joanna">I did not hear anything. Please try again.</Say>
          <Redirect>/api/twilio/voice</Redirect>
        </Response>
      `);
      return;
    }

    console.log(`   Call SID: ${actualCallSid}`);
    console.log(`   State: ${state}`);
    console.log(`   Input: "${userInput}"`);

    // Process input based on state
    const twimlResponse = await handleGatherInput(actualCallSid, state, userInput);

    res.type('text/xml');
    res.send(twimlResponse);

    console.log('✅ Gather response sent successfully');
  } catch (error) {
    console.error('❌ Error in gather webhook:', error.message);
    console.error('Stack:', error.stack);

    res.type('text/xml');
    res.send(`
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say voice="Polly.Joanna">Sorry, an error occurred. Please call back later. Goodbye!</Say>
        <Hangup/>
      </Response>
    `);
  }
}

/**
 * Handles call status callback from Twilio
 * POST /api/twilio/status
 */
async function handleStatusCallback(req, res) {
  try {
    console.log('📊 Twilio status callback received');
    console.log('Body:', JSON.stringify(req.body, null, 2));

    const { CallSid, CallStatus, CallDuration } = req.body;

    console.log(`   Call SID: ${CallSid}`);
    console.log(`   Status: ${CallStatus}`);
    console.log(`   Duration: ${CallDuration} seconds`);

    // Log call completion
    if (CallStatus === 'completed') {
      console.log(`✅ Call completed: ${CallSid} (${CallDuration}s)`);
    } else if (CallStatus === 'failed' || CallStatus === 'busy' || CallStatus === 'no-answer') {
      console.log(`❌ Call ${CallStatus}: ${CallSid}`);
    }

    // Respond with 200 OK
    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Error in status callback:', error.message);
    res.status(500).send('Error processing status callback');
  }
}

module.exports = {
  handleVoiceWebhook,
  handleGatherWebhook,
  handleStatusCallback,
};
