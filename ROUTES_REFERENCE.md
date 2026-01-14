# 🗺️ Complete Routes Reference

## Frontend Routes (Next.js App Router)

### Public Routes

#### Landing Page
```
GET /
```
**Description:** Main landing page with hero section, features, and CTA
**File:** [frontend/src/app/page.tsx](frontend/src/app/page.tsx)
**Features:**
- Hero with gradient text and floating badges
- Stats showcase (4 cards)
- Features grid (6 cards)
- How-it-works section (3 steps)
- CTA section
- Animated blob background

---

### Dashboard Routes (With Sidebar Layout)

#### Main Dashboard
```
GET /dashboard
```
**Description:** Admin dashboard with stats, charts, and upcoming appointments
**File:** [frontend/src/app/dashboard/page.tsx](frontend/src/app/dashboard/page.tsx)
**Features:**
- 4 stat cards (Total, Today, Completed, Customers)
- Animated bar chart (7-day overview)
- Upcoming appointments list (4 items)
- Recent activity feed (4 items)
- Full appointments table

#### Appointments Management
```
GET /appointments
```
**Description:** Manage all appointments with search and filters
**File:** [frontend/src/app/appointments/page.tsx](frontend/src/app/appointments/page.tsx)
**Features:**
- Advanced search bar
- Status filter dropdown
- Quick stats (4 cards)
- Full appointments table
- Create new appointment button

#### Time Slots Management
```
GET /slots
```
**Description:** View and manage time slots with calendar
**File:** [frontend/src/app/slots/page.tsx](frontend/src/app/slots/page.tsx)
**Features:**
- Stats cards (Total, Available, Booked, Blocked)
- Date picker
- View toggle (List / Calendar)
- Morning and afternoon slot sections
- Calendar view with monthly overview

#### System Settings
```
GET /settings
```
**Description:** Configure system settings
**File:** [frontend/src/app/settings/page.tsx](frontend/src/app/settings/page.tsx)
**Features:**
- Business hours configuration
- Contact information
- Notification preferences
- Voice settings
- System information

---

## Backend API Routes (Express.js)

### Base URL
```
http://localhost:5000
```

---

### Health & Status

#### Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "uptime": 3600
}
```

---

### Appointment Routes (`/api/appointments`)

#### Get All Appointments
```
GET /api/appointments
```
**Query Parameters:**
- `status` (optional): Filter by status (scheduled, confirmed, completed, cancelled)
- `date` (optional): Filter by date (YYYY-MM-DD)
- `limit` (optional): Number of results (default: 50)
- `skip` (optional): Skip results for pagination

**Response:**
```json
{
  "success": true,
  "count": 24,
  "data": [
    {
      "_id": "65a123...",
      "customerName": "John Doe",
      "phoneNumber": "+1234567890",
      "appointmentDate": "2024-01-15",
      "appointmentTime": "09:00",
      "status": "scheduled",
      "createdAt": "2024-01-10T10:00:00.000Z"
    }
  ]
}
```

#### Get Appointments by Phone
```
GET /api/appointments/phone/:phoneNumber
```
**Example:** `/api/appointments/phone/+1234567890`

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

#### Get Single Appointment
```
GET /api/appointments/:id
```
**Example:** `/api/appointments/65a123abc...`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65a123...",
    "customerName": "John Doe",
    ...
  }
}
```

#### Create Appointment
```
POST /api/appointments
```
**Request Body:**
```json
{
  "customerName": "John Doe",
  "phoneNumber": "+1234567890",
  "appointmentDate": "2024-01-15",
  "appointmentTime": "09:00"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment created successfully",
  "data": {
    "_id": "65a123...",
    ...
  }
}
```

#### Update Appointment
```
PUT /api/appointments/:id
```
**Request Body:**
```json
{
  "appointmentDate": "2024-01-16",
  "appointmentTime": "10:00",
  "status": "confirmed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment updated successfully",
  "data": {...}
}
```

#### Cancel Appointment
```
DELETE /api/appointments/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully"
}
```

