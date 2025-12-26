import { Customer } from './supabase';

const STORAGE_KEY = 'john_aqua_cure_customers';

export const storageService = {
  getCustomers(): Customer[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  saveCustomers(customers: Customer[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  addCustomer(customer: Customer): Customer {
    const customers = this.getCustomers();
    const newCustomer = {
      ...customer,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    customers.push(newCustomer);
    this.saveCustomers(customers);
    return newCustomer;
  },

  updateCustomer(id: string, customer: Partial<Customer>): Customer | null {
    const customers = this.getCustomers();
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) return null;

    customers[index] = {
      ...customers[index],
      ...customer,
      updated_at: new Date().toISOString(),
    };
    this.saveCustomers(customers);
    return customers[index];
  },

  deleteCustomer(id: string): boolean {
    const customers = this.getCustomers();
    const filtered = customers.filter(c => c.id !== id);
    if (filtered.length === customers.length) return false;
    this.saveCustomers(filtered);
    return true;
  },
};
