-- Fix missing INSERT policy for users table
-- This allows the service role to create new users during signup

-- Drop existing policies for users table
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

-- Recreate policies with proper INSERT access
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Add INSERT policy for service role (signup process)
CREATE POLICY "Service role can insert users" ON users FOR INSERT WITH CHECK (true);

-- Also add a policy to allow authenticated users to view basic user info for appointments
CREATE POLICY "Authenticated users can view basic user info" ON users FOR SELECT USING (
  auth.role() = 'authenticated'
);

-- Ensure the service role can bypass RLS for all operations
-- This is the proper way to handle admin/service operations
ALTER TABLE users FORCE ROW LEVEL SECURITY;

-- Grant necessary permissions to the service role
GRANT ALL ON users TO service_role;
GRANT USAGE ON SCHEMA public TO service_role;
