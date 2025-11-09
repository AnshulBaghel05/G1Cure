import { secret } from "encore.dev/config";
import { createClient } from "@supabase/supabase-js";

// Supabase configuration secrets
const supabaseUrl = secret("SupabaseUrl");
const supabaseAnonKey = secret("SupabaseAnonKey");
const supabaseServiceKey = secret("SupabaseServiceKey");

// Create Supabase client for server-side operations
export const supabaseAdmin = createClient(
  'https://bgfbtbhdbkaossfhviaw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZmJ0YmhkYmthb3NzZmh2aWF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ3MTc5MiwiZXhwIjoyMDcyMDQ3NzkyfQ.FYs3LciZb8UvUahn-Os23v15qrxez2XO17hGcj-m6L4',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Create Supabase client for client-side operations
export const supabaseClient = createClient(
  'https://bgfbtbhdbkaossfhviaw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZmJ0YmhkYmthb3NzZmh2aWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzE3OTIsImV4cCI6MjA3MjA0Nzc5Mn0.S-XbgMnv0M4wxzeP_sUCjWSTZ9H6aaGKvbUqHek5ffA'
);

// Database schema types (you would generate these from Supabase)
export interface SupabaseUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "doctor" | "patient";
  profile_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabasePatient {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: "male" | "female" | "other";
  address: string;
  emergency_contact: string;
  emergency_phone: string;
  medical_history?: string;
  allergies?: string;
  current_medications?: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseDoctor {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  specialization: string;
  license_number: string;
  experience: number;
  qualification: string;
  consultation_fee: number;
  availability: string;
  bio?: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseAppointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  duration: number;
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show";
  type: "consultation" | "follow-up" | "emergency" | "telemedicine";
  notes?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  created_at: string;
  updated_at: string;
}
