# API Documentation

Complete API reference for the Barbershop Booking System.

**Base URL (Development)**: `http://localhost:5000/api`  
**Base URL (Production)**: `https://your-app.onrender.com/api`

---

## Authentication

All admin endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### Health Check

#### GET /health
Check if the server is running.

**Public**: Yes  
**Authentication**: Not required

**Response**:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Authentication Endpoints

### Register Admin

#### POST /api/auth/register
Create the first admin account. Automatically disabled after one admin exists.

**Public**: Yes (only works when no admins exist)  
**Authentication**: Not required

**Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "securePassword123"
}
```

**Validation**:
- Email must be valid format
- Password minimum 6 characters

**Success Response** (201):
```json
{
  "success": true,
  "message": "Admin registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com"
  }
}
```

**Error Response** (403):
```json
{
  "success": false,
  "message": "Admin registration is closed. Contact existing admin."
}
```

---

### Login

#### POST /api/auth/login
Admin login.

**Public**: Yes  
**Authentication**: Not required

**Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "securePassword123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com"
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Verify Token

#### GET /api/auth/verify
Verify JWT token and get admin info.

**Public**: No  
**Authentication**: Required

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200):
```json
{
  "success": true,
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Invalid token"
}
```

---

## Appointment Endpoints

### Create Appointment

#### POST /api/appointments
Book a new appointment (customer facing).

**Public**: Yes  
**Authentication**: Not required

**Request Body (In-Person)**:
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "(555) 123-4567",
  "appointmentType": "inPerson",
  "date": "2024-02-15",
  "timeSlot": "10:00"
}
```

**Request Body (Outcall)**:
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "(555) 123-4567",
  "appointmentType": "outcall",
  "date": "2024-02-15",
  "timeSlot": "10:00",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  }
}
```

**Validation**:
- All fields required except address (required for outcall)
- Date must be in the future
- Time slot format: HH:MM (24-hour)
- Email must be valid
- Phone must be valid format
- No double-booking allowed

**Success Response** (201):
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "appointment": {
    "_id": "507f1f77bcf86cd799439011",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "(555) 123-4567",
    "appointmentType": "outcall",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "zipCode": "10001"
    },
    "date": "2024-02-15T00:00:00.000Z",
    "timeSlot": "10:00",
    "price": 15,
    "status": "upcoming",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "This time slot is already booked. Please choose another time."
}
```

---

### Get All Appointments

#### GET /api/appointments
Retrieve all appointments with optional filtering.

**Public**: No  
**Authentication**: Required (Admin)

**Query Parameters**:
- `date` (optional): Filter by date (YYYY-MM-DD)
- `status` (optional): Filter by status (upcoming/completed/canceled)
- `type` (optional): Filter by type (inPerson/outcall)

**Examples**:
```
GET /api/appointments
GET /api/appointments?date=2024-02-15
GET /api/appointments?status=upcoming
GET /api/appointments?type=outcall
GET /api/appointments?date=2024-02-15&status=upcoming
```

