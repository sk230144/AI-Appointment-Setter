// Database configuration and connection handler
const mongoose = require('mongoose');

/**
 * Connects to MongoDB database using the URI from environment variables
 * Includes comprehensive error handling and connection event listeners
 */
const connectDatabase = async () => {
  try {
    console.log('📦 Attempting to connect to MongoDB...');

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);

    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });

    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

module.exports = connectDatabase;
