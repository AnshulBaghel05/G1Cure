# Database Migration Guide

## Overview
This directory contains SQL migration files for setting up the G1Cure database schema in Supabase.

## Migration Files (In Order)

1. **001_initial_schema.sql** - Core tables (users, doctors, patients, appointments, billing, prescriptions, telemedicine_sessions, lab_reports)
2. **002_sub_admin_reviews.sql** - Sub-admin roles & review system tables
3. **003_advanced_features.sql** - Additional advanced feature tables
4. **004_custom_webrtc_fixed.sql** - WebRTC session tracking (use this, not the non-fixed version)
5. **005_fix_users_insert_policy.sql** - RLS policy updates

## How to Apply Migrations

### Method 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Copy and paste each migration file content **in order**
4. Execute each migration one at a time
5. Verify no errors in the output

### Method 2: Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply migrations (from backend directory)
cd backend
supabase db push
```

### Method 3: Direct SQL Execution

If you have direct Postgres access:

```bash
# From the backend/supabase/migrations directory
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" -f 001_initial_schema.sql
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" -f 002_sub_admin_reviews.sql
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" -f 003_advanced_features.sql
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" -f 004_custom_webrtc_fixed.sql
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" -f 005_fix_users_insert_policy.sql
```

## Verification

After applying migrations, verify tables exist:

```sql
-- Run this query in SQL Editor
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected tables:
- users
- doctors
- patients
- appointments
- billing
- prescriptions
- telemedicine_sessions
- lab_reports
- reviews
- sub_admins
- departments
- (and more from advanced features)

## Rollback

If you need to rollback, you can drop tables:

```sql
-- WARNING: This deletes all data!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

Then re-apply migrations from the beginning.

## Notes

- **DO NOT** run 004_custom_webrtc.sql - use 004_custom_webrtc_fixed.sql instead
- All migrations include Row Level Security (RLS) policies
- Make sure your Supabase service role key is set in backend/.env
- Migrations are idempotent where possible (CREATE IF NOT EXISTS)

## Troubleshooting

### Issue: "relation already exists"
- This means the table was already created
- Safe to ignore if re-running migrations
- Or drop the specific table and re-run

### Issue: "permission denied"
- Make sure you're using the service role key, not anon key
- Check that RLS is properly configured

### Issue: Foreign key violations
- Make sure migrations are run in order
- Parent tables must exist before child tables

## Environment Setup

Ensure your backend/.env has:
```
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_ANON_KEY=your_anon_key_here
```

Get these from: https://supabase.com/dashboard/project/_/settings/api
