// Configuration loaded from environment variables
// These are defined in .env.local for development

// Clerk authentication (optional)
export const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

// Supabase configuration for frontend
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration missing! Check your .env.local file.');
}

// Stripe configuration for frontend (optional)
export const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

// Google Maps API Key for frontend (optional)
export const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// API configuration
export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === 'production'
    ? 'https://your-production-api.com'
    : 'http://localhost:4000');

// Agora configuration for video conferencing (optional)
export const agoraAppId = import.meta.env.VITE_AGORA_APP_ID || '';

// Feature flags
export const features = {
  enableAnalytics: true,
  enableTelemedicine: true,
  enableStripePayments: !!stripePublishableKey,
  enableGoogleMaps: !!googleMapsApiKey,
  enableVideoConferencing: !!agoraAppId,
};

// Log configuration status (development only)
if (import.meta.env.DEV) {
  console.log('🔧 Configuration loaded:', {
    supabaseConfigured: !!(supabaseUrl && supabaseAnonKey),
    stripeConfigured: !!stripePublishableKey,
    googleMapsConfigured: !!googleMapsApiKey,
    agoraConfigured: !!agoraAppId,
    clerkConfigured: !!clerkPublishableKey,
    apiBaseUrl,
  });
}
