// Utility functions to safely access properties from OmitCookie types

export function safeAccess<T>(obj: any, property: string): T | undefined {
  try {
    return obj?.[property];
  } catch {
    return undefined;
  }
}

// Helper to safely extract user ID from Option type
export function extractUserId(user: any): string | null {
  if (!user) return null;
  
  // Handle Option type for profile_id
  if (user.profile_id && typeof user.profile_id === 'object' && 'Some' in user.profile_id) {
    return user.profile_id.Some;
  }
  
  // Fallback to direct values
  return user.profile_id || user.id || null;
}

export function safeArrayAccess<T>(obj: any, property: string): T[] {
  try {
    const value = obj?.[property];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

// Type guards for common backend response patterns
export function hasProperty<T>(obj: any, property: string): obj is T {
  return obj && typeof obj === 'object' && property in obj;
}

// Helper to extract data from OmitCookie wrapped responses
export function extractData<T>(response: any, property: string): T[] {
  if (!response) return [];
  
  // Try direct access first
  if (hasProperty<T[]>(response, property)) {
    return Array.isArray(response[property]) ? response[property] : [];
  }
  
  // Try accessing through data property
  if (hasProperty<T[]>(response, 'data') && hasProperty<T[]>(response.data, property)) {
    return Array.isArray(response.data[property]) ? response.data[property] : [];
  }
  
  // Try accessing through result property
  if (hasProperty<T[]>(response, 'result') && hasProperty<T[]>(response.result, property)) {
    return Array.isArray(response.result[property]) ? response.result[property] : [];
  }
  
  return [];
}

// Helper to extract single value from OmitCookie wrapped responses
export function extractValue<T>(response: any, property: string): T | undefined {
  if (!response) return undefined;
  
  // Try direct access first
  if (hasProperty<T>(response, property)) {
    return response[property];
  }
  
  // Try accessing through data property
  if (hasProperty<T>(response, 'data') && hasProperty<T>(response.data, property)) {
    return response.data[property];
  }
  
  // Try accessing through result property
  if (hasProperty<T>(response, 'result') && hasProperty<T>(response.result, property)) {
    return response.result[property];
  }
  
  return undefined;
}
