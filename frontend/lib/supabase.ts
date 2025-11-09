import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bgfbtbhdbkaossfhviaw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZmJ0YmhkYmthb3NzZmh2aWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzE3OTIsImV4cCI6MjA3MjA0Nzc5Mn0.S-XbgMnv0M4wxzeP_sUCjWSTZ9H6aaGKvbUqHek5ffA';

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
