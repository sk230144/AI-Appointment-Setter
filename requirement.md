# Virtual Assistant Appointment Booking System

## Project Overview
Build a voice-based virtual assistant for appointment booking (similar to barber shops, doctor clinics) using Twilio. The system includes a phone-based booking interface and a web admin dashboard.

---

## Tech Stack

### Backend
- **Runtime:** Node.js with Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Voice Integration:** Twilio Voice API + Twilio Speech Recognition
- **Real-time Updates:** Socket.io (for admin dashboard)

### Frontend (Admin Dashboard)
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **State Management:** React Query / SWR
- **UI Components:** shadcn/ui

### Infrastructure
- **Hosting:** Vercel (frontend) + Railway/Render (backend)
- **Database:** MongoDB Atlas

---

## Core Features

### 1. Twilio Voice Assistant

#### Business Hours Configuration
**All business hours are configured via environment variables for easy modification without code changes.**

```env
# See Environment Variables section for full configuration
MORNING_START=09:00
MORNING_END=12:00
AFTERNOON_START=12:30
AFTERNOON_END=20:00
SLOT_DURATION=30
```

#### Call Flow
1. **Greeting:** "Hello! Welcome to [Business Name]. I can help you book an appointment."
2. **Slot Information:** "We have slots available from 9 AM to 12 PM and 12:30 PM to 8 PM. What time would you like to book?"
3. **Slot Validation:**
   - Check if requested time is within business hours
   - Check if slot is not already booked
   - If unavailable, suggest nearest available slots
4. **Name Collection:** "Great! The slot at [time] is available. May I have your name please?"
5. **Callback Number:**
   - "Can we call you back on this number if needed?"
   - If YES → Store the calling number
   - If NO, ANOTHER NUMBER → "Please tell me the number"
   - If NO CALLBACK → Mark as "No callback preferred"
6. **Confirmation:** "Your appointment is confirmed for [time] under the name [name]. Thank you!"

#### Voice Commands to Handle
- "Book at 9:30" / "I want 9:30 AM slot"
- "What slots are available?"
- "Cancel my appointment"
- "Reschedule my appointment"
- "Yes" / "No" / "Another number"
- Natural number dictation

---

### 2. Admin Dashboard

#### Features
- **Appointment List View**
  - Customer Name
  - Appointment Time & Date
  - Phone Number (if provided)
  - Callback Preference Status
  - Booking Timestamp
  
- **Calendar View**
  - Daily/Weekly view of appointments
  - Color-coded slots (Available/Booked)
  
- **Actions**
  - Mark as completed
  - Cancel appointment
  - Manual booking
  - Edit appointment details

- **Settings**
  - Configure business hours
  - Set slot duration
  - Block specific dates/times
  - Customize greeting messages

---

## Database Schema

### Appointment Collection
```javascript
{
  _id: ObjectId,
  customerName: String,
  appointmentDate: Date,
  appointmentTime: String, // "09:30"
  phoneNumber: String | null,
  callingNumber: String, // Original Twilio caller ID
  callbackPreference: {
    type: String,
    enum: ['same_number', 'different_number', 'no_callback']
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'no_show']
  },
  createdAt: Date,
  updatedAt: Date,
  twilioCallSid: String // For reference
}
```

### BlockedSlots Collection
```javascript
{
  _id: ObjectId,
  date: Date,
  blockedTimes: [String], // ["09:00", "09:30"]
  reason: String,
  createdAt: Date
}
```

### Settings Collection
```javascript
{
  _id: ObjectId,
  businessName: String,
  morningStart: String, // "09:00"
  morningEnd: String, // "12:00"
  afternoonStart: String, // "12:30"
  afternoonEnd: String, // "20:00"
  slotDuration: Number, // 30 (minutes)
  greetingMessage: String,
  timezone: String
}
```

---

## API Endpoints

### Twilio Webhooks
```
POST /api/twilio/voice          - Handle incoming calls
POST /api/twilio/gather         - Handle speech input
POST /api/twilio/status         - Call status callbacks
```

### Admin API
```
GET    /api/appointments              - List all appointments (with filters)
GET    /api/appointments/:id          - Get single appointment
POST   /api/appointments              - Create manual appointment
PUT    /api/appointments/:id          - Update appointment
DELETE /api/appointments/:id          - Cancel appointment

GET    /api/slots/available           - Get available slots for a date
POST   /api/slots/block               - Block specific slots

GET    /api/settings                  - Get business settings
PUT    /api/settings                  - Update settings

GET    /api/dashboard/stats           - Dashboard statistics
```