---

### Slot Routes (`/api/slots`)

#### Get Available Slots
```
GET /api/slots/available?date=YYYY-MM-DD
```
**Example:** `/api/slots/available?date=2024-01-15`

**Response:**
```json
{
  "success": true,
  "date": "2024-01-15",
  "totalSlots": 48,
  "availableCount": 42,
  "bookedCount": 4,
  "blockedCount": 2,
  "availableSlots": ["09:00", "09:30", "10:00", ...],
  "bookedSlots": ["10:30", "11:00", "14:00", "15:30"],
  "blockedSlots": ["12:00", "12:30"]
}
```

#### Check Specific Slot
```
GET /api/slots/check?date=YYYY-MM-DD&time=HH:MM
```
**Example:** `/api/slots/check?date=2024-01-15&time=09:00`

**Response:**
```json
{
  "success": true,
  "date": "2024-01-15",
  "time": "09:00",
  "isAvailable": true,
  "status": "available"
}
```

#### Block Time Slots
```
POST /api/slots/block
```
**Request Body:**
```json
{
  "date": "2024-01-15",
  "times": ["12:00", "12:30"],
  "reason": "Staff meeting"
}
```

**Response:**
```json
{
  "success": true,
  "message": "2 slots blocked successfully",
  "data": [...]
}
```

#### Unblock Time Slots
```
POST /api/slots/unblock
```
**Request Body:**
```json
{
  "date": "2024-01-15",
  "times": ["12:00", "12:30"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "2 slots unblocked successfully"
}
```

#### Get Slots for Date Range
```
GET /api/slots/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```
**Example:** `/api/slots/range?startDate=2024-01-15&endDate=2024-01-21`

**Response:**
```json
{
  "success": true,
  "startDate": "2024-01-15",
  "endDate": "2024-01-21",
  "slots": {
    "2024-01-15": {
      "available": 42,
      "booked": 4,
      "blocked": 2
    },
    "2024-01-16": {...},
    ...
  }
}
```

---

### Settings Routes (`/api/settings`)

#### Get Settings
```
GET /api/settings
```

**Response:**
```json
{
  "success": true,
  "data": {
    "businessHours": {
      "morning": { "start": "09:00", "end": "12:00" },
      "afternoon": { "start": "14:00", "end": "17:00" }
    },
    "slotDuration": 30,
    "businessName": "Your Business",
    "contactInfo": {
      "phoneNumber": "+1234567890",
      "email": "contact@business.com"
    },
    "notifications": {
      "emailEnabled": true,
      "smsEnabled": true,
      "reminderTime": 24
    },
    "voice": {
      "language": "en-US",
      "gender": "female"
    }
  }
}
```

#### Update Settings
```
PUT /api/settings
```
**Request Body:**
```json
{
  "slotDuration": 15,
  "businessName": "New Business Name",
  "notifications": {
    "emailEnabled": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": {...}
}
```

#### Reset Settings to Default
```
POST /api/settings/reset
```

**Response:**
```json
{
  "success": true,
  "message": "Settings reset to defaults",
  "data": {...}
}
```

---

### Dashboard Routes (`/api/dashboard`)

#### Get Dashboard Stats
```
GET /api/dashboard/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalAppointments": 248,
    "todayAppointments": 24,
    "completedAppointments": 186,
    "totalCustomers": 142,
    "statusBreakdown": {
      "scheduled": 42,
      "confirmed": 20,
      "completed": 186,
      "cancelled": 20
    },
    "upcomingToday": [
      {
        "time": "09:00",
        "customerName": "John Doe",
        "status": "confirmed"
      },
      ...
    ]
  }
}
```

#### Get Appointment Trends
```
GET /api/dashboard/trends?days=7
```
**Query Parameters:**
- `days` (optional): Number of days (default: 7, max: 30)

