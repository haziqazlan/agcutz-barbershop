# Quick Start Guide

## Local Development Setup (5 minutes)

### 1. Install Dependencies

```bash
# From project root
cd server && npm install
cd ../client && npm install
cd ..
```

### 2. Setup Environment Variables

**Server (.env)**
```bash
cd server
cp .env.example .env
# Edit .env and update:
# - MONGODB_URI (if using MongoDB Atlas)
# - JWT_SECRET (generate a random string)
```

**Client (.env)**
```bash
cd client
cp .env.example .env
# Default values should work for local development
```

### 3. Start MongoDB

**If using local MongoDB:**
```bash
# Make sure MongoDB is running
mongod
```

**If using MongoDB Atlas:**
- Sign up at mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string
- Update MONGODB_URI in server/.env

### 4. Create Admin Account

```bash
# Start the server first
cd server
npm run dev

# In a new terminal, create admin
curl -X POST http://localhost:5000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@barbershop.com","password":"admin123"}'

# You should see a success message with a token
```

### 5. Start Both Servers

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

### 6. Access the Application

- **Landing Page**: http://localhost:5173
- **Book Appointment**: http://localhost:5173/book
- **Admin Login**: http://localhost:5173/admin/login
  - Email: admin@barbershop.com
  - Password: admin123

## Testing the Application

### Test Customer Booking Flow

1. Go to http://localhost:5173
2. Click "Book Your Appointment"
3. Fill in the form:
   - Name: John Doe
   - Email: john@example.com
   - Phone: (555) 123-4567
   - Type: In-Person or Outcall
   - Date: Tomorrow
   - Time: Any available slot
4. Submit and verify success message

### Test Admin Dashboard

1. Go to http://localhost:5173/admin/login
2. Login with admin credentials
3. View the appointment you just created
4. Try updating status to "Completed"
5. Test filtering by date
6. Test deleting an appointment

## Common Issues

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### MongoDB Connection Failed
- Check if MongoDB is running: `mongosh`
- Verify MONGODB_URI in server/.env
- For Atlas, check IP whitelist settings

### Cannot Create Admin
- Make sure server is running first
- Check if admin already exists (setup endpoint only works once)
- Use MongoDB directly to create admin if needed

### Frontend Can't Connect to Backend
- Verify backend is running on port 5000
- Check VITE_API_URL in client/.env
- Clear browser cache and reload

## Next Steps

1. **Customize Branding**: Edit barbershop name and colors in LandingPage.jsx
2. **Modify Business Hours**: Update time slots in appointmentController.js
3. **Add More Services**: Extend the Appointment model and booking form
4. **Deploy**: Follow deployment guide in main README.md

## Production Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Update MONGODB_URI to production database
- [ ] Set NODE_ENV=production
- [ ] Disable /api/auth/setup endpoint (or add protection)
- [ ] Configure CORS with production frontend URL
- [ ] Set up SSL/HTTPS
- [ ] Enable rate limiting
- [ ] Add monitoring and logging
- [ ] Test all features thoroughly

## Development Commands

```bash
# Server commands
cd server
npm run dev        # Start with auto-reload
npm start          # Production start

# Client commands
cd client
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Project Structure Overview

```
server/
  src/
    controllers/    → Business logic
    models/        → Database schemas
    routes/        → API endpoints
    middleware/    → Auth, error handling
    config/        → Database connection
    utils/         → Helper functions

client/
  src/
    pages/         → Main page components
    components/    → Reusable UI components
    services/      → API calls
    contexts/      → React state management
```

---

**Need help?** Check the main README.md for detailed documentation.
