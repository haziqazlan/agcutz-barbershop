# 📚 API Documentation

Base URL: `http://localhost:5000/api` (development)

## Authentication

Admin routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 🔓 Public Endpoints

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

#### Create Appointment
```http
POST /appointments
```

**Request Body:**
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "(555) 123-4567",
  "appointmentType": "inPerson",
  "date": "2024-12-25",
  "timeSlot": "10:00 AM"
}
```

**For Outcall Appointments:**
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "(555) 123-4567",
  "appointmentType": "outcall",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  },
  "date": "2024-12-25",
  "timeSlot": "10:00 AM"
}
```

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "(555) 123-4567",
  "appointmentType": "inPerson",
  "date": "2024-12-25T00:00:00.000Z",
  "timeSlot": "10:00 AM",
  "price": 15,
  "status": "upcoming",
  "createdAt": "2024-12-20T10:30:00.000Z"
}
```

**Error Responses:**
- `400` - Missing required fields
- `400` - Invalid appointment type
- `400` - Invalid time slot
- `400` - Address required for outcall
- `400` - Time slot already booked

---

#### Get Available Slots
```http
GET /appointments/available-slots/:date
```

**Parameters:**
- `date` - Date in YYYY-MM-DD format

**Example:**
```http
GET /appointments/available-slots/2024-12-25
```

**Response:** `200 OK`
```json
{
  "availableSlots": [
    "09:00 AM",
    "11:00 AM",
    "02:00 PM",
    "04:00 PM"
  ],
  "bookedSlots": [
    "10:00 AM",
    "12:00 PM",
    "01:00 PM",
    "03:00 PM",
    "05:00 PM"
  ]
}
```

---

### 🔐 Admin Endpoints

#### Admin Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "admin@barbershop.com",
  "password": "changeme123"
}
```

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "admin@barbershop.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials

---

#### Get Admin Profile
```http
GET /auth/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "admin@barbershop.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `401` - Not authorized, no token
- `401` - Not authorized, token failed

---

#### Get All Appointments
```http
GET /appointments
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `date` (optional) - Filter by date (YYYY-MM-DD)
- `status` (optional) - Filter by status (upcoming, completed, canceled)

**Examples:**
```http
GET /appointments
GET /appointments?date=2024-12-25
GET /appointments?status=upcoming
GET /appointments?date=2024-12-25&status=upcoming
```

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "(555) 123-4567",
    "appointmentType": "outcall",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "zip": "10001"
    },
    "date": "2024-12-25T00:00:00.000Z",
    "timeSlot": "10:00 AM",
    "price": 15,
    "status": "upcoming",
    "createdAt": "2024-12-20T10:30:00.000Z"
  }
]
```

---

#### Update Appointment Status
```http
PUT /appointments/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id` - Appointment ID

**Request Body:**
```json
{
  "status": "completed"
}
```

**Valid Status Values:**
- `upcoming`
- `completed`
- `canceled`

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "customerName": "John Doe",
  "status": "completed",
  ...
}
```

**Error Responses:**
- `400` - Invalid status
- `404` - Appointment not found

---

#### Delete Appointment
```http
DELETE /appointments/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id` - Appointment ID

**Response:** `200 OK`
```json
{
  "message": "Appointment deleted successfully"
}
```

**Error Responses:**
- `404` - Appointment not found

---

## Data Models

### Appointment

```javascript
{
  customerName: String,        // required
  customerEmail: String,       // required
  customerPhone: String,       // required
  appointmentType: String,     // required, enum: ['inPerson', 'outcall']
  address: {                   // required only for outcall
    street: String,
    city: String,
    zip: String
  },
  date: Date,                  // required
  timeSlot: String,            // required
  price: Number,               // default: 15
  status: String,              // enum: ['upcoming', 'completed', 'canceled']
  createdAt: Date
}
```

### Admin

```javascript
{
  email: String,               // required, unique
  password: String,            // required (hashed)
  createdAt: Date
}
```

---

## Available Time Slots

The system supports these time slots:
- 09:00 AM
- 10:00 AM
- 11:00 AM
- 12:00 PM
- 01:00 PM
- 02:00 PM
- 03:00 PM
- 04:00 PM
- 05:00 PM

---

## Error Response Format

All errors follow this format:

```json
{
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

---

## Testing with cURL

### Create Appointment
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "(555) 123-4567",
    "appointmentType": "inPerson",
    "date": "2024-12-25",
    "timeSlot": "10:00 AM"
  }'
```

### Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@barbershop.com",
    "password": "changeme123"
  }'
```

### Get Appointments (with token)
```bash
curl -X GET http://localhost:5000/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Rate Limiting

Currently no rate limiting is implemented. Recommended for production:
- Public endpoints: 100 requests per 15 minutes
- Admin endpoints: 1000 requests per 15 minutes

---

## Webhooks (Future Enhancement)

Future versions may include webhooks for:
- Appointment created
- Appointment updated
- Appointment canceled

Stay tuned for updates!
