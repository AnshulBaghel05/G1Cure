# G1Cure Deployment Guide

Complete guide for deploying the G1Cure Healthcare SaaS platform.

## 📋 Prerequisites

### Required Accounts
1. **Supabase** - Database & Auth: https://supabase.com
2. **Vercel/Netlify** - Frontend hosting (optional)
3. **Encore.dev** - Backend hosting (recommended)

### Optional Services (for full features)
4. **Stripe** - Payment processing: https://stripe.com
5. **Twilio** - SMS/Email notifications: https://twilio.com
6. **Agora** - Video conferencing: https://agora.io
7. **Google Cloud** - Gemini AI: https://makersuite.google.com
8. **AWS** - S3 file storage (optional)
9. **Firebase** - Push notifications (optional)

### Development Tools
- **Node.js** 18+ or **Bun** (recommended)
- **Git**
- **PostgreSQL client** (for local development)

---

## 🚀 Quick Start (5 Minutes)

### 1. Clone Repository
```bash
git clone https://github.com/AnshulBaghel05/G1Cure.git
cd G1Cure
```

### 2. Setup Supabase

#### Create Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in project details
4. Wait for database to provision (~2 minutes)

#### Get Credentials
1. Go to **Settings** → **API**
2. Copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

#### Apply Database Migrations
1. Go to **SQL Editor** in Supabase dashboard
2. Copy content from `backend/supabase/migrations/001_initial_schema.sql`
3. Paste and run
4. Repeat for migrations 002-005 **in order**

Or use the automated script:
```bash
cd backend/supabase
chmod +x apply-migrations.sh
./apply-migrations.sh
```

### 3. Configure Environment Variables

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```bash
# Required
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# AI Features (optional)
GEMINI_API_KEY=your_gemini_api_key_here

# Payments (optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Notifications (optional)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# Video (optional)
AGORA_APP_ID=...
AGORA_APP_CERTIFICATE=...

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

#### Frontend (.env.local)
```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_CLIENT_TARGET=http://localhost:4000
```

### 4. Install Dependencies

```bash
# Install Bun (recommended)
curl -fsSL https://bun.sh/install | bash

# Backend
cd backend
bun install

# Frontend
cd ../frontend
bun install
```

Or with npm:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 5. Run Development Servers

#### Terminal 1 - Backend
```bash
cd backend
bun run dev
# or: encore run
```

Backend will run on: http://localhost:4000

#### Terminal 2 - Frontend
```bash
cd frontend
bun run dev
```

Frontend will run on: http://localhost:3000

### 6. Access Application

Open: http://localhost:3000

**Test Accounts** (after running migrations):
- Admin: Create via Supabase Auth dashboard
- Doctor: Sign up with role selection
- Patient: Sign up with role selection

---

## 🌐 Production Deployment

### Option A: Encore.dev (Recommended for Backend)

#### 1. Install Encore CLI
```bash
npm install -g encore
```

#### 2. Login
```bash
encore auth login
```

#### 3. Create App
```bash
cd backend
encore app create
```

#### 4. Set Secrets
```bash
encore secret set SupabaseUrl
encore secret set SupabaseAnonKey
encore secret set SupabaseServiceKey
encore secret set GeminiApiKey
# etc for other secrets
```

#### 5. Deploy
```bash
git push encore main
```

Your API will be live at: `https://your-app.encr.app`

### Option B: Vercel/Netlify (Frontend)

#### Vercel Deployment

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel
```

3. **Set Environment Variables** (in Vercel dashboard)
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_CLIENT_TARGET (your backend URL)

4. **Production Deploy**
```bash
vercel --prod
```

#### Netlify Deployment

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login**
```bash
netlify login
```

3. **Initialize**
```bash
cd frontend
netlify init
```

4. **Configure Build**
   - Build command: `bun run build`
   - Publish directory: `dist`

5. **Set Environment Variables**
```bash
netlify env:set VITE_SUPABASE_URL "https://..."
netlify env:set VITE_SUPABASE_ANON_KEY "..."
netlify env:set VITE_CLIENT_TARGET "https://..."
```

6. **Deploy**
```bash
netlify deploy --prod
```

### Option C: Docker Deployment

#### 1. Build Images
```bash
# Backend
cd backend
docker build -t g1cure-backend .

