/**
 * Customer Service (Unified Interface)
 * This service automatically switches between localStorage and API
 * based on the API_ENABLED environment variable
 * 
 * USAGE:
 * - In development: Uses localStorage (default)
 * - In production with API: Set VITE_API_ENABLED=true in .env.production
 */

import { Customer } from '@/lib/supabase';
import { storageService } from '@/lib/storage';
import { customerApiService } from './customer.api.service';
import { apiConfig } from '@/config/api.config';

class CustomerService {
  private useApi: boolean;

  constructor() {
    this.useApi = apiConfig.enabled;
  }

  /**
   * Get all customers
   */
  async getCustomers(): Promise<Customer[]> {
    if (this.useApi) {
      try {
        const response = await customerApiService.getCustomers();
        return response.data.customers;
      } catch (error) {
        console.error('API Error, falling back to localStorage:', error);
        return storageService.getCustomers();
      }
    }
    
    return storageService.getCustomers();
  }

  /**
   * Get single customer by ID
   */
  async getCustomer(id: string): Promise<Customer | undefined> {
    if (this.useApi) {
      try {
        const response = await customerApiService.getCustomer(id);
        return response.data;
      } catch (error) {
        console.error('API Error, falling back to localStorage:', error);
        return storageService.getCustomers().find(c => c.id === id);
      }
    }
    
    return storageService.getCustomers().find(c => c.id === id);
  }

  /**
   * Add new customer
   */
  async addCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> {
    if (this.useApi) {
      try {
        const response = await customerApiService.createCustomer(customer);
        return response.data;
      } catch (error) {
        console.error('API Error, falling back to localStorage:', error);
        return storageService.addCustomer(customer);
      }
    }
    
    return storageService.addCustomer(customer);
  }

  /**
   * Update customer
   */
  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer | null> {
    if (this.useApi) {
      try {
        const response = await customerApiService.updateCustomer(id, customer);
        return response.data;
      } catch (error) {
        console.error('API Error, falling back to localStorage:', error);
        return storageService.updateCustomer(id, customer as any);
      }
    }
    
    return storageService.updateCustomer(id, customer as any);
  }

  /**
   * Delete customer
   */
  async deleteCustomer(id: string): Promise<boolean> {
    if (this.useApi) {
      try {
        await customerApiService.deleteCustomer(id);
        return true;
      } catch (error) {
        console.error('API Error, falling back to localStorage:', error);
        return storageService.deleteCustomer(id);
      }
    }
    
    return storageService.deleteCustomer(id);
  }

  /**
   * Search customers
   */
  async searchCustomers(query: string): Promise<Customer[]> {
    if (this.useApi) {
      try {
        const response = await customerApiService.searchCustomers(query);
        return response.data;
      } catch (error) {
        console.error('API Error, falling back to localStorage:', error);
        // Fallback to local search
        const customers = storageService.getCustomers();
        const search = query.toLowerCase();
        return customers.filter(c => 
          c.name.toLowerCase().includes(search) ||
          c.phone1.includes(search) ||
          c.city.toLowerCase().includes(search)
        );
      }
    }
    
    const customers = storageService.getCustomers();
    const search = query.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(search) ||
      c.phone1.includes(search) ||
      c.city.toLowerCase().includes(search)
    );
  }

  /**
   * Check if using API
   */
  isUsingApi(): boolean {
    return this.useApi;
  }

  /**
   * Enable API mode
   */
  enableApi(): void {
    this.useApi = true;
  }

  /**
   * Disable API mode (use localStorage)
   */
  disableApi(): void {
    this.useApi = false;
  }
}

export const customerService = new CustomerService();
