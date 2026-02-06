# Quick Start Guide

Get the Barbershop Booking app running in 5 minutes!

## Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

## Setup

### 1. Install Dependencies
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure Environment

**server/.env:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/barbershop-booking
JWT_SECRET=my-secret-key-123
ADMIN_EMAIL=admin@barbershop.com
ADMIN_PASSWORD=admin123
CLIENT_URL=http://localhost:5173
```

**client/.env:**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Admin
```bash
cd server
npm run seed
```

### 4. Run Servers

Terminal 1:
```bash
cd server
npm run dev
```

Terminal 2:
```bash
cd client
npm run dev
```

### 5. Access App

- Frontend: http://localhost:5173
- Admin: http://localhost:5173/admin/login
  - Email: admin@barbershop.com
  - Password: admin123

## Test Flow

1. Book appointment as customer
2. Login as admin
3. View appointment in dashboard
4. Update status
5. Test filters and delete

Done! Check README.md for full docs.
