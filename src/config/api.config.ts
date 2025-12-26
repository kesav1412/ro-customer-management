/**
 * API Configuration
 * Configure your backend API endpoints here
 */

export const apiConfig = {
  // Base URL for your backend API
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  // API timeout in milliseconds
  timeout: 30000,
  
  // API endpoints
  endpoints: {
    customers: {
      list: '/customers',
      create: '/customers',
      update: (id: string) => `/customers/${id}`,
      delete: (id: string) => `/customers/${id}`,
      get: (id: string) => `/customers/${id}`,
    },
    // Add more endpoints as needed in future
    services: {
      list: '/services',
      create: '/services',
      update: (id: string) => `/services/${id}`,
      delete: (id: string) => `/services/${id}`,
    },
    reports: {
      generate: '/reports/generate',
      download: '/reports/download',
    },
  },
  
  // API version (if your API uses versioning)
  version: 'v1',
  
  // Enable/disable API - when false, uses local storage
  enabled: import.meta.env.VITE_API_ENABLED === 'true',
} as const;

// API request headers
export const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Auth token key (for future authentication)
export const AUTH_TOKEN_KEY = 'auth_token';
