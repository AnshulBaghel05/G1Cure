# Supabase Integration Setup Guide

This guide will help you set up Supabase as the database for your G1Cure application.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A new Supabase project created

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in.
2. Click "New Project".
3. Choose your organization.
4. Enter project details:
   - Name: `g1cure-healthcare`
   - Database Password: (generate a strong password and save it)
   - Region: Choose the one closest to your users.
5. Click "Create new project".

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings > API**.
2. You will find your Project URL and two Project API keys.
3. Copy the following values:
   - **Project URL**
   - **Project API keys** (`anon` / public key)
   - **Project API keys** (`service_role` / secret key)

## Step 3: Configure Secrets in Leap Infrastructure

1. Go to your Leap project's **Infrastructure** tab.
2. Add the following secrets with the values you copied from Supabase:
   - `SupabaseUrl`: Your project URL
   - `SupabaseAnonKey`: Your `anon` / public key
   - `SupabaseServiceKey`: Your `service_role` / secret key

## Step 4: CRITICAL - Run Database Migrations

**This is the most important step. Your application will not work without it.** This step creates all the necessary tables (`users`, `doctors`, `patients`, `appointments`, `billing`, etc.) that the application needs to store data.

1. In your Supabase project dashboard, go to the **SQL Editor**.
2. Click on **"+ New query"**.
3. Open the file `backend/supabase/migrations/001_initial_schema.sql` in your Leap project.
4. **Copy the entire content** of this file.
5. **Paste the copied SQL code** into the Supabase SQL Editor.
6. Click the **"RUN"** button.

You should see a "Success. No rows returned" message. You can verify that the tables were created by going to the **Table Editor**.

## Step 5: Disable Email Confirmation (for Testing)

For easier testing, you can disable the email confirmation requirement for new signups.

1. In your Supabase dashboard, go to **Authentication > Providers**.
2. Under the **Email** provider, toggle off **"Confirm email"**.

## You're All Set!

Your application is now fully configured to use Supabase as its database. You can start signing up users and testing the application.

### Troubleshooting

- **"relation 'public.users' does not exist" or similar errors**: This means you have not run the SQL migration script from Step 4. Please go back and run it.
- **Login/Signup issues**: Double-check that your Supabase URL and keys are correctly entered in the Leap Infrastructure secrets.
- **RLS Errors**: The provided schema includes Row Level Security (RLS) policies. If you encounter permission issues, review these policies in **Authentication > Policies** in your Supabase dashboard.
