import { api, APIError, Gateway } from "encore.dev/api";
import { supabaseAdmin } from "./client";
import { authHandler } from "encore.dev/auth";
import { Header, Cookie } from "encore.dev/api";
import type { SupabaseUser } from "./client";
import { getAuthData } from "~encore/auth";

export interface SupabaseAuthData {
  userID: string;
  email: string;
  role: "admin" | "doctor" | "patient";
  profileId?: string;
}

interface AuthParams {
  authorization?: Header<"Authorization">;
  session?: Cookie<"session">;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "admin" | "doctor" | "patient";
  profileData?: any;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: SupabaseUser;
  session: any;
}

export interface GetCurrentUserResponse {
  user: SupabaseUser;
}

// Supabase Auth Handler
const supabaseAuth = authHandler<AuthParams, SupabaseAuthData>(
  async (params) => {
    const token = params.authorization?.replace("Bearer ", "") ?? params.session?.value;
    
    if (!token) {
      throw APIError.unauthenticated("missing token");
    }

    try {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
      
      if (error || !user) {
        throw APIError.unauthenticated("invalid token");
      }

      // Get user profile from your custom users table
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        throw APIError.unauthenticated("user profile not found");
      }

      return {
        userID: user.id,
        email: user.email!,
        role: profile.role,
        profileId: profile.profile_id,
      };
    } catch (err) {
      throw APIError.unauthenticated("invalid token", err);
    }
  }
);

// Configure the API gateway to use the auth handler globally.
export const gw = new Gateway({ authHandler: supabaseAuth });

// Creates a user from the admin dashboard.
export const adminCreateUser = api<SignupRequest, { user: SupabaseUser }>(
  { expose: true, method: "POST", path: "/supabase/auth/admin/create-user", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    if (auth?.role !== 'admin') {
      throw APIError.permissionDenied("Only admins can create users.");
    }

    let authUserId: string | undefined;
    try {
      // Check if user already exists in auth
      const { data: existingAuthUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingAuthUser = existingAuthUsers.users.find(u => u.email === req.email);
      
      if (existingAuthUser) {
        throw new Error(`User with email ${req.email} already exists`);
      }

      // Check if user already exists in users table
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', req.email)
        .single();

      if (existingUser) {
        throw new Error(`User with email ${req.email} already exists`);
      }

      // 1. Create user in Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: req.email,
        password: req.password,
        email_confirm: true, // Auto-confirm as admin is creating the user
      });

      if (authError || !authData.user) {
        throw new Error(`Auth user creation failed: ${authError?.message}`);
      }
      authUserId = authData.user.id;

      // 2. Create user profile in 'users' table
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authUserId,
          email: req.email,
          first_name: req.firstName,
          last_name: req.lastName,
          role: req.role,
          is_active: true,
        })
        .select()
        .single();

      if (userError) {
        throw new Error(`Profile creation in 'users' table failed: ${userError.message}`);
      }
      
      return { user: userData as SupabaseUser };
    } catch (error: any) {
      // Cleanup on failure
      if (authUserId) {
        try {
          await supabaseAdmin.auth.admin.deleteUser(authUserId);
        } catch (cleanupError) {
          console.error('Failed to cleanup auth user:', cleanupError);
        }
      }
      console.error('Admin create user error:', error);
      throw APIError.internal(`User creation failed: ${error.message}`);
    }
  }
);

// Signup with Supabase
export const supabaseSignup = api<SignupRequest, AuthResponse>(
  { expose: true, method: "POST", path: "/supabase/auth/signup" },
  async (req) => {
    let authUserId: string | undefined;
    try {
      // Check if user already exists in auth
      const { data: existingAuthUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingAuthUser = existingAuthUsers.users.find(u => u.email === req.email);
      
      if (existingAuthUser) {
        // If auth user exists, check if they have a profile
        const { data: existingProfile } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('id', existingAuthUser.id)
          .single();

        if (existingProfile) {
          throw new Error(`User with email ${req.email} already exists`);
        } else {
          // Auth user exists but no profile - this is an incomplete signup
          // Delete the auth user and start fresh
          await supabaseAdmin.auth.admin.deleteUser(existingAuthUser.id);
        }
      }

      // Check if user already exists in users table (orphaned profile)
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', req.email)
        .single();

      if (existingUser) {
        // Delete orphaned profile
        await supabaseAdmin
          .from('users')
          .delete()
          .eq('id', existingUser.id);
      }

      // 1. Create user in Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: req.email,
        password: req.password,
        email_confirm: true, // Auto-confirm for testing
      });

      if (authError || !authData.user) {
        throw new Error(`Auth user creation failed: ${authError?.message}`);
      }
      authUserId = authData.user.id;

      // 2. Create basic user profile in 'users' table
      // For now, skip role-specific profiles to avoid RLS issues
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authUserId,
          email: req.email,
          first_name: req.firstName,
          last_name: req.lastName,
          role: req.role,
          is_active: true,
        })
        .select()
        .single();

      if (userError) {
        throw new Error(`Profile creation in 'users' table failed: ${userError.message}`);
      }

      // Note: Role-specific profiles (doctors, patients) will be created later
      // when the user first accesses their dashboard, or through a separate process
      // This avoids the RLS issues for now

      // 3. Generate session
      const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.signInWithPassword({
        email: req.email,
        password: req.password,
      });

      if (sessionError || !sessionData.session) {
        throw new Error(`Session creation failed: ${sessionError?.message}`);
      }

      return {
        user: userData as SupabaseUser,
        session: sessionData.session,
      };
    } catch (error: any) {
      // Cleanup on failure
      if (authUserId) {
        try {
          await supabaseAdmin.auth.admin.deleteUser(authUserId);
        } catch (cleanupError) {
          console.error('Failed to cleanup auth user:', cleanupError);
        }
      }
      console.error('Supabase signup error:', error);
      throw APIError.internal(`Signup failed: ${error.message}`);
    }
  }
);

// Login with Supabase
export const supabaseLogin = api<LoginRequest, AuthResponse>(
  { expose: true, method: "POST", path: "/supabase/auth/login" },
  async (req) => {
    // 1. Sign in with Supabase Auth
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.signInWithPassword({
      email: req.email,
      password: req.password,
    });

    if (sessionError || !sessionData.user) {
      throw APIError.unauthenticated(`Login failed: ${sessionError?.message || 'Invalid credentials'}`);
    }

    // 2. Get user profile from our public 'users' table
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', sessionData.user.id)
      .single();

    if (profileError) {
        console.error('Supabase login profile fetch error:', profileError);
        throw APIError.internal("Failed to fetch user profile during login.", { cause: profileError });
    }
    
    if (!profile) {
      console.error(`Login failed: User authenticated with Supabase but no profile found in 'users' table for id ${sessionData.user.id}`);
      throw APIError.notFound("User profile not found. Please contact support.");
    }

    if (!profile.is_active) {
      throw APIError.permissionDenied("Your account is not active. Please contact support.");
    }

    return {
      user: profile as SupabaseUser,
      session: sessionData.session,
    };
  }
);

// Get current user with Supabase
export const supabaseGetCurrentUser = api<void, GetCurrentUserResponse>(
  { expose: true, method: "GET", path: "/supabase/auth/me", auth: true },
  async () => {
    const authData = getAuthData()!;
    
    const { data: profile, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', authData.userID)
      .single();

    if (error || !profile) {
      throw APIError.notFound("User not found");
    }

    return { user: profile as SupabaseUser };
  }
);

export { supabaseAuth };
