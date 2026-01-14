// Main Express application
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');

// Configuration
const { config, validateEnvironment } = require('./config/environment');
const connectDatabase = require('./config/database');

// Middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Routes
const twilioRoutes = require('./routes/twilioRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const slotRoutes = require('./routes/slotRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// ============================================
// VALIDATE ENVIRONMENT VARIABLES
// ============================================
console.log('🔍 Validating environment variables...');
validateEnvironment();

// ============================================
// INITIALIZE EXPRESS APP
// ============================================
const app = express();
const server = http.createServer(app);

// ============================================
// SOCKET.IO SETUP (for real-time dashboard updates)
// ============================================
const io = socketIo(server, {
  cors: {
    origin: config.frontendUrl,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('🔌 Client connected to Socket.IO:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// ============================================
// MIDDLEWARE
// ============================================

// Security headers
app.use(helmet());

// Compression
app.use(compression());

// CORS configuration
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware (only in development)
if (config.isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Request logging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// ============================================
// HEALTH CHECK ROUTE
// ============================================
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// API ROUTES
// ============================================
app.use('/api/twilio', twilioRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Virtual Assistant Appointment Booking API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      appointments: '/api/appointments',
      slots: '/api/slots',
      settings: '/api/settings',
      dashboard: '/api/dashboard',
      twilio: '/api/twilio',
    },
  });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ============================================
// DATABASE CONNECTION & SERVER START
// ============================================
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start listening
    const PORT = config.port;
    server.listen(PORT, () => {
      console.log('\n🚀 ===================================');
      console.log('   SERVER STARTED SUCCESSFULLY');
      console.log('   ===================================');
      console.log(`   Environment: ${config.nodeEnv}`);
      console.log(`   Port: ${PORT}`);
      console.log(`   URL: http://localhost:${PORT}`);
      console.log(`   Health Check: http://localhost:${PORT}/health`);
      console.log(`   API Docs: http://localhost:${PORT}/`);
      console.log('   ===================================\n');
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error('❌ Server error:', error.message);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ UNCAUGHT EXCEPTION:');
  console.error(error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION:');
  console.error('Promise:', promise);
  console.error('Reason:', reason);
  process.exit(1);
});

// ============================================
// START THE SERVER
// ============================================
startServer();

module.exports = app;
