/**
 * Services Index
 * Central export point for all services
 */

// API Services
export { apiService } from './api.service';
export { customerApiService } from './customer.api.service';
export { customerService } from './customer.service';

// Types
export type { ApiResponse, ApiError } from './api.service';
export type { CustomerListResponse, CustomerFilters } from './customer.api.service';
