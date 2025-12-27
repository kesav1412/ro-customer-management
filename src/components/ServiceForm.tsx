import { useState, useEffect } from 'react';
import { Service, Customer } from '../lib/supabase';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Box,
} from '@mui/material';

interface ServiceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => void;
  initialData?: Service;
  customers: Customer[];
}

export function ServiceForm({ open, onClose, onSubmit, initialData, customers }: ServiceFormProps) {
  const [formData, setFormData] = useState<Omit<Service, 'id' | 'created_at' | 'updated_at'>>({
    customer_id: '',
    customer_name: '',
    customer_phone: '',
    customer_street: '',
    customer_city: '',
    service_date: new Date().toISOString().split('T')[0],
    service_type: 'maintenance',
    status: 'scheduled',
    notes: '',
    technician: '',
  });

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        customer_id: initialData.customer_id,
        customer_name: initialData.customer_name,
        customer_phone: initialData.customer_phone,
        customer_street: initialData.customer_street,
        customer_city: initialData.customer_city,
        service_date: initialData.service_date,
        service_type: initialData.service_type,
        status: initialData.status,
        notes: initialData.notes || '',
        technician: initialData.technician || '',
      });
      // Find and set the customer
      const customer = customers.find(c => c.id === initialData.customer_id);
      if (customer) {
        setSelectedCustomer(customer);
      }
    } else {
      setFormData({
        customer_id: '',
        customer_name: '',
        customer_phone: '',
        customer_street: '',
        customer_city: '',
        service_date: new Date().toISOString().split('T')[0],
        service_type: 'maintenance',
        status: 'scheduled',
        notes: '',
        technician: '',
      });
      setSelectedCustomer(null);
    }
  }, [initialData, open, customers]);

  const handleCustomerSelect = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customer_id: customer.id || '',
        customer_name: customer.name,
        customer_phone: customer.phone1,
        customer_street: customer.street,
        customer_city: customer.city,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        customer_id: '',
        customer_name: '',
        customer_phone: '',
        customer_street: '',
        customer_city: '',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? 'Edit Service' : 'Add New Service'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, mt: 0.5 }}>
            {/* Customer Selection */}
            <Box sx={{ width: '100%' }}>
              <Autocomplete
                value={selectedCustomer}
                onChange={(_, newValue) => handleCustomerSelect(newValue)}
                options={customers}
                getOptionLabel={(option) => `${option.name} - ${option.phone1}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Customer"
                    required
                    placeholder="Search by name or phone"
                  />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Box>

            {/* Service Date */}
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 10px)' } }}>
              <TextField
                fullWidth
                label="Service Date"
                type="date"
                value={formData.service_date}
                onChange={(e) => setFormData({ ...formData, service_date: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            {/* Service Type */}
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 10px)' } }}>
              <FormControl fullWidth required>
                <InputLabel>Service Type</InputLabel>
                <Select
                  value={formData.service_type}
                  onChange={(e) => setFormData({ ...formData, service_type: e.target.value as any })}
                  label="Service Type"
                >
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="repair">Repair</MenuItem>
                  <MenuItem value="installation">Installation</MenuItem>
                  <MenuItem value="filter_change">Filter Change</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Status */}
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 10px)' } }}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  label="Status"
                >
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Technician */}
            <Box sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Technician Name"
                value={formData.technician}
                onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                placeholder="Enter technician name"
              />
            </Box>

            {/* Notes */}
            <Box sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any additional notes or details..."
              />
            </Box>

            {/* Customer Info Display (Read-only) */}
            {selectedCustomer && (
              <Box sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="Customer Address"
                  value={`${formData.customer_street}, ${formData.customer_city}`}
                  disabled
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {initialData ? 'Update' : 'Add'} Service
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
