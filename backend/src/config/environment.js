// Environment configuration validation
require('dotenv').config();

/**
 * Validates that all required environment variables are set
 * Exits the process if critical variables are missing
 */
function validateEnvironment() {
  // Critical variables that must be present
  const criticalVars = [
    'MONGODB_URI',
    'JWT_SECRET',
  ];

  // Optional variables (warn if missing but don't exit)
  const optionalVars = [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER',
  ];

  const missingCritical = criticalVars.filter((envVar) => !process.env[envVar]);

  if (missingCritical.length > 0) {
    console.error('❌ Missing CRITICAL environment variables:');
    missingCritical.forEach((envVar) => {
      console.error(`   - ${envVar}`);
    });
    console.error('\n💡 Please check your .env file and ensure all required variables are set.');
    console.error('   Refer to .env.example for the complete list of required variables.\n');
    process.exit(1);
  }

  const missingOptional = optionalVars.filter((envVar) => !process.env[envVar]);

  if (missingOptional.length > 0) {
    console.warn('⚠️  Missing optional environment variables:');
    missingOptional.forEach((envVar) => {
      console.warn(`   - ${envVar} (Twilio voice features will not work)`);
    });
    console.warn('');
  }

  console.log('✅ All critical environment variables are set');
}

/**
 * Environment configuration object
 */
const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database configuration
  mongodbUri: process.env.MONGODB_URI,

  // Twilio configuration
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },

  // Business configuration
  business: {
    name: process.env.BUSINESS_NAME || 'My Business',
    timezone: process.env.TIMEZONE || 'America/New_York',
  },

  // Frontend configuration
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  // JWT configuration
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: '7d',

  // Development mode flag
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

module.exports = {
  config,
  validateEnvironment,
};
