import { Service } from './supabase';

const SERVICES_KEY = 'aqua_cure_services';

// Generate demo services for today and upcoming dates
function generateDemoServices(): Service[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  
  return [
    {
      id: '1',
      customer_id: 'c1',
      customer_name: 'Rajesh Kumar',
      customer_phone: '9876543210',
      customer_street: 'MG Road',
      customer_city: 'Bangalore',
      service_date: formatDate(today),
      service_type: 'maintenance',
      status: 'scheduled',
      notes: 'Regular 6-month maintenance check',
      technician: 'Ravi',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      customer_id: 'c2',
      customer_name: 'Priya Sharma',
      customer_phone: '9876543211',
      customer_street: 'Brigade Road',
      customer_city: 'Bangalore',
      service_date: formatDate(today),
      service_type: 'filter_change',
      status: 'in_progress',
      notes: 'Filter replacement due',
      technician: 'Kumar',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      customer_id: 'c3',
      customer_name: 'Amit Patel',
      customer_phone: '9876543212',
      customer_street: 'Koramangala',
      customer_city: 'Bangalore',
      service_date: formatDate(today),
      service_type: 'repair',
      status: 'scheduled',
      notes: 'Water leakage issue',
      technician: 'Ravi',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      customer_id: 'c4',
      customer_name: 'Sunita Reddy',
      customer_phone: '9876543213',
      customer_street: 'Indiranagar',
      customer_city: 'Bangalore',
      service_date: formatDate(tomorrow),
      service_type: 'maintenance',
      status: 'scheduled',
      notes: 'Annual maintenance',
      technician: 'Kumar',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

export const serviceStorage = {
  getServices(): Service[] {
    const stored = localStorage.getItem(SERVICES_KEY);
    if (!stored) {
      const demoServices = generateDemoServices();
      localStorage.setItem(SERVICES_KEY, JSON.stringify(demoServices));
      return demoServices;
    }
    return JSON.parse(stored);
  },

  addService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Service {
    const services = this.getServices();
    const newService: Service = {
      ...service,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    services.push(newService);
    localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
    return newService;
  },

  updateService(id: string, service: Partial<Service>): Service | null {
    const services = this.getServices();
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) return null;

    services[index] = {
      ...services[index],
      ...service,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
    return services[index];
  },

  deleteService(id: string): boolean {
    const services = this.getServices();
    const filtered = services.filter((s) => s.id !== id);
    if (filtered.length === services.length) return false;
    localStorage.setItem(SERVICES_KEY, JSON.stringify(filtered));
    return true;
  },

  getTodayServices(): Service[] {
    const today = new Date().toISOString().split('T')[0];
    return this.getServices().filter(service => service.service_date === today);
  },

  getServicesByCustomer(customerId: string): Service[] {
    return this.getServices().filter(service => service.customer_id === customerId);
  },
};
