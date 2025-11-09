import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
// These should be set in .env.local or .env.development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          role: 'admin' | 'doctor' | 'patient';
          profile_id?: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          role: 'admin' | 'doctor' | 'patient';
          profile_id?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          role?: 'admin' | 'doctor' | 'patient';
          profile_id?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      doctors: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string;
          specialization?: string;
          license_number?: string;
          experience?: number;
          qualification?: string;
          consultation_fee?: number;
          availability?: string;
          bio?: string;
          profile_image?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string;
          specialization?: string;
          license_number?: string;
          experience?: number;
          qualification?: string;
          consultation_fee?: number;
          availability?: string;
          bio?: string;
          profile_image?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          specialization?: string;
          license_number?: string;
          experience?: number;
          qualification?: string;
          consultation_fee?: number;
          availability?: string;
          bio?: string;
          profile_image?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      patients: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string;
          date_of_birth?: string;
          gender?: 'male' | 'female' | 'other';
          address?: string;
          emergency_contact?: string;
          emergency_phone?: string;
          medical_history?: string;
          allergies?: string;
          current_medications?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string;
          date_of_birth?: string;
          gender?: 'male' | 'female' | 'other';
          address?: string;
          emergency_contact?: string;
          emergency_phone?: string;
          medical_history?: string;
          allergies?: string;
          current_medications?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          date_of_birth?: string;
          gender?: 'male' | 'female' | 'other';
          address?: string;
          emergency_contact?: string;
          emergency_phone?: string;
          medical_history?: string;
          allergies?: string;
          current_medications?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