---

## Folder Structure

```
appointment-booking-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── twilio.js
│   │   │   ├── businessHours.js    # ← Reads slot timings from ENV
│   │   │   └── environment.js
│   │   ├── controllers/
│   │   │   ├── appointmentController.js
│   │   │   ├── twilioController.js
│   │   │   ├── slotController.js
│   │   │   └── settingsController.js
│   │   ├── models/
│   │   │   ├── Appointment.js
│   │   │   ├── BlockedSlot.js
│   │   │   └── Settings.js
│   │   ├── routes/
│   │   │   ├── appointmentRoutes.js
│   │   │   ├── twilioRoutes.js
│   │   │   ├── slotRoutes.js
│   │   │   └── settingsRoutes.js
│   │   ├── services/
│   │   │   ├── appointmentService.js
│   │   │   ├── slotService.js
│   │   │   └── twilioVoiceService.js
│   │   ├── utils/
│   │   │   ├── timeUtils.js
│   │   │   └── validators.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   └── app.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css         # ← THEME CONFIG HERE (CSS Variables)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── appointments/
│   │   │   │   └── page.tsx
│   │   │   ├── calendar/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── components/
│   │   │   ├── AppointmentTable.tsx
│   │   │   ├── CalendarView.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   └── ui/
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── config.ts           # ← Reads business hours from ENV
│   │   │   └── utils.ts
│   │   └── types/
│   │       └── index.ts
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## Environment Variables

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/appointment-booking

# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# ============================================
# BUSINESS HOURS CONFIGURATION
# Modify these values to change slot timings
# Times are in 24-hour format (HH:MM)
# ============================================
MORNING_START=09:00
MORNING_END=12:00
AFTERNOON_START=12:30
AFTERNOON_END=20:00
SLOT_DURATION=30

# Business Info
BUSINESS_NAME=Your Business Name
TIMEZONE=America/New_York

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# JWT (for admin auth)
JWT_SECRET=your_jwt_secret
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# ============================================
# BUSINESS HOURS (Mirror backend for UI display)
# ============================================
NEXT_PUBLIC_MORNING_START=09:00
NEXT_PUBLIC_MORNING_END=12:00
NEXT_PUBLIC_AFTERNOON_START=12:30
NEXT_PUBLIC_AFTERNOON_END=20:00
NEXT_PUBLIC_SLOT_DURATION=30
NEXT_PUBLIC_BUSINESS_NAME=Your Business Name
```

---

## Theme Configuration (index.css)

**All UI theme colors and styles are controlled via CSS variables in `src/app/globals.css` (or `index.css`). Modify these values to change the entire theme without touching components.**

### globals.css / index.css
```css
/* ============================================
   THEME CONFIGURATION
   Modify these CSS variables to change the entire UI theme
   ============================================ */

:root {
  /* -------- Primary Colors -------- */
  --primary: #3b82f6;           /* Main brand color (buttons, links) */
  --primary-hover: #2563eb;     /* Primary hover state */
  --primary-light: #eff6ff;     /* Light primary (backgrounds) */
  --primary-dark: #1d4ed8;      /* Dark primary (active states) */

  /* -------- Secondary Colors -------- */
  --secondary: #64748b;         /* Secondary actions */
  --secondary-hover: #475569;
  --secondary-light: #f1f5f9;

  /* -------- Status Colors -------- */
  --success: #22c55e;           /* Confirmed appointments */
  --success-light: #dcfce7;
  --warning: #f59e0b;           /* Pending/attention needed */
  --warning-light: #fef3c7;
  --danger: #ef4444;            /* Cancelled/errors */
  --danger-light: #fee2e2;
  --info: #06b6d4;              /* Information */
  --info-light: #cffafe;

  /* -------- Background Colors -------- */
  --bg-primary: #ffffff;        /* Main background */
  --bg-secondary: #f8fafc;      /* Secondary background (sidebar, cards) */
  --bg-tertiary: #f1f5f9;       /* Tertiary background (hover states) */

  /* -------- Text Colors -------- */
  --text-primary: #0f172a;      /* Main text */
  --text-secondary: #475569;    /* Secondary text */
  --text-muted: #94a3b8;        /* Muted/placeholder text */
  --text-inverse: #ffffff;      /* Text on dark backgrounds */

  /* -------- Border Colors -------- */
  --border-light: #e2e8f0;      /* Light borders */
  --border-medium: #cbd5e1;     /* Medium borders */
  --border-dark: #94a3b8;       /* Dark borders */

  /* -------- Slot Status Colors -------- */
  --slot-available: #22c55e;    /* Available slot */
  --slot-booked: #ef4444;       /* Booked slot */
  --slot-blocked: #94a3b8;      /* Blocked slot */
  --slot-selected: #3b82f6;     /* Currently selected slot */

  /* -------- Shadows -------- */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* -------- Border Radius -------- */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;

  /* -------- Spacing -------- */
  --sidebar-width: 250px;
  --header-height: 64px;

  /* -------- Fonts -------- */
  --font-family: 'Inter', system-ui, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;

  /* -------- Transitions -------- */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;
}

/* ============================================
   DARK MODE THEME (Optional)
   Uncomment and modify for dark mode support
   ============================================ */
/*
.dark, [data-theme="dark"] {
  --primary: #60a5fa;
  --primary-hover: #3b82f6;
  --primary-light: #1e3a5f;
  
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-muted: #64748b;
  
  --border-light: #334155;
  --border-medium: #475569;
}
*/

/* ============================================
   BASE STYLES
   ============================================ */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  line-height: 1.5;
}

/* ============================================
   UTILITY CLASSES (Using CSS Variables)
   ============================================ */
.btn-primary {
  background-color: var(--primary);
  color: var(--text-inverse);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.slot-available {
  background-color: var(--slot-available);
}

.slot-booked {
  background-color: var(--slot-booked);
}

.slot-blocked {
  background-color: var(--slot-blocked);
}
```

