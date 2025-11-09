-- Add department and sub_admin_type columns to users table
ALTER TABLE users ADD COLUMN department VARCHAR(50);
ALTER TABLE users ADD COLUMN sub_admin_type VARCHAR(50);

-- Update role check constraint to include sub-admin
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'sub-admin', 'doctor', 'patient'));

-- Create departments table
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default departments
INSERT INTO departments (name, description) VALUES
  ('General', 'General hospital administration'),
  ('Pharmacy', 'Pharmacy and medication management'),
  ('Dentistry', 'Dental care and oral health'),
  ('Cardiology', 'Heart and cardiovascular care'),
  ('Orthopedics', 'Bone and joint care'),
  ('Pediatrics', 'Child healthcare'),
  ('Gynecology', 'Women''s health'),
  ('Neurology', 'Brain and nervous system'),
  ('Emergency', 'Emergency and trauma care'),
  ('Laboratory', 'Lab tests and diagnostics'),
  ('Radiology', 'Medical imaging'),
  ('Surgery', 'Surgical procedures');

-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  service_quality INTEGER CHECK (service_quality >= 1 AND service_quality <= 5),
  communication INTEGER CHECK (communication >= 1 AND communication <= 5),
  wait_time INTEGER CHECK (wait_time >= 1 AND wait_time <= 5),
  cleanliness INTEGER CHECK (cleanliness >= 1 AND cleanliness <= 5),
  would_recommend BOOLEAN DEFAULT true,
  is_anonymous BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create permissions table for sub-admin roles
CREATE TABLE sub_admin_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  can_view_patients BOOLEAN DEFAULT false,
  can_edit_patients BOOLEAN DEFAULT false,
  can_view_doctors BOOLEAN DEFAULT false,
  can_edit_doctors BOOLEAN DEFAULT false,
  can_view_appointments BOOLEAN DEFAULT false,
  can_edit_appointments BOOLEAN DEFAULT false,
  can_view_billing BOOLEAN DEFAULT false,
  can_edit_billing BOOLEAN DEFAULT false,
  can_view_analytics BOOLEAN DEFAULT false,
  can_manage_users BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, department_id)
);

-- Create indexes
CREATE INDEX idx_reviews_appointment_id ON reviews(appointment_id);
CREATE INDEX idx_reviews_patient_id ON reviews(patient_id);
CREATE INDEX idx_reviews_doctor_id ON reviews(doctor_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_sub_admin_permissions_user_id ON sub_admin_permissions(user_id);
CREATE INDEX idx_sub_admin_permissions_department_id ON sub_admin_permissions(department_id);
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_sub_admin_type ON users(sub_admin_type);

-- Add triggers for updated_at
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sub_admin_permissions_updated_at BEFORE UPDATE ON sub_admin_permissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Patients can view and create their own reviews
CREATE POLICY "Patients can view their own reviews" ON reviews FOR SELECT USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'patient' AND 
  patient_id = (SELECT profile_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Patients can create reviews for their appointments" ON reviews FOR INSERT WITH CHECK (
  (SELECT role FROM users WHERE id = auth.uid()) = 'patient' AND 
  patient_id = (SELECT profile_id FROM users WHERE id = auth.uid())
);

-- Doctors can view reviews for their appointments
CREATE POLICY "Doctors can view their reviews" ON reviews FOR SELECT USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'doctor' AND 
  doctor_id = (SELECT profile_id FROM users WHERE id = auth.uid())
);

-- Admins and sub-admins can view all reviews
CREATE POLICY "Admins can view all reviews" ON reviews FOR SELECT USING (
  (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'sub-admin')
);

-- RLS Policies for departments
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view departments" ON departments FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for sub_admin_permissions
ALTER TABLE sub_admin_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own permissions" ON sub_admin_permissions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all permissions" ON sub_admin_permissions FOR ALL USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

-- Function to get user permissions
CREATE OR REPLACE FUNCTION get_user_permissions(user_uuid UUID)
RETURNS TABLE(
  department_name VARCHAR(100),
  can_view_patients BOOLEAN,
  can_edit_patients BOOLEAN,
  can_view_doctors BOOLEAN,
  can_edit_doctors BOOLEAN,
  can_view_appointments BOOLEAN,
  can_edit_appointments BOOLEAN,
  can_view_billing BOOLEAN,
  can_edit_billing BOOLEAN,
  can_view_analytics BOOLEAN,
  can_manage_users BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.name as department_name,
    p.can_view_patients,
    p.can_edit_patients,
    p.can_view_doctors,
    p.can_edit_doctors,
    p.can_view_appointments,
    p.can_edit_appointments,
    p.can_view_billing,
    p.can_edit_billing,
    p.can_view_analytics,
    p.can_manage_users
  FROM sub_admin_permissions p
  JOIN departments d ON p.department_id = d.id
  WHERE p.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to get review statistics
CREATE OR REPLACE FUNCTION get_review_stats(doctor_uuid UUID DEFAULT NULL, start_date DATE DEFAULT NULL, end_date DATE DEFAULT NULL)
RETURNS TABLE(
  total_reviews BIGINT,
  average_rating NUMERIC,
  average_service_quality NUMERIC,
  average_communication NUMERIC,
  average_wait_time NUMERIC,
  average_cleanliness NUMERIC,
  recommendation_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_reviews,
    ROUND(AVG(rating), 2) as average_rating,
    ROUND(AVG(service_quality), 2) as average_service_quality,
    ROUND(AVG(communication), 2) as average_communication,
    ROUND(AVG(wait_time), 2) as average_wait_time,
    ROUND(AVG(cleanliness), 2) as average_cleanliness,
    ROUND(AVG(CASE WHEN would_recommend THEN 1 ELSE 0 END) * 100, 2) as recommendation_percentage
  FROM reviews r
  WHERE 
    (doctor_uuid IS NULL OR r.doctor_id = doctor_uuid) AND
    (start_date IS NULL OR r.created_at::date >= start_date) AND
    (end_date IS NULL OR r.created_at::date <= end_date) AND
    r.is_approved = true;
END;
$$ LANGUAGE plpgsql;
