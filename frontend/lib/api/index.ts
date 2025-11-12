// Export all API modules
export * from './supabase';
export * from './patients';
export * from './doctors';
export * from './appointments';
export * from './billing';
export * from './analytics';
export * from './reviews';
export * from './telemedicine';
export * from './prescriptions';
export * from './medical-records';
export * from './admin';

// Re-export for backwards compatibility
import * as patients from './patients';
import * as doctors from './doctors';
import * as appointments from './appointments';
import * as billing from './billing';

export const api = {
  patients,
  doctors,
  appointments,
  billing,
};

export default api;
