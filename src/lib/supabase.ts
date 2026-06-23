import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Customer {
  id: string;
  customer_id: string;
  name: string;
  phone1: string;
  phone2: string;
  street: string;
  city: string;
  pincode: string;
  purchase_date: string;
  installation_date: string;
  ro_model: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id?: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_street: string;
  customer_city: string;
  service_date: string;
  service_type: 'maintenance' | 'repair' | 'installation' | 'filter_change';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  technician?: string;
  created_at?: string;
  updated_at?: string;
}
