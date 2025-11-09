import { Client } from '../client';
import { useAuth } from '../contexts/AuthContext';

// Create a backend client instance
export const backendClient = new Client(import.meta.env.VITE_CLIENT_TARGET || 'http://localhost:4000', {
  requestInit: { 
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  }
});

// Hook to get authenticated backend client
export const useBackendClient = () => {
  const { session } = useAuth();
  
  return backendClient.with({
    auth: session ? {
      authorization: `Bearer ${session.access_token}`
    } : undefined
  });
};

// Export individual service clients for convenience
export const { 
  admin, 
  analytics, 
  clinic, 
  reviews, 
  stripe, 
  supabase, 
  telemedicine 
} = backendClient;
