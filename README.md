# Barbershop Booking Application

A production-ready full-stack web application for booking barbershop appointments with support for in-person and outcall (mobile) services.

## 🎯 Features

### Customer Features
- Browse barbershop services and pricing ($15 standard haircut)
- Book appointments with date/time selection
- Choose between in-person or outcall service
- Real-time availability checking
- Responsive mobile-first design

### Admin Features
- Secure JWT-based authentication
- View all appointments
- Filter by date and status
- Update appointment status (upcoming/completed/canceled)
- Delete appointments
- See customer details and addresses for outcall services

## 🚀 Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS with custom theme
- React Router DOM
- Axios for API calls

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT authentication
- bcrypt password hashing
- express-validator

## 📁 Project Structure

```
barbershop-booking/
├── server/
│   ├── config/database.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   ├── Admin.js
│   │   └── Appointment.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── appointments.js
│   ├── utils/seedAdmin.js
│   ├── server.js
│   └── package.json
│
└── client/
    ├── src/
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── BookAppointment.jsx
    │   │   ├── AdminLogin.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── services/api.js
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Environment Configuration

**server/.env:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/barbershop-booking
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_EMAIL=admin@barbershop.com
ADMIN_PASSWORD=changeme123
CLIENT_URL=http://localhost:5173
```

**client/.env:**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Database Setup

```bash
# Start MongoDB locally
mongod

# Seed admin user
cd server
npm run seed
```

### 4. Run Development

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Visit http://localhost:5173

## 📚 API Documentation

### Public Endpoints

**Create Appointment**
```
POST /api/appointments
Body: {
  customerName, customerEmail, customerPhone,
  appointmentType: "inPerson" | "outcall",
  date, timeSlot,
  address?: { street, city, zip }
}
```

**Get Available Slots**
```
GET /api/appointments/available-slots?date=YYYY-MM-DD
```

### Admin Endpoints (Protected)

**Login**
```
POST /api/auth/login
Body: { email, password }
```

**Get Appointments**
```
GET /api/appointments?date=YYYY-MM-DD&status=upcoming
```

**Update Status**
```
PUT /api/appointments/:id
Body: { status: "upcoming" | "completed" | "canceled" }
```

**Delete Appointment**
```
DELETE /api/appointments/:id
```

## 🚢 Deployment

### Backend (Render)

1. Create Web Service
2. Build Command: `cd server && npm install`
3. Start Command: `cd server && npm start`
4. Add environment variables
5. Deploy

### Frontend (Vercel)

```bash
cd client
vercel
```

Set environment variable:
- `VITE_API_URL=https://your-backend.onrender.com/api`

## 🔒 Security Features

✅ Implemented:
- Bcrypt password hashing (10 rounds)
- JWT token authentication
- Server-side validation
- CORS configuration
- Protected admin routes
- Double-booking prevention
- Input sanitization

⚠️ Production Checklist:
- [ ] Use strong JWT_SECRET (32+ chars)
- [ ] Enable HTTPS only
- [ ] Add rate limiting
- [ ] Implement CSRF tokens
- [ ] Add request logging
- [ ] Use MongoDB Atlas with IP whitelist
- [ ] Enable secure cookies
- [ ] Add email verification

## 💡 Future Enhancements

### Payment Integration
- Stripe/PayPal checkout
- Deposit for outcall bookings
- Refund handling

### Smart Pricing
- Distance-based outcall fees
- Google Maps integration
- Dynamic pricing by demand

### Notifications
- Email confirmations (SendGrid)
- SMS reminders (Twilio)
- Admin booking alerts

### Advanced Features
- Customer accounts & history
- Recurring appointments
- Multiple services (beard trim, shave)
- Multi-barber calendars
- Waiting list
- Reviews & ratings
- Gift cards

### Analytics
- Revenue dashboard
- Customer retention metrics
- Popular time analysis
- Service area heatmap

## 🎨 Design Philosophy

Classic barbershop aesthetic featuring:
- Animated barber pole stripes
- Traditional red/blue/white/gold palette
- Playfair Display serif headings
- Bold geometric shadows
- Mobile-first responsive layout

## 🧪 Testing

Manual test flow:
1. Book appointment as customer
2. Login as admin
3. Verify appointment in dashboard
4. Update status
5. Test filters
6. Delete appointment

## 🐛 Troubleshooting

**MongoDB connection failed:**
- Start MongoDB: `mongod`
- Check MONGODB_URI in .env

**CORS errors:**
- Verify CLIENT_URL in server .env
- Check Vite proxy in vite.config.js

**Auth not working:**
- Clear localStorage
- Verify JWT_SECRET consistency
- Check token expiration (30d default)

**Build fails:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📞 Admin Credentials

Default (change immediately):
- Email: admin@barbershop.com
- Password: changeme123

## 📄 License

MIT

---

Built with ❤️ for barbershops everywhere
