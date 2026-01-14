// Twilio client configuration
const twilio = require('twilio');

// Cache for initialized client
let cachedClient = null;
let cachedPhoneNumber = null;

/**
 * Initializes and validates Twilio client configuration
 * Includes error handling for missing credentials
 * Uses lazy initialization to ensure environment variables are loaded
 */
const initializeTwilioClient = () => {
  // Return cached client if already initialized
  if (cachedClient) {
    return {
      client: cachedClient,
      phoneNumber: cachedPhoneNumber,
    };
  }

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

    // Validate required credentials
    if (!accountSid || !authToken || !phoneNumber) {
      console.warn('⚠️  Twilio credentials not found. Voice features will not work.');
      console.warn('   Please check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env file');
      // Return dummy values to prevent app crash during startup
      return {
        client: null,
        phoneNumber: null,
      };
    }

    console.log('📞 Initializing Twilio client...');
    cachedClient = twilio(accountSid, authToken);
    cachedPhoneNumber = phoneNumber;

    console.log('✅ Twilio client initialized successfully');
    console.log(`📱 Using phone number: ${phoneNumber}`);

    return {
      client: cachedClient,
      phoneNumber: cachedPhoneNumber,
    };
  } catch (error) {
    console.error('❌ Twilio initialization error:', error.message);
    console.error('   Voice features will not work until this is resolved');
    return {
      client: null,
      phoneNumber: null,
    };
  }
};

/**
 * Gets the Twilio client (lazy initialization)
 */
const getTwilioClient = () => {
  const config = initializeTwilioClient();
  return config.client;
};

/**
 * Gets the Twilio phone number
 */
const getTwilioPhoneNumber = () => {
  const config = initializeTwilioClient();
  return config.phoneNumber;
};

// Export getters and VoiceResponse class
module.exports = {
  get twilioClient() {
    return getTwilioClient();
  },
  get twilioPhoneNumber() {
    return getTwilioPhoneNumber();
  },
  VoiceResponse: twilio.twiml.VoiceResponse,
};