**Response:**
```json
{
  "success": true,
  "period": "7 days",
  "data": [
    { "date": "2024-01-09", "count": 15 },
    { "date": "2024-01-10", "count": 18 },
    { "date": "2024-01-11", "count": 12 },
    { "date": "2024-01-12", "count": 22 },
    { "date": "2024-01-13", "count": 19 },
    { "date": "2024-01-14", "count": 16 },
    { "date": "2024-01-15", "count": 24 }
  ]
}
```

---

### Twilio Webhook Routes (`/api/twilio`)

#### Voice Webhook
```
POST /api/twilio/voice
```
**Description:** Handles incoming voice calls from Twilio

**Request Body (from Twilio):**
```
CallSid=CA123456789
From=+1234567890
To=+0987654321
CallStatus=ringing
```

**Response:** TwiML XML
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">
    Hello! Welcome to Your Business.
    We have several slots between 9 AM and 12 PM,
    and some slots between 2 PM and 5 PM.
    What time would you like to book?
  </Say>
  <Gather input="speech" action="/api/twilio/gather" />
</Response>
```

#### Call Status Callback
```
POST /api/twilio/status
```
**Description:** Receives call status updates from Twilio

**Request Body (from Twilio):**
```
CallSid=CA123456789
CallStatus=completed
CallDuration=145
```

**Response:**
```json
{
  "success": true,
  "message": "Status updated"
}
```

---

## Error Responses

All API endpoints follow this error format:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error",
  "message": "Invalid appointment time format"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Not found",
  "message": "Appointment not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Request Headers

### Required for All API Requests
```
Content-Type: application/json
```

### Optional (for authenticated routes)
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Rate Limiting

**Default Limits:**
- 100 requests per 15 minutes per IP
- 1000 requests per hour per IP

**Headers Returned:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642252800
```

---

## CORS Configuration

**Allowed Origins (Development):**
- http://localhost:3000
- http://localhost:5000

**Allowed Methods:**
- GET, POST, PUT, DELETE, OPTIONS

**Allowed Headers:**
- Content-Type, Authorization

---

## WebSocket Events (Socket.IO)

### Connect
```javascript
socket.on('connect', () => {
  console.log('Connected to server');
});
```

### Appointment Created
```javascript
socket.on('appointment:created', (data) => {
  console.log('New appointment:', data);
});
```

### Appointment Updated
```javascript
socket.on('appointment:updated', (data) => {
  console.log('Appointment updated:', data);
});
```

### Appointment Cancelled
```javascript
socket.on('appointment:cancelled', (data) => {
  console.log('Appointment cancelled:', data);
});
```

### Slot Blocked
```javascript
socket.on('slot:blocked', (data) => {
  console.log('Slot blocked:', data);
});
```

---

## Testing Routes

### Using cURL

#### Get Available Slots
```bash
curl http://localhost:5000/api/slots/available?date=2024-01-15
```

#### Create Appointment
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "phoneNumber": "+1234567890",
    "appointmentDate": "2024-01-15",
    "appointmentTime": "09:00"
  }'
```

#### Update Settings
```bash
curl -X PUT http://localhost:5000/api/settings \
  -H "Content-Type: application/json" \
  -d '{
    "slotDuration": 15
  }'
```

### Using Postman

1. Import the collection (create manually or use provided)
2. Set base URL: `http://localhost:5000`
3. Add Content-Type header: `application/json`
4. Test all endpoints

---

## Route Summary

### Frontend (5 routes)
- `/` - Landing page
- `/dashboard` - Main dashboard
- `/appointments` - Appointments management
- `/slots` - Time slots management
- `/settings` - System settings

### Backend API (20+ endpoints)
- **Appointments:** 6 endpoints
- **Slots:** 5 endpoints
- **Settings:** 3 endpoints
- **Dashboard:** 2 endpoints
- **Twilio:** 2 webhooks
- **Health:** 1 endpoint

### WebSocket (5 events)
- appointment:created
- appointment:updated
- appointment:cancelled
- slot:blocked
- slot:unblocked

---

**📚 Complete routes reference for your appointment booking system!**

All routes are documented, tested, and production-ready!
