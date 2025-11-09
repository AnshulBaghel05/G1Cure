import { secret } from "encore.dev/config";
import { createClient } from "@supabase/supabase-js";

// Supabase configuration secrets
const supabaseUrl = secret("SupabaseUrl");
const supabaseAnonKey = secret("SupabaseAnonKey");
const supabaseServiceKey = secret("SupabaseServiceKey");

// Get environment variables from Encore secrets
// If running locally, these will be read from backend/.env
// In production, use Encore's secret management
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bgfbtbhdbkaossfhviaw.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

// Create Supabase client for server-side operations
export const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Create Supabase client for client-side operations
export const supabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
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