### How to Change Theme

**Example: Change to a Purple Theme**
```css
:root {
  --primary: #8b5cf6;           /* Purple */
  --primary-hover: #7c3aed;
  --primary-light: #f5f3ff;
  --primary-dark: #6d28d9;
}
```

**Example: Change to a Green Theme**
```css
:root {
  --primary: #10b981;           /* Green */
  --primary-hover: #059669;
  --primary-light: #ecfdf5;
  --primary-dark: #047857;
}
```

---

## Configuration Files

### Backend: businessHours.js
**Location:** `backend/src/config/businessHours.js`

```javascript
// ============================================
// BUSINESS HOURS CONFIGURATION
// All values are read from environment variables
// Change .env file to modify timings - NO CODE CHANGES NEEDED
// ============================================

const businessHours = {
  morning: {
    start: process.env.MORNING_START || '09:00',
    end: process.env.MORNING_END || '12:00',
  },
  afternoon: {
    start: process.env.AFTERNOON_START || '12:30',
    end: process.env.AFTERNOON_END || '20:00',
  },
  slotDuration: parseInt(process.env.SLOT_DURATION) || 30, // in minutes
  businessName: process.env.BUSINESS_NAME || 'My Business',
  timezone: process.env.TIMEZONE || 'America/New_York',
};

// Generate all available time slots based on ENV config
function generateTimeSlots() {
  const slots = [];
  const duration = businessHours.slotDuration;

  // Morning slots
  let current = timeToMinutes(businessHours.morning.start);
  const morningEnd = timeToMinutes(businessHours.morning.end);
  while (current < morningEnd) {
    slots.push(minutesToTime(current));
    current += duration;
  }

  // Afternoon slots
  current = timeToMinutes(businessHours.afternoon.start);
  const afternoonEnd = timeToMinutes(businessHours.afternoon.end);
  while (current < afternoonEnd) {
    slots.push(minutesToTime(current));
    current += duration;
  }

  return slots;
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
  const mins = (minutes % 60).toString().padStart(2, '0');
  return `${hours}:${mins}`;
}

module.exports = {
  businessHours,
  generateTimeSlots,
};
```

### Frontend: config.ts
**Location:** `frontend/src/lib/config.ts`

```typescript
// ============================================
// FRONTEND CONFIGURATION
// Reads business hours from environment variables
// ============================================

export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  
  businessHours: {
    morning: {
      start: process.env.NEXT_PUBLIC_MORNING_START || '09:00',
      end: process.env.NEXT_PUBLIC_MORNING_END || '12:00',
    },
    afternoon: {
      start: process.env.NEXT_PUBLIC_AFTERNOON_START || '12:30',
      end: process.env.NEXT_PUBLIC_AFTERNOON_END || '20:00',
    },
    slotDuration: parseInt(process.env.NEXT_PUBLIC_SLOT_DURATION || '30'),
  },
  
  businessName: process.env.NEXT_PUBLIC_BUSINESS_NAME || 'My Business',
};

// Helper to format time for display
export function formatTimeDisplay(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}
```

