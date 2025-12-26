/**
 * Customer API Service
 * Handles customer-related API calls
 * This will be used when API is enabled in the future
 */

import { Customer } from '@/lib/supabase';
import { apiService, ApiResponse } from './api.service';
import { apiConfig } from '@/config/api.config';

export interface CustomerListResponse {
  customers: Customer[];
  total: number;
  page?: number;
  limit?: number;
}

export interface CustomerFilters {
  search?: string;
  city?: string;
  street?: string;
  page?: number;
  limit?: number;
}

class CustomerApiService {
  /**
   * Get all customers with optional filters
   */
  async getCustomers(filters?: CustomerFilters): Promise<ApiResponse<CustomerListResponse>> {
    const endpoint = apiConfig.endpoints.customers.list;
    return apiService.get<CustomerListResponse>(endpoint, filters);
  }

  /**
   * Get single customer by ID
   */
  async getCustomer(id: string): Promise<ApiResponse<Customer>> {
    const endpoint = apiConfig.endpoints.customers.get(id);
    return apiService.get<Customer>(endpoint);
  }

  /**
   * Create new customer
   */
  async createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Customer>> {
    const endpoint = apiConfig.endpoints.customers.create;
    return apiService.post<Customer>(endpoint, customer);
  }

  /**
   * Update existing customer
   */
  async updateCustomer(id: string, customer: Partial<Customer>): Promise<ApiResponse<Customer>> {
    const endpoint = apiConfig.endpoints.customers.update(id);
    return apiService.put<Customer>(endpoint, customer);
  }

  /**
   * Delete customer
   */
  async deleteCustomer(id: string): Promise<ApiResponse<void>> {
    const endpoint = apiConfig.endpoints.customers.delete(id);
    return apiService.delete<void>(endpoint);
  }

  /**
   * Search customers
   */
  async searchCustomers(query: string): Promise<ApiResponse<Customer[]>> {
    const endpoint = apiConfig.endpoints.customers.list;
    return apiService.get<Customer[]>(endpoint, { search: query });
  }

  /**
   * Get customers by city
   */
  async getCustomersByCity(city: string): Promise<ApiResponse<Customer[]>> {
    const endpoint = apiConfig.endpoints.customers.list;
    return apiService.get<Customer[]>(endpoint, { city });
  }

  /**
   * Get customers by street
   */
  async getCustomersByStreet(city: string, street: string): Promise<ApiResponse<Customer[]>> {
    const endpoint = apiConfig.endpoints.customers.list;
    return apiService.get<Customer[]>(endpoint, { city, street });
  }
}

export const customerApiService = new CustomerApiService();
