# 📁 Project Structure

```
barbershop-booking/
├── server/                          # Backend (Express + MongoDB)
│   ├── models/                      # Database models
│   │   ├── Admin.js                 # Admin user schema
│   │   └── Appointment.js           # Appointment schema
│   ├── routes/                      # API routes
│   │   ├── auth.js                  # Authentication endpoints
│   │   └── appointments.js          # Appointment CRUD endpoints
│   ├── middleware/                  # Express middleware
│   │   └── auth.js                  # JWT authentication middleware
│   ├── server.js                    # Main server entry point
│   ├── package.json                 # Backend dependencies
│   ├── .env.example                 # Environment variables template
│   └── .gitignore                   # Git ignore rules
│
├── client/                          # Frontend (React + Vite)
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   └── ProtectedRoute.jsx   # Route protection component
│   │   ├── contexts/                # React contexts
│   │   │   └── AuthContext.jsx      # Authentication state management
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── BookAppointment.jsx  # Booking form
│   │   │   ├── AdminLogin.jsx       # Admin login page
│   │   │   └── AdminDashboard.jsx   # Admin dashboard
│   │   ├── services/                # API integration
│   │   │   └── api.js               # Axios configuration & API calls
│   │   ├── App.jsx                  # Main app component with routing
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles (Tailwind)
│   ├── index.html                   # HTML template
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── postcss.config.js            # PostCSS configuration
│   └── .env                         # Frontend environment variables
│
├── README.md                        # Project documentation
├── DEPLOYMENT.md                    # Deployment guide
└── STRUCTURE.md                     # This file
```

## Backend Architecture

### Models (`server/models/`)

**Admin.js**
- User authentication
- Stores hashed passwords
- Email-based login

**Appointment.js**
- Customer information (name, email, phone)
- Appointment details (date, time slot, type)
- Address for outcall services
- Status tracking (upcoming, completed, canceled)
- Price field (fixed at $15)

### Routes (`server/routes/`)

**auth.js**
- `POST /api/auth/register` - Create admin account
- `POST /api/auth/login` - Admin login (returns JWT)

**appointments.js**
- `GET /api/appointments/available-slots?date=YYYY-MM-DD` - Get available time slots
- `POST /api/appointments` - Create new appointment (public)
- `GET /api/appointments` - Get all appointments (protected)
- `PATCH /api/appointments/:id/status` - Update status (protected)
- `DELETE /api/appointments/:id` - Delete appointment (protected)

### Middleware (`server/middleware/`)

**auth.js**
- Validates JWT tokens
- Protects admin routes
- Extracts admin info from token

## Frontend Architecture

### Pages (`client/src/pages/`)

**Home.jsx**
- Landing page with barbershop branding
- Service description
- Business hours
- Call-to-action buttons

**BookAppointment.jsx**
- Multi-step booking form
- Personal information input
- Appointment type selection (in-person/outcall)
- Address input for outcall
- Date picker
- Real-time slot availability
- Form validation

**AdminLogin.jsx**
- Secure login form
- JWT token storage
- Redirect to dashboard

**AdminDashboard.jsx**
- Appointment list view
- Filter by date and status
- Status update functionality
- Delete appointments
- Customer contact information display
- Address viewing for outcall appointments

### Services (`client/src/services/`)

**api.js**
- Axios instance configuration
- JWT token injection
- API endpoint methods
- Error handling

### Contexts (`client/src/contexts/`)

**AuthContext.jsx**
- Global authentication state
- Login/logout functions
- Token persistence
- Admin information storage

## Data Flow

### Customer Booking Flow
```
User fills form → 
Frontend validation → 
API request (POST /api/appointments) → 
Backend validation → 
Check slot availability → 
Save to MongoDB → 
Return success/error → 
Show confirmation
```

### Admin Authentication Flow
```
Enter credentials → 
API request (POST /api/auth/login) → 
Verify credentials (bcrypt) → 
Generate JWT token → 
Return token + admin info → 
Store in localStorage → 
Redirect to dashboard
```

### Admin Dashboard Flow
```
Protected route check → 
Verify JWT token → 
Fetch appointments (GET /api/appointments) → 
Display in dashboard → 
Admin can filter/update/delete → 
Changes sync with MongoDB
```

## Key Design Decisions

### Security
- **Hashed Passwords**: Using bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Server-side Validation**: All inputs validated on backend
- **CORS Protection**: Configured for specific client URL
- **Protected Routes**: Admin endpoints require valid JWT

### User Experience
- **Real-time Availability**: Shows only available time slots
- **Responsive Design**: Mobile-first approach with Tailwind
- **Loading States**: Clear feedback during API calls
- **Error Handling**: User-friendly error messages
- **Smooth Animations**: CSS animations for better UX

### Database Design
- **Indexed Fields**: Date + timeSlot for quick lookups
- **Enum Constraints**: Validates appointment types and statuses
- **Conditional Required**: Address only required for outcalls
- **Timestamps**: Automatic createdAt tracking

### Code Organization
- **Separation of Concerns**: Clear MVC-like structure
- **Reusable Components**: DRY principles
- **Environment Variables**: Secrets never committed
- **Modular Routing**: Easy to extend with new routes

## Extending the Application

### Adding New Features

**Add Payment Processing**
1. Install Stripe SDK: `npm install stripe @stripe/stripe-js`
2. Create payment route in `server/routes/payments.js`
3. Add payment form in `BookAppointment.jsx`
4. Update Appointment model with payment status

**Add Email Notifications**
1. Install nodemailer: `npm install nodemailer`
2. Create email service in `server/services/email.js`
3. Send confirmation on appointment creation
4. Send reminder emails before appointments

**Add Multiple Barbers**
1. Create Barber model
2. Update Appointment model with barber reference
3. Add barber selection in booking form
4. Filter availability by barber

**Add Customer Accounts**
1. Create Customer model
2. Add customer authentication
3. Create customer dashboard
4. Show booking history

## Performance Considerations

- **Database Indexes**: Improve query performance
- **API Caching**: Consider Redis for frequently accessed data
- **Image Optimization**: Lazy load images on home page
- **Code Splitting**: React.lazy() for route-based splitting
- **Bundle Size**: Keep dependencies minimal

## Testing Strategy

**Backend Tests**
- Unit tests for models (validation)
- Integration tests for routes
- Authentication middleware tests

**Frontend Tests**
- Component unit tests (React Testing Library)
- Integration tests for user flows
- E2E tests (Playwright/Cypress)

## Deployment Architecture

```
User → Vercel (Frontend) → Render (Backend) → MongoDB Atlas
                   ↓
             JWT Verification
                   ↓
             Protected Routes
```

---

This structure provides a solid foundation for a production-ready booking system while remaining simple enough to understand and extend.
