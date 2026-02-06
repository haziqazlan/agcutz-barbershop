# Deployment Guide

Complete guide for deploying the Barbershop Booking Application to production.

## Quick Deploy (Recommended)

### Backend → Render
1. Create account at render.com
2. New Web Service → Connect repo
3. Settings:
   - Root: `server`
   - Build: `npm install`
   - Start: `npm start`
4. Add environment variables (see below)
5. Deploy

### Frontend → Vercel
```bash
cd client
npm install -g vercel
vercel
```

Add environment variable:
- `VITE_API_URL=https://your-backend.onrender.com/api`

## Environment Variables

### Backend (Render)
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/barbershop
JWT_SECRET=<generate-32-char-random-string>
ADMIN_EMAIL=admin@barbershop.com
ADMIN_PASSWORD=<secure-password>
CLIENT_URL=https://your-app.vercel.app
```

Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

## MongoDB Atlas Setup

1. Create free cluster at mongodb.com/atlas
2. Database Access → Add User
3. Network Access → Add IP: `0.0.0.0/0`
4. Get connection string
5. Add to MONGODB_URI

## Post-Deployment

1. Seed admin account:
   - Render Dashboard → Shell
   - Run: `npm run seed`

2. Test the app:
   - Book appointment
   - Login as admin
   - Verify dashboard works

## Production Checklist

Security:
- [ ] Strong JWT_SECRET (32+ chars)
- [ ] Secure admin password
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] MongoDB IP whitelist

Performance:
- [ ] Test all features
- [ ] Check mobile responsiveness
- [ ] Verify API response times

Monitoring:
- [ ] Set up error logging
- [ ] Enable Render alerts
- [ ] Test backup/restore

## Custom Domain

### Vercel
Settings → Domains → Add domain → Configure DNS

### Render
Settings → Custom Domain → Add → Update DNS

## Updating

Push to GitHub main branch for auto-deploy on both platforms.

## Cost

Free tier works for development. Production:
- Render: $7/mo
- MongoDB: $9/mo (shared)
- Vercel: Free
- Total: ~$16/mo

## Support

- Render: render.com/docs
- Vercel: vercel.com/docs
- MongoDB: docs.atlas.mongodb.com
