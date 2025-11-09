-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table to store public user data
CREATE TABLE users (
  id UUID PRIMARY KEY, -- This will be the same as auth.users.id
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'doctor', 'patient')),
  profile_id UUID, -- Foreign key to either doctors or patients table
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctors table
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  specialization VARCHAR(100),
  license_number VARCHAR(50) UNIQUE,
  experience INTEGER DEFAULT 0,
  qualification TEXT,
  consultation_fee DECIMAL(10,2) DEFAULT 0,
  availability TEXT,
  bio TEXT,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  address TEXT,
  emergency_contact VARCHAR(100),
  emergency_phone VARCHAR(20),
  medical_history TEXT,
  allergies TEXT,
  current_medications TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show')),
  type VARCHAR(20) NOT NULL CHECK (type IN ('consultation', 'follow-up', 'emergency', 'telemedicine')),
  notes TEXT,
  symptoms TEXT,
  diagnosis TEXT,
  prescription TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create billing table
CREATE TABLE billing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  payment_reference VARCHAR(255),
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  due_date DATE NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prescriptions table
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  medication_name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100) NOT NULL,
  frequency VARCHAR(100) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create telemedicine_sessions table
CREATE TABLE telemedicine_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  room_id VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  recording_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lab_reports table
CREATE TABLE lab_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  report_name VARCHAR(255) NOT NULL,
  report_date DATE NOT NULL,
  file_url TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_doctors_user_id ON doctors(user_id);
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_billing_patient_id ON billing(patient_id);
CREATE INDEX idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX idx_telemedicine_sessions_appointment_id ON telemedicine_sessions(appointment_id);
CREATE INDEX idx_lab_reports_patient_id ON lab_reports(patient_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_billing_updated_at BEFORE UPDATE ON billing FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON prescriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_telemedicine_sessions_updated_at BEFORE UPDATE ON telemedicine_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lab_reports_updated_at BEFORE UPDATE ON lab_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemedicine_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_reports ENABLE ROW LEVEL SECURITY;

-- Policies for 'users' table
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Policies for 'doctors' table
CREATE POLICY "Doctors can view their own profile" ON doctors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Doctors can update their own profile" ON doctors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can view all doctors" ON doctors FOR SELECT USING (auth.role() = 'authenticated');

-- Policies for 'patients' table
CREATE POLICY "Patients can view their own profile" ON patients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Patients can update their own profile" ON patients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Doctors can view their patients" ON patients FOR SELECT USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'doctor' AND
  id IN (SELECT patient_id FROM appointments WHERE doctor_id = (SELECT profile_id FROM users WHERE id = auth.uid()))
);

-- Policies for 'appointments' table
CREATE POLICY "Users can view their own appointments" ON appointments FOR SELECT USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'patient' AND patient_id = (SELECT profile_id FROM users WHERE id = auth.uid()) OR
  (SELECT role FROM users WHERE id = auth.uid()) = 'doctor' AND doctor_id = (SELECT profile_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "Users can manage their own appointments" ON appointments FOR ALL USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'patient' AND patient_id = (SELECT profile_id FROM users WHERE id = auth.uid()) OR
  (SELECT role FROM users WHERE id = auth.uid()) = 'doctor' AND doctor_id = (SELECT profile_id FROM users WHERE id = auth.uid())
);

-- Policies for 'billing' table
CREATE POLICY "Patients can view their own bills" ON billing FOR SELECT USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'patient' AND patient_id = (SELECT profile_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "Doctors can view bills for their appointments" ON billing FOR SELECT USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'doctor' AND 
  appointment_id IN (SELECT id FROM appointments WHERE doctor_id = (SELECT profile_id FROM users WHERE id = auth.uid()))
);

-- Policies for 'prescriptions' table
CREATE POLICY "Users can view their own prescriptions" ON prescriptions FOR SELECT USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'patient' AND patient_id = (SELECT profile_id FROM users WHERE id = auth.uid()) OR
  (SELECT role FROM users WHERE id = auth.uid()) = 'doctor' AND doctor_id = (SELECT profile_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "Doctors can manage prescriptions for their appointments" ON prescriptions FOR ALL USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'doctor' AND doctor_id = (SELECT profile_id FROM users WHERE id = auth.uid())
);

-- Policies for 'lab_reports' table
CREATE POLICY "Users can view their own lab reports" ON lab_reports FOR SELECT USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'patient' AND patient_id = (SELECT profile_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "Doctors can manage lab reports for their patients" ON lab_reports FOR ALL USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'doctor'
);

-- Admin users have full access (bypass RLS)
-- This is handled by using the `service_role` key on the backend.

-- Create RPC functions for trends
CREATE OR REPLACE FUNCTION get_appointment_trends(start_date timestamptz, group_by_period text)
RETURNS TABLE(period text, count bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT
    to_char(date_trunc(group_by_period, appointment_date), 'YYYY-MM-DD') AS period,
    COUNT(*) AS count
  FROM appointments
  WHERE appointment_date >= start_date
  GROUP BY 1
  ORDER BY 1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_revenue_trends(start_date timestamptz, group_by_period text)
RETURNS TABLE(period text, revenue numeric) AS $$
BEGIN
  RETURN QUERY
  SELECT
    to_char(date_trunc(group_by_period, created_at), 'YYYY-MM-DD') AS period,
    SUM(total_amount) AS revenue
  FROM billing
  WHERE created_at >= start_date AND status = 'paid'
  GROUP BY 1
  ORDER BY 1;
END;
$$ LANGUAGE plpgsql;
