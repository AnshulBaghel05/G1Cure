// The Clerk publishable key, to initialize Clerk.
// TODO: Set this to your Clerk publishable key, which can be found in the Clerk dashboard.
export const clerkPublishableKey = "";

// Supabase configuration for frontend
// TODO: Set these to your Supabase project values from the Supabase dashboard.
export const supabaseUrl = "https://bgfbtbhdbkaossfhviaw.supabase.co";
export const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZmJ0YmhkYmthb3NzZmh2aWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzE3OTIsImV4cCI6MjA3MjA0Nzc5Mn0.S-XbgMnv0M4wxzeP_sUCjWSTZ9H6aaGKvbUqHek5ffA";

// Stripe configuration for frontend
// TODO: Set this to your Stripe publishable key from the Stripe dashboard.
export const stripePublishableKey = "";

// Google Maps API Key for frontend
// TODO: Set this to your Google Maps API Key from the Google Cloud Console.
export const googleMapsApiKey = "AIzaSyBoI-Rzr9u1qCPCiPulAkMBWPEr-6CPRQY";

// API configuration
export const apiBaseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com' 
  : 'http://localhost:4000';

// Feature flags
export const features = {
  enableAnalytics: true,
  enableTelemedicine: true,
};
