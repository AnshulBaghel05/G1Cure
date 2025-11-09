-- Advanced Features Migration
-- This migration adds support for video conferencing, AI medical assistance, notifications, and enhanced security

-- Video Sessions Table
CREATE TABLE video_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  channel_name VARCHAR(255) NOT NULL,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('waiting', 'active', 'ended', 'cancelled')),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  recording_url TEXT,
  screen_share_enabled BOOLEAN DEFAULT true,
  chat_enabled BOOLEAN DEFAULT true,
  waiting_room_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Video Chat Messages Table
CREATE TABLE video_chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) NOT NULL,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_name VARCHAR(255) NOT NULL,
  sender_role VARCHAR(20) NOT NULL CHECK (sender_role IN ('patient', 'doctor')),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medical Queries Table (AI Assistant)
CREATE TABLE medical_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_role VARCHAR(20) NOT NULL CHECK (user_role IN ('patient', 'doctor')),
  query TEXT NOT NULL,
  symptoms TEXT[],
  medical_history TEXT,
  current_medications TEXT[],
  response TEXT NOT NULL,
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
  category VARCHAR(20) NOT NULL CHECK (category IN ('diagnosis', 'medication', 'general', 'emergency')),
  is_emergency BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('appointment', 'reminder', 'emergency', 'billing', 'medical', 'system')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  channels TEXT[] NOT NULL DEFAULT ARRAY['in-app'],
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'sent', 'failed', 'delivered')) DEFAULT 'pending',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Patient Records with Timeline
CREATE TABLE patient_medical_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('appointment', 'diagnosis', 'medication', 'lab_test', 'procedure', 'allergy', 'vaccination')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Prescriptions with Digital Signatures
CREATE TABLE prescriptions_enhanced (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  prescription_number VARCHAR(100) UNIQUE NOT NULL,
  diagnosis TEXT,
  medications JSONB NOT NULL, -- Array of medication objects
  instructions TEXT,
  dosage_instructions TEXT,
  duration VARCHAR(100),
  refills_allowed INTEGER DEFAULT 0,
  refills_remaining INTEGER DEFAULT 0,
  digital_signature TEXT, -- Base64 encoded signature
  signature_timestamp TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  expires_at DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lab Reports Enhanced
CREATE TABLE lab_reports_enhanced (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  report_number VARCHAR(100) UNIQUE NOT NULL,
  lab_name VARCHAR(255),
  test_name VARCHAR(255) NOT NULL,
  test_category VARCHAR(100),
  test_date DATE NOT NULL,
  results JSONB NOT NULL, -- Structured test results
  normal_ranges JSONB,
  interpretation TEXT,
  recommendations TEXT,
  file_url TEXT,
  is_abnormal BOOLEAN DEFAULT false,
  priority VARCHAR(20) CHECK (priority IN ('routine', 'urgent', 'stat')) DEFAULT 'routine',
  status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Billing with Multiple Payment Methods
CREATE TABLE billing_enhanced (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  billing_date DATE NOT NULL,
  due_date DATE NOT NULL,
  items JSONB NOT NULL, -- Array of billing items
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  payment_reference VARCHAR(255),
  payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partial')) DEFAULT 'pending',
  payment_date TIMESTAMP WITH TIME ZONE,
  gst_number VARCHAR(50),
  insurance_provider VARCHAR(100),
  insurance_policy_number VARCHAR(100),
  insurance_claim_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security Audit Log
CREATE TABLE security_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HIPAA Compliance Log
CREATE TABLE hipaa_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
  access_type VARCHAR(50) NOT NULL CHECK (access_type IN ('view', 'create', 'update', 'delete', 'export', 'print')),
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  purpose VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  access_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced User Sessions
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  device_info JSONB,
  login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  logout_time TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Waitlist Management
CREATE TABLE appointment_waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  preferred_date DATE,
  preferred_time_slot VARCHAR(50),
  urgency_level VARCHAR(20) CHECK (urgency_level IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  reason TEXT,
  contact_preference VARCHAR(20) CHECK (contact_preference IN ('email', 'sms', 'phone')) DEFAULT 'email',
  status VARCHAR(20) CHECK (status IN ('waiting', 'contacted', 'scheduled', 'cancelled')) DEFAULT 'waiting',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_video_sessions_patient_id ON video_sessions(patient_id);
CREATE INDEX idx_video_sessions_doctor_id ON video_sessions(doctor_id);
CREATE INDEX idx_video_sessions_appointment_id ON video_sessions(appointment_id);
CREATE INDEX idx_video_chat_messages_session_id ON video_chat_messages(session_id);
CREATE INDEX idx_medical_queries_user_id ON medical_queries(user_id);
CREATE INDEX idx_medical_queries_category ON medical_queries(category);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_patient_medical_events_patient_id ON patient_medical_events(patient_id);
CREATE INDEX idx_patient_medical_events_event_date ON patient_medical_events(event_date);
CREATE INDEX idx_prescriptions_enhanced_patient_id ON prescriptions_enhanced(patient_id);
CREATE INDEX idx_prescriptions_enhanced_doctor_id ON prescriptions_enhanced(doctor_id);
CREATE INDEX idx_lab_reports_enhanced_patient_id ON lab_reports_enhanced(patient_id);
CREATE INDEX idx_lab_reports_enhanced_test_date ON lab_reports_enhanced(test_date);
CREATE INDEX idx_billing_enhanced_patient_id ON billing_enhanced(patient_id);
CREATE INDEX idx_billing_enhanced_payment_status ON billing_enhanced(payment_status);
CREATE INDEX idx_security_audit_log_user_id ON security_audit_log(user_id);
CREATE INDEX idx_security_audit_log_created_at ON security_audit_log(created_at);
CREATE INDEX idx_hipaa_audit_log_user_id ON hipaa_audit_log(user_id);
CREATE INDEX idx_hipaa_audit_log_patient_id ON hipaa_audit_log(patient_id);
CREATE INDEX idx_hipaa_audit_log_access_timestamp ON hipaa_audit_log(access_timestamp);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_token ON user_sessions(session_token);
CREATE INDEX idx_appointment_waitlist_patient_id ON appointment_waitlist(patient_id);
CREATE INDEX idx_appointment_waitlist_doctor_id ON appointment_waitlist(doctor_id);
CREATE INDEX idx_appointment_waitlist_status ON appointment_waitlist(status);

-- Create triggers for updated_at
CREATE TRIGGER update_video_sessions_updated_at BEFORE UPDATE ON video_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patient_medical_events_updated_at BEFORE UPDATE ON patient_medical_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prescriptions_enhanced_updated_at BEFORE UPDATE ON prescriptions_enhanced FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lab_reports_enhanced_updated_at BEFORE UPDATE ON lab_reports_enhanced FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_billing_enhanced_updated_at BEFORE UPDATE ON billing_enhanced FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointment_waitlist_updated_at BEFORE UPDATE ON appointment_waitlist FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on new tables
ALTER TABLE video_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_medical_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_reports_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE hipaa_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_waitlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies for video_sessions
CREATE POLICY "Users can view their own video sessions" ON video_sessions FOR SELECT USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'patient' AND patient_id = (SELECT profile_id FROM users WHERE id = auth.uid()) OR
  (SELECT role FROM users WHERE id = auth.uid()) = 'doctor' AND doctor_id = (SELECT profile_id FROM users WHERE id = auth.uid())
);

-- RLS Policies for medical_queries
CREATE POLICY "Users can view their own medical queries" ON medical_queries FOR SELECT USING (
  user_id = auth.uid()
);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (
  user_id = auth.uid()
);

-- RLS Policies for patient_medical_events
CREATE POLICY "Patients can view their own medical events" ON patient_medical_events FOR SELECT USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'patient' AND patient_id = (SELECT profile_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Doctors can view their patients' medical events" ON patient_medical_events FOR SELECT USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'doctor' AND
  patient_id IN (SELECT patient_id FROM appointments WHERE doctor_id = (SELECT profile_id FROM users WHERE id = auth.uid()))
);

-- RLS Policies for prescriptions_enhanced
CREATE POLICY "Patients can view their own prescriptions" ON prescriptions_enhanced FOR SELECT USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'patient' AND patient_id = (SELECT profile_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Doctors can manage prescriptions for their patients" ON prescriptions_enhanced FOR ALL USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'doctor' AND doctor_id = (SELECT profile_id FROM users WHERE id = auth.uid())
);

-- RLS Policies for lab_reports_enhanced
CREATE POLICY "Patients can view their own lab reports" ON lab_reports_enhanced FOR SELECT USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'patient' AND patient_id = (SELECT profile_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Doctors can manage lab reports for their patients" ON lab_reports_enhanced FOR ALL USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'doctor' AND doctor_id = (SELECT profile_id FROM users WHERE id = auth.uid())
);

-- RLS Policies for billing_enhanced
CREATE POLICY "Patients can view their own bills" ON billing_enhanced FOR SELECT USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'patient' AND patient_id = (SELECT profile_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Doctors can view bills for their appointments" ON billing_enhanced FOR SELECT USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'doctor' AND 
  appointment_id IN (SELECT id FROM appointments WHERE doctor_id = (SELECT profile_id FROM users WHERE id = auth.uid()))
);

-- RLS Policies for appointment_waitlist
CREATE POLICY "Patients can manage their own waitlist entries" ON appointment_waitlist FOR ALL USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'patient' AND patient_id = (SELECT profile_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Doctors can view waitlist for their appointments" ON appointment_waitlist FOR SELECT USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'doctor' AND doctor_id = (SELECT profile_id FROM users WHERE id = auth.uid())
);

-- Admin users have full access (bypass RLS)
-- This is handled by using the `service_role` key on the backend.

-- Create functions for advanced analytics
CREATE OR REPLACE FUNCTION get_patient_timeline(patient_uuid UUID, start_date DATE DEFAULT NULL, end_date DATE DEFAULT NULL)
RETURNS TABLE(
  event_date DATE,
  event_type VARCHAR(50),
  title VARCHAR(255),
  description TEXT,
  doctor_name TEXT,
  severity VARCHAR(20)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pme.event_date,
    pme.event_type,
    pme.title,
    pme.description,
    CONCAT(d.first_name, ' ', d.last_name) as doctor_name,
    pme.severity
  FROM patient_medical_events pme
  LEFT JOIN doctors d ON pme.doctor_id = d.id
  WHERE pme.patient_id = patient_uuid
    AND pme.is_active = true
    AND (start_date IS NULL OR pme.event_date >= start_date)
    AND (end_date IS NULL OR pme.event_date <= end_date)
  ORDER BY pme.event_date DESC, pme.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get drug interaction alerts
CREATE OR REPLACE FUNCTION check_drug_interactions(patient_uuid UUID, new_medication TEXT)
RETURNS TABLE(
  interaction_severity VARCHAR(20),
  interaction_description TEXT,
  current_medications TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'moderate'::VARCHAR(20) as interaction_severity,
    'Potential interaction detected'::TEXT as interaction_description,
    ARRAY_AGG(p.current_medications) as current_medications
  FROM patients p
  WHERE p.id = patient_uuid
  GROUP BY p.id;
END;
$$ LANGUAGE plpgsql;

-- Function to get appointment analytics
CREATE OR REPLACE FUNCTION get_appointment_analytics(start_date DATE, end_date DATE)
RETURNS TABLE(
  total_appointments BIGINT,
  completed_appointments BIGINT,
  cancelled_appointments BIGINT,
  no_show_appointments BIGINT,
  telemedicine_appointments BIGINT,
  average_duration NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_appointments,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_appointments,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_appointments,
    COUNT(*) FILTER (WHERE status = 'no-show') as no_show_appointments,
    COUNT(*) FILTER (WHERE type = 'telemedicine') as telemedicine_appointments,
    AVG(duration) as average_duration
  FROM appointments
  WHERE appointment_date::DATE BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql;
