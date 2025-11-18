-- Migration: Chatbot and Department Management Enhancements
-- Created: 2025-01-18
-- Description: Adds chat_messages table for AI chatbot and enhances departments table

-- ========================================
-- Chat Messages Table for AI Chatbot
-- ========================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  intent TEXT,
  context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for chat_messages
CREATE INDEX idx_chat_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at DESC);

-- RLS policies for chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can only access their own chat messages
CREATE POLICY chat_messages_select_own ON chat_messages
  FOR SELECT
  USING (auth.uid()::text = user_id OR auth.uid() IS NULL);

CREATE POLICY chat_messages_insert_own ON chat_messages
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR auth.uid() IS NULL);

CREATE POLICY chat_messages_delete_own ON chat_messages
  FOR DELETE
  USING (auth.uid()::text = user_id);

-- ========================================
-- Department Table Enhancements
-- ========================================
-- Add new columns to departments table if they don't exist
ALTER TABLE departments
  ADD COLUMN IF NOT EXISTS manager TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS budget DECIMAL(15, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_staff_capacity INTEGER DEFAULT 100;

-- Add comment to clarify budget field
COMMENT ON COLUMN departments.budget IS 'Annual budget in currency (default: 0)';
COMMENT ON COLUMN departments.max_staff_capacity IS 'Maximum number of staff members (default: 100)';

-- Validate email format for contact_email
ALTER TABLE departments
  ADD CONSTRAINT departments_email_format
  CHECK (contact_email IS NULL OR contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Validate budget is non-negative
ALTER TABLE departments
  ADD CONSTRAINT departments_budget_positive
  CHECK (budget IS NULL OR budget >= 0);

-- Validate max_staff_capacity is positive
ALTER TABLE departments
  ADD CONSTRAINT departments_capacity_positive
  CHECK (max_staff_capacity IS NULL OR max_staff_capacity >= 1);

-- Create index for faster department searches
CREATE INDEX IF NOT EXISTS idx_departments_active ON departments(is_active);
CREATE INDEX IF NOT EXISTS idx_departments_name ON departments(name);

-- ========================================
-- Medical Queries Table for AI Medical Assistant
-- ========================================
-- This table already exists but we'll ensure it's properly set up
CREATE TABLE IF NOT EXISTS medical_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  user_role TEXT CHECK (user_role IN ('patient', 'doctor', 'admin', 'sub-admin')),
  query TEXT NOT NULL,
  symptoms TEXT[] DEFAULT ARRAY[]::TEXT[],
  medical_history TEXT,
  current_medications TEXT[] DEFAULT ARRAY[]::TEXT[],
  response TEXT NOT NULL,
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
  category TEXT CHECK (category IN ('diagnosis', 'medication', 'general', 'emergency')),
  is_emergency BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for medical_queries
CREATE INDEX IF NOT EXISTS idx_medical_queries_user ON medical_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_queries_emergency ON medical_queries(is_emergency) WHERE is_emergency = TRUE;
CREATE INDEX IF NOT EXISTS idx_medical_queries_created ON medical_queries(created_at DESC);

-- RLS policies for medical_queries
ALTER TABLE medical_queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY medical_queries_select_own ON medical_queries
  FOR SELECT
  USING (auth.uid()::text = user_id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid()::text AND role IN ('admin', 'doctor')
  ));

CREATE POLICY medical_queries_insert_own ON medical_queries
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- ========================================
-- Triggers for updated_at
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to chat_messages
DROP TRIGGER IF EXISTS update_chat_messages_updated_at ON chat_messages;
CREATE TRIGGER update_chat_messages_updated_at
  BEFORE UPDATE ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to medical_queries
DROP TRIGGER IF EXISTS update_medical_queries_updated_at ON medical_queries;
CREATE TRIGGER update_medical_queries_updated_at
  BEFORE UPDATE ON medical_queries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to departments
DROP TRIGGER IF EXISTS update_departments_updated_at ON departments;
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON departments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Comments for Documentation
-- ========================================
COMMENT ON TABLE chat_messages IS 'Stores conversation history for the AI chatbot';
COMMENT ON TABLE medical_queries IS 'Stores medical queries processed by AI medical assistant';
COMMENT ON COLUMN chat_messages.conversation_id IS 'Groups messages into conversations';
COMMENT ON COLUMN chat_messages.intent IS 'Detected user intent (greeting, features, pricing, etc.)';
COMMENT ON COLUMN chat_messages.context IS 'Additional context like user role, previous messages';
COMMENT ON COLUMN medical_queries.confidence IS 'AI confidence score (0-100)';
COMMENT ON COLUMN medical_queries.is_emergency IS 'Whether the query indicates a medical emergency';