# Frontend
cd frontend
docker build -t g1cure-frontend .
```

#### 2. Run with Docker Compose
```bash
docker-compose up -d
```

---

## 🔧 Configuration

### Supabase Row Level Security (RLS)

The migrations automatically set up RLS policies. Verify they're enabled:

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

All tables should have `rowsecurity = true`.

### Email Verification

1. Go to Supabase → **Authentication** → **Email Templates**
2. Customize confirmation email template
3. Set redirect URL: `https://yourdomain.com/verify-email`

### Stripe Webhooks

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Add endpoint: `https://your-api.com/stripe/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.failed`
   - `checkout.session.completed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### Twilio Configuration

1. Get phone number from Twilio
2. Configure messaging service
3. Add callback URLs for delivery status

### Agora Configuration

1. Create project in Agora console
2. Enable RTM and Video SDK
3. Copy App ID and Certificate
4. Add to environment variables

---

## 🧪 Testing

### Run Tests
```bash
# Backend
cd backend
bun test

# Frontend
cd frontend
bun test
```

### Test Database Connection
```bash
cd backend
bun run test:db
```

### Test API Endpoints
```bash
curl http://localhost:4000/health
```

---

## 📊 Monitoring

### Supabase Dashboard
- Database: https://supabase.com/dashboard/project/_/editor
- Auth: https://supabase.com/dashboard/project/_/auth/users
- Logs: https://supabase.com/dashboard/project/_/logs/explorer

### Encore Dashboard
- Metrics: https://app.encore.dev
- Traces: View API call traces
- Logs: Centralized logging

### Error Tracking

Add Sentry (optional):
```bash
npm install @sentry/react @sentry/node
```

---

## 🔒 Security Checklist

- [ ] All environment variables set via secrets (not committed)
- [ ] Supabase RLS policies enabled on all tables
- [ ] API rate limiting configured
- [ ] CORS properly configured
- [ ] HTTPS enabled in production
- [ ] Database backups enabled
- [ ] Service role key never exposed to frontend
- [ ] Regular security updates

---

## 🐛 Troubleshooting

### Issue: Database connection failed
**Solution**: Check Supabase credentials in .env

### Issue: API endpoints return 404
**Solution**: Ensure backend is running on port 4000

### Issue: CORS errors
**Solution**: Update `CORS_ORIGIN` in backend/.env

### Issue: Migrations fail
**Solution**: Run migrations in order, check for syntax errors

### Issue: Frontend build fails
**Solution**:
```bash
rm -rf node_modules bun.lockb
bun install
bun run build
```

### Issue: Service Worker errors
**Solution**: Clear browser cache and re-register

---

## 📱 PWA Setup

The app is configured as a PWA. To install:

1. Visit site in Chrome/Edge
2. Click install icon in address bar
3. App will install as standalone application

Disable PWA for development:
```javascript
// frontend/main.tsx
// Comment out service worker registration
```

---

## 🔄 Updates & Maintenance

### Update Dependencies
```bash
bun update
```

### Database Migrations
New migrations go in `backend/supabase/migrations/`
Name format: `XXX_description.sql`

### Backup Database
```bash
# Via Supabase dashboard
Settings → Database → Backups

# Or manual backup
pg_dump "postgresql://..." > backup.sql
```

---

## 📞 Support

- **Issues**: https://github.com/AnshulBaghel05/G1Cure/issues
- **Docs**: See README.md
- **Email**: support@g1cure.com

---

## 🎯 Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Test user accounts created
- [ ] Email verification working
- [ ] Payment processing tested
- [ ] Video calls functional
- [ ] Notifications sending
- [ ] Analytics tracking
- [ ] Mobile PWA tested
- [ ] Performance optimized
- [ ] Security audit completed
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Documentation updated

---

## 📈 Scaling Considerations

### Database
- Enable connection pooling
- Add read replicas for high traffic
- Optimize queries with indexes

### Backend
- Use Encore's auto-scaling
- Enable caching with Redis
- Implement CDN for static assets

### Frontend
- Enable CDN caching
- Optimize bundle size
- Lazy load routes

### Monitoring
- Set up alerts for errors
- Track performance metrics
- Monitor database connections

---

**Last Updated**: November 2025
**Version**: 1.0.0