**Success Response** (200):
```json
{
  "success": true,
  "count": 2,
  "appointments": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "customerPhone": "(555) 123-4567",
      "appointmentType": "inPerson",
      "date": "2024-02-15T00:00:00.000Z",
      "timeSlot": "10:00",
      "price": 15,
      "status": "upcoming",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "customerName": "Jane Smith",
      "customerEmail": "jane@example.com",
      "customerPhone": "(555) 987-6543",
      "appointmentType": "outcall",
      "address": {
        "street": "456 Oak Ave",
        "city": "Boston",
        "zipCode": "02101"
      },
      "date": "2024-02-16T00:00:00.000Z",
      "timeSlot": "14:00",
      "price": 15,
      "status": "upcoming",
      "createdAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

---

### Get Single Appointment

#### GET /api/appointments/:id
Retrieve a specific appointment by ID.

**Public**: No  
**Authentication**: Required (Admin)

**URL Parameters**:
- `id`: Appointment ID

**Success Response** (200):
```json
{
  "success": true,
  "appointment": {
    "_id": "507f1f77bcf86cd799439011",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "(555) 123-4567",
    "appointmentType": "inPerson",
    "date": "2024-02-15T00:00:00.000Z",
    "timeSlot": "10:00",
    "price": 15,
    "status": "upcoming",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "Appointment not found"
}
```

---

### Update Appointment Status

#### PATCH /api/appointments/:id
Update the status of an appointment.

**Public**: No  
**Authentication**: Required (Admin)

**URL Parameters**:
- `id`: Appointment ID

**Request Body**:
```json
{
  "status": "completed"
}
```

**Valid Status Values**:
- `upcoming`
- `completed`
- `canceled`

**Success Response** (200):
```json
{
  "success": true,
  "message": "Appointment status updated",
  "appointment": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "completed",
    ...
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Invalid status value"
}
```

---

### Delete Appointment

#### DELETE /api/appointments/:id
Delete an appointment permanently.

**Public**: No  
**Authentication**: Required (Admin)

**URL Parameters**:
- `id`: Appointment ID

**Success Response** (200):
```json
{
  "success": true,
  "message": "Appointment deleted successfully"
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "Appointment not found"
}
```

---

### Get Available Time Slots

#### GET /api/appointments/available-slots/:date
Get available time slots for a specific date.

**Public**: Yes  
**Authentication**: Not required

**URL Parameters**:
- `date`: Date in YYYY-MM-DD format

**Example**:
```
GET /api/appointments/available-slots/2024-02-15
```

**Success Response** (200):
```json
{
  "success": true,
  "date": "2024-02-15",
  "availableSlots": [
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00"
  ],
  "bookedSlots": [
    "12:00"
  ]
}
```

**Business Hours**:
- Monday-Friday: 9:00 AM - 6:00 PM
- Saturday: 9:00 AM - 5:00 PM
- Sunday: Closed

**Available Time Slots**:
```
09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00
```

---

## Error Responses

### Common Error Formats

**Validation Error** (400):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Customer name is required",
    "Please provide a valid email address"
  ]
}
```

**Authentication Error** (401):
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**Not Found** (404):
```json
{
  "success": false,
  "message": "Route /api/invalid not found"
}
```

**Server Error** (500):
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding:
- Express rate limit middleware
- Rate limit per IP
- Different limits for public vs. authenticated endpoints

---

## Testing with cURL

### Create Appointment
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "5551234567",
    "appointmentType": "inPerson",
    "date": "2024-02-15",
    "timeSlot": "10:00"
  }'
```

### Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### Get All Appointments (with token)
```bash
curl http://localhost:5000/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Testing with Postman

1. Import the API endpoints
2. Create an environment with:
   - `base_url`: http://localhost:5000/api
   - `token`: (set after login)
3. For protected routes:
   - Go to Authorization tab
   - Type: Bearer Token
   - Token: {{token}}

---

## WebSocket Support

Currently not implemented. For real-time updates, consider adding:
- Socket.io for real-time appointment notifications
- Admin dashboard auto-refresh
- Customer booking confirmations

---

## Future API Enhancements

Potential additions:
1. **Pagination**: For large appointment lists
2. **Search**: Full-text search across appointments
3. **Bulk Operations**: Update/delete multiple appointments
4. **Analytics**: GET /api/analytics/stats endpoint
5. **Email Notifications**: Trigger emails on booking
6. **SMS Notifications**: Send SMS confirmations
7. **Calendar Integration**: Export to .ics format
8. **Webhooks**: For external integrations

---

## Data Models

### Appointment Model
```javascript
{
  _id: ObjectId,
  customerName: String (required, min 2 chars),
  customerEmail: String (required, valid email),
  customerPhone: String (required, valid phone),
  appointmentType: String (enum: ['inPerson', 'outcall']),
  address: {
    street: String (required if outcall),
    city: String (required if outcall),
    zipCode: String (required if outcall)
  },
  date: Date (required, must be future),
  timeSlot: String (required, format: HH:MM),
  price: Number (default: 15),
  status: String (enum: ['upcoming', 'completed', 'canceled'], default: 'upcoming'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Admin Model
```javascript
{
  _id: ObjectId,
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

For more information, see the main [README.md](README.md) or [DEPLOYMENT.md](DEPLOYMENT.md).
