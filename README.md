# Virtual Assistant Appointment Booking System

A comprehensive voice-based appointment booking system using Twilio Voice API with a modern Next.js admin dashboard.

## 🎯 Features

- **Twilio Voice Integration**: Natural language appointment booking via phone calls
- **Smart Slot Management**: Automatic availability checking and conflict prevention
- **Admin Dashboard**: Modern web interface for managing appointments
- **Real-time Updates**: Socket.IO integration for live dashboard updates
- **Flexible Configuration**: Environment-based business hours and settings
- **Comprehensive Error Handling**: Toast notifications and console logging
- **Responsive Design**: Mobile-friendly admin interface

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Twilio Setup](#twilio-setup)
- [Features Overview](#features-overview)
- [Troubleshooting](#troubleshooting)

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Voice**: Twilio Voice API + Speech Recognition
- **Real-time**: Socket.IO
- **Utilities**: chrono-node for natural language time parsing

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom theme
- **State Management**: React Query
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## 📁 Project Structure

```
appointment-booking-system/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   │   ├── database.js
│   │   │   ├── twilio.js
│   │   │   ├── businessHours.js
│   │   │   └── environment.js
│   │   ├── controllers/     # Request handlers
│   │   │   ├── appointmentController.js
│   │   │   ├── twilioController.js
│   │   │   ├── slotController.js
│   │   │   ├── settingsController.js
│   │   │   └── dashboardController.js
│   │   ├── models/          # MongoDB schemas
│   │   │   ├── Appointment.js
│   │   │   ├── BlockedSlot.js
│   │   │   └── Settings.js
│   │   ├── routes/          # API routes
│   │   │   ├── appointmentRoutes.js
│   │   │   ├── twilioRoutes.js
│   │   │   ├── slotRoutes.js
│   │   │   ├── settingsRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   ├── services/        # Business logic
│   │   │   ├── appointmentService.js
│   │   │   ├── slotService.js
│   │   │   └── twilioVoiceService.js
│   │   ├── utils/           # Utility functions
│   │   │   ├── timeUtils.js
│   │   │   └── validators.js
│   │   ├── middleware/      # Express middleware
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   └── app.js           # Main application
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   │   ├── globals.css  # Theme configuration
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities and API client
│   │   │   ├── api.ts       # API client with error handling
│   │   │   ├── config.ts    # Configuration
│   │   │   └── utils.ts     # Utility functions
│   │   └── types/           # TypeScript types
│   │       └── index.ts
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.js
│
└── README.md
```

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Twilio Account (for voice integration)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see [Configuration](#configuration))

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables** (see [Configuration](#configuration))

## ⚙️ Configuration

### Backend Environment Variables (`.env`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/appointment-booking

# Twilio (Get from https://console.twilio.com)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Business Hours (24-hour format HH:MM)
MORNING_START=09:00
MORNING_END=12:00
AFTERNOON_START=12:30
AFTERNOON_END=20:00
SLOT_DURATION=30

# Business Information
BUSINESS_NAME=Your Business Name
TIMEZONE=America/New_York

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
```

### Frontend Environment Variables (`.env.local`)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Business Hours (mirror backend settings)
NEXT_PUBLIC_MORNING_START=09:00
NEXT_PUBLIC_MORNING_END=12:00
NEXT_PUBLIC_AFTERNOON_START=12:30
NEXT_PUBLIC_AFTERNOON_END=20:00
NEXT_PUBLIC_SLOT_DURATION=30

# Business Information
NEXT_PUBLIC_BUSINESS_NAME=Your Business Name
```

## 🏃 Running the Application

### Development Mode

#### Backend
```bash
cd backend
npm run dev
```
Server will start on `http://localhost:5000`

#### Frontend
```bash
cd frontend
npm run dev
```
Dashboard will be available at `http://localhost:3000`

### Production Mode

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm start
```

## 📱 Twilio Setup

### 1. Create Twilio Account
- Sign up at [https://www.twilio.com](https://www.twilio.com)
- Get a phone number with Voice capabilities

### 2. Configure Webhooks

For local development, use ngrok to expose your local server:

```bash
ngrok http 5000
```

Then configure your Twilio phone number webhooks:
- **Voice Webhook**: `https://your-ngrok-url.ngrok.io/api/twilio/voice`
- **Status Callback**: `https://your-ngrok-url.ngrok.io/api/twilio/status`

### 3. Test the Voice Flow

Call your Twilio phone number and follow the voice prompts:
1. Greeting and business hours announcement
2. Say your preferred time slot (e.g., "9:30 AM")
3. Provide your name
4. Choose callback preference
5. Receive confirmation

## 📚 API Documentation

### Appointments

#### GET /api/appointments
Get all appointments with optional filtering
```
Query Parameters:
- status: scheduled | completed | cancelled | no_show
- date: YYYY-MM-DD
- customerName: string
- page: number
- limit: number
```

#### GET /api/appointments/:id
Get single appointment by ID

#### POST /api/appointments
Create new appointment
```json
{
  "customerName": "John Doe",
  "appointmentDate": "2024-01-15",
  "appointmentTime": "09:30",
  "phoneNumber": "+1234567890",
  "callbackPreference": "same_number"
}
```

#### PUT /api/appointments/:id
Update appointment

#### DELETE /api/appointments/:id
Cancel appointment

### Slots

#### GET /api/slots/available?date=YYYY-MM-DD
Get available slots for a date

#### GET /api/slots/check?date=YYYY-MM-DD&time=HH:MM
Check if a specific slot is available

#### POST /api/slots/block
Block time slots
```json
{
  "date": "2024-01-15",
  "times": ["09:00", "09:30"],
  "reason": "Holiday"
}
```

#### GET /api/slots/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
Get availability for date range

### Settings

#### GET /api/settings
Get current business settings

#### PUT /api/settings
Update settings

#### POST /api/settings/reset
Reset to defaults

### Dashboard

#### GET /api/dashboard/stats
Get dashboard statistics

#### GET /api/dashboard/trends?days=7
Get appointment trends

## 🎨 Theme Customization

All theme colors and styles are controlled via CSS variables in `frontend/src/app/globals.css`.

### Change to Purple Theme:
```css
:root {
  --primary: #8b5cf6;
  --primary-hover: #7c3aed;
  --primary-light: #f5f3ff;
  --primary-dark: #6d28d9;
}
```

### Change to Green Theme:
```css
:root {
  --primary: #10b981;
  --primary-hover: #059669;
  --primary-light: #ecfdf5;
  --primary-dark: #047857;
}
```

## 🔧 Key Features

### Voice Call Flow
1. **Greeting**: Welcomes caller and announces business hours
2. **Time Collection**: Understands natural language time requests
3. **Slot Validation**: Checks availability and suggests alternatives
4. **Name Collection**: Collects customer name
5. **Callback Preference**: Asks for callback number
6. **Confirmation**: Confirms booking details
7. **Cancellation**: Supports appointment cancellation via phone

### Admin Dashboard
- View all appointments with filtering
- Calendar view with slot visualization
- Manual appointment booking
- Block/unblock time slots
- Configure business settings
- Real-time statistics
- Appointment status management

### Error Handling
- **Backend**: Comprehensive console logging with emojis
- **Frontend**: Toast notifications for all actions
- **Validation**: Input validation on both client and server
- **Network**: Retry logic and timeout handling

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**:
```
✅ Check MONGODB_URI in .env file
✅ Verify MongoDB Atlas IP whitelist
✅ Ensure database user has correct permissions
```

**Twilio Webhook Not Receiving Calls**:
```
✅ Verify ngrok is running
✅ Check webhook URL in Twilio console
✅ Ensure server is running on correct port
✅ Check Twilio credentials in .env
```

### Frontend Issues

**API Connection Error**:
```
✅ Check NEXT_PUBLIC_API_URL in .env.local
✅ Verify backend is running
✅ Check CORS configuration in backend
```

**Build Errors**:
```
✅ Delete .next folder and rebuild
✅ Clear node_modules and reinstall
✅ Check TypeScript errors
```

## 📝 Development Notes

### Code Structure
- **Comprehensive Comments**: Every function has descriptive comments
- **Error Handling**: Try-catch blocks with detailed logging
- **Type Safety**: TypeScript for frontend code
- **Validation**: Input validation on both client and server

### Best Practices
- Environment-based configuration
- Modular code organization
- Reusable components and utilities
- Consistent naming conventions
- Comprehensive error messages

## 🤝 Contributing

This is a complete, production-ready system. To extend:
1. Add new features in appropriate directories
2. Follow existing code structure and patterns
3. Add comprehensive error handling
4. Update this README

## 📄 License

ISC

## 🎉 Features to Add (Future)

- [ ] SMS confirmations
- [ ] Email notifications
- [ ] Multiple staff members
- [ ] Recurring appointments
- [ ] Payment integration
- [ ] Customer history tracking
- [ ] Analytics dashboard
- [ ] Multi-language support

---

**Built with ❤️ using Node.js, Express, MongoDB, Next.js, and Twilio**
