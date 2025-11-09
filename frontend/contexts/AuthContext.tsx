import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'doctor' | 'patient';
  profile_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: SignupData) => Promise<{ success: boolean; error?: string; message?: string; requiresVerification?: boolean }>;
  logout: () => Promise<void>;
  completeProfileCreation: (userId: string, userData: SignupData) => Promise<{ success: boolean; error?: string }>;
  permissions: string[];
}

interface SignupData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'doctor' | 'patient';
  // Doctor specific fields
  specialization?: string;
  licenseNumber?: string;
  experience?: string;
  qualification?: string;
  consultationFee?: string;
  availability?: string;
  bio?: string;
  // Patient specific fields
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<string[]>([]);
  const navigate = useNavigate();

  // Define role-based permissions
  const rolePermissions = {
    admin: [
      'user:read', 'user:write', 'user:delete',
      'doctor:read', 'doctor:write', 'doctor:delete',
      'patient:read', 'patient:write', 'patient:delete',
      'appointment:read', 'appointment:write', 'appointment:delete',
      'billing:read', 'billing:write', 'billing:delete',
      'system:read', 'system:write', 'system:delete'
    ],
    doctor: [
      'patient:read',
      'appointment:read', 'appointment:write',
      'prescription:read', 'prescription:write',
      'billing:read', 'billing:write',
      'telemedicine:read', 'telemedicine:write',
      'lab_report:read', 'lab_report:write'
    ],
    patient: [
      'appointment:read', 'appointment:write',
      'medical_record:read',
      'prescription:read',
      'billing:read',
      'telemedicine:read', 'telemedicine:write'
    ]
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Clear any existing mock data from localStorage
        localStorage.removeItem('mockUser');
        localStorage.removeItem('mockSession');
        
        // Get initial session from Supabase
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          setSession(initialSession);
          await fetchUserProfile(initialSession.user.id);
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setSession(session);
            
            if (event === 'SIGNED_IN' && session) {
              await fetchUserProfile(session.user.id);
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              setPermissions([]);
              navigate('/');
            }
          }
        );

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [navigate]);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setUser(data);
        setPermissions(rolePermissions[data.role as keyof typeof rolePermissions] || []);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Login function - Using Supabase Auth
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user && data.session) {
        setSession(data.session);
        
        // Check if this user has pending signup data that needs profile completion
        const pendingSignupStr = localStorage.getItem('pendingSignup');
        if (pendingSignupStr) {
          try {
            const pendingSignup = JSON.parse(pendingSignupStr);
            
            // Check if this is the same user and the data is recent (within 24 hours)
            if (pendingSignup.userId === data.user.id && 
                (Date.now() - pendingSignup.timestamp) < 24 * 60 * 60 * 1000) {
              
              // Complete profile creation
              const profileResult = await completeProfileCreation(pendingSignup.userId, pendingSignup.userData);
              if (profileResult.success) {
                console.log('Profile creation completed successfully');
              } else {
                console.error('Profile creation failed:', profileResult.error);
              }
            }
          } catch (parseError) {
            console.error('Error parsing pending signup data:', parseError);
            localStorage.removeItem('pendingSignup');
          }
        }
        
        // Fetch user profile from database
        await fetchUserProfile(data.user.id);
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function - Using Supabase Auth
  const signup = async (userData: SignupData) => {
    try {
      setIsLoading(true);

      console.log('🔍 Attempting signup with data:', { email: userData.email, role: userData.role });

      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: userData.role,
            // Store additional data in auth metadata for later use
            specialization: userData.specialization,
            licenseNumber: userData.licenseNumber,
            experience: userData.experience,
            qualification: userData.qualification,
            consultationFee: userData.consultationFee,
            availability: userData.availability,
            bio: userData.bio,
            dateOfBirth: userData.dateOfBirth,
            gender: userData.gender,
            address: userData.address,
            emergencyContact: userData.emergencyContact,
            emergencyPhone: userData.emergencyPhone,
            medicalHistory: userData.medicalHistory,
            allergies: userData.allergies,
            currentMedications: userData.currentMedications,
          }
        }
      });

      if (authError) {
        console.error('🚨 Supabase Auth Error:', authError);
        
        // Handle specific error types
        if (authError.message.includes('captcha')) {
          throw new Error('Captcha verification failed. Please try again or contact support if the issue persists.');
        } else if (authError.status === 500) {
          throw new Error('Authentication service temporarily unavailable. Please try again later.');
        } else {
          throw new Error(`Signup failed: ${authError.message}`);
        }
      }

      if (authData.user) {
        console.log('✅ User created successfully:', authData.user.id);
        
        // Store signup data in localStorage temporarily
        // This will be used when the user verifies their email and signs in
        const signupData = {
          userId: authData.user.id,
          userData: userData,
          timestamp: Date.now()
        };
        localStorage.setItem('pendingSignup', JSON.stringify(signupData));
        
        return { 
          success: true, 
          message: 'Please check your email to verify your account before signing in.',
          requiresVerification: true 
        };
      }

      return { success: false, error: 'Signup failed - no user data returned' };
    } catch (error: any) {
      console.error('🚨 Signup Exception:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Function to complete profile creation after email verification
  const completeProfileCreation = async (userId: string, userData: SignupData) => {
    try {
      // Create user profile in users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role,
          is_active: true,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error(`Profile creation failed: ${profileError.message}`);
      }

      // Create role-specific profile
      if (userData.role === 'doctor') {
        const { error: doctorError } = await supabase
          .from('doctors')
          .insert({
            user_id: userId,
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            specialization: userData.specialization || '',
            license_number: userData.licenseNumber || '',
            experience: userData.experience ? parseInt(userData.experience) : 0,
            qualification: userData.qualification || '',
            consultation_fee: userData.consultationFee ? parseFloat(userData.consultationFee) : 0,
            availability: userData.availability || '',
            bio: userData.bio || '',
          });

        if (doctorError) {
          console.error('Doctor profile creation error:', doctorError);
        }
      } else if (userData.role === 'patient') {
        const { error: patientError } = await supabase
          .from('patients')
          .insert({
            user_id: userId,
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            date_of_birth: userData.dateOfBirth || null,
            gender: userData.gender || 'other',
            address: userData.address || '',
            emergency_contact: userData.emergencyContact || '',
            emergency_phone: userData.emergencyPhone || '',
            medical_history: userData.medicalHistory || '',
            allergies: userData.allergies || '',
            current_medications: userData.currentMedications || '',
          });

        if (patientError) {
          console.error('Patient profile creation error:', patientError);
        }
      }

      // Update user profile with profile_id
      if (userData.role === 'doctor') {
        const { data: doctorData } = await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (doctorData) {
          await supabase
            .from('users')
            .update({ profile_id: doctorData.id })
            .eq('id', userId);
        }
      } else if (userData.role === 'patient') {
        const { data: patientData } = await supabase
          .from('patients')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (patientData) {
          await supabase
            .from('users')
            .update({ profile_id: patientData.id })
            .eq('id', userId);
        }
      }

      // Clear pending signup data
      localStorage.removeItem('pendingSignup');
      
      return { success: true };
    } catch (error: any) {
      console.error('Profile completion error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setPermissions([]);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    login,
    signup,
    logout,
    completeProfileCreation,
    permissions,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