---

### State Machine for Call
```
States:
1. GREETING → Welcome message, ask for time
2. COLLECT_TIME → Listen for time slot
3. VALIDATE_SLOT → Check availability
4. SUGGEST_ALTERNATIVES → If slot unavailable
5. COLLECT_NAME → Get customer name
6. COLLECT_CALLBACK → Ask about callback preference
7. COLLECT_ALT_NUMBER → If different number needed
8. CONFIRMATION → Confirm booking details
9. END → Thank you & goodbye
```

### TwiML Response Examples

```xml
<!-- Greeting -->
<Response>
  <Say voice="Polly.Joanna">
    Hello! Welcome to ABC Clinic. I can help you book an appointment.
    We have slots available from 9 AM to 12 PM and 12:30 PM to 8 PM.
    What time would you like to book?
  </Say>
  <Gather input="speech" timeout="5" action="/api/twilio/gather?state=COLLECT_TIME">
    <Say>Please say your preferred time.</Say>
  </Gather>
</Response>
```

---

## Key Implementation Notes

### Slot Availability Check
```javascript
// Before booking, ALWAYS verify:
async function isSlotAvailable(date, time) {
  // 1. Check if time is within business hours
  // 2. Check if date is not a blocked date
  // 3. Check if no existing appointment at that time
  // 4. Check if slot is not in blocked slots
  
  const existingAppointment = await Appointment.findOne({
    appointmentDate: date,
    appointmentTime: time,
    status: { $in: ['scheduled'] }
  });
  
  return !existingAppointment;
}
```

### Time Parsing from Speech
```javascript
// Handle various speech inputs
// "nine thirty" → "09:30"
// "9:30 AM" → "09:30"
// "half past nine" → "09:30"
// "2 PM" → "14:00"

function parseSpokenTime(speech) {
  // Use regex patterns and number word mapping
  // Consider using a library like chrono-node for parsing
}
```

---

## Development Steps

1. **Phase 1: Backend Setup**
   - Set up Express server with MongoDB connection
   - Create all database models
   - Implement appointment CRUD APIs
   - Set up Twilio webhook endpoints

2. **Phase 2: Twilio Integration**
   - Configure Twilio phone number webhooks
   - Implement voice flow state machine
   - Add speech recognition handling
   - Test call flow end-to-end

3. **Phase 3: Admin Dashboard**
   - Set up Next.js project with Tailwind
   - Create appointment list view
   - Add calendar view
   - Implement settings page

4. **Phase 4: Testing & Polish**
   - Test various speech inputs
   - Handle edge cases
   - Add error handling
   - Deploy to production

---

## Commands to Start

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Expose Local Server for Twilio (Development)
```bash
ngrok http 5000
# Then update Twilio webhook URL to ngrok URL
```

---

## Additional Features (Future Scope)

- [ ] SMS confirmation after booking
- [ ] Email notifications
- [ ] Multiple staff/resource booking
- [ ] Recurring appointments
- [ ] Payment integration
- [ ] Customer history tracking
- [ ] Analytics dashboard
- [ ] Multi-language support

---

## Important Reminders

1. **ALWAYS check slot availability before confirming** - This is critical to avoid double bookings
2. **Store Twilio Call SID** - For debugging and reference
3. **Handle speech recognition failures** - Have fallback prompts
4. **Timezone handling** - Store all times in UTC, convert for display
5. **Validate phone numbers** - Use Twilio Lookup API if needed
6. **Rate limiting** - Prevent abuse of the system

---

*Copy this entire document and paste it to your AI assistant to build this system.*

---

## Quick Reference: What to Modify

| What to Change | Where to Modify | Example |
|----------------|-----------------|---------|
| Business Hours | Backend `.env` | `MORNING_START=10:00` |
| Slot Duration | Backend `.env` | `SLOT_DURATION=45` |
| Business Name | Backend `.env` | `BUSINESS_NAME=ABC Clinic` |
| UI Theme Colors | `frontend/src/app/globals.css` | `--primary: #8b5cf6;` |
| Button Styles | `frontend/src/app/globals.css` | Modify `.btn-primary` |
| Card Shadows | `frontend/src/app/globals.css` | `--shadow-md: ...` |
| Font Family | `frontend/src/app/globals.css` | `--font-family: 'Poppins'` |
| Dark Mode | `frontend/src/app/globals.css` | Uncomment dark theme section |

**No code changes needed for business hours or theme - just modify ENV and CSS!**