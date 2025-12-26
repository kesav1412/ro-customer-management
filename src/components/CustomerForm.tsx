import { useState, useEffect } from 'react';
import { Customer } from '@/lib/supabase';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
} from '@mui/material';

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => void;
  initialData?: Customer;
}

export function CustomerForm({ open, onClose, onSubmit, initialData }: CustomerFormProps) {
  const [formData, setFormData] = useState<Omit<Customer, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    phone1: '',
    phone2: '',
    street: '',
    city: '',
    pincode: '',
    purchase_date: '',
    installation_date: '',
    ro_model: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        phone1: initialData.phone1 || '',
        phone2: initialData.phone2 || '',
        street: initialData.street || '',
        city: initialData.city || '',
        pincode: initialData.pincode || '',
        purchase_date: initialData.purchase_date || '',
        installation_date: initialData.installation_date || '',
        ro_model: initialData.ro_model || '',
      });
    } else {
      setFormData({
        name: '',
        phone1: '',
        phone2: '',
        street: '',
        city: '',
        pincode: '',
        purchase_date: '',
        installation_date: '',
        ro_model: '',
      });
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ color: 'primary.main', fontWeight: 600 }}>
        {initialData ? 'Edit Customer' : 'Add New Customer'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Primary Phone"
                  type="tel"
                  value={formData.phone1}
                  onChange={(e) => handleChange('phone1', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Secondary Phone"
                  type="tel"
                  value={formData.phone2}
                  onChange={(e) => handleChange('phone2', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Street Address"
                  value={formData.street}
                  onChange={(e) => handleChange('street', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pincode"
                  value={formData.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Purchase Date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) => handleChange('purchase_date', e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Installation Date"
                  type="date"
                  value={formData.installation_date}
                  onChange={(e) => handleChange('installation_date', e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="RO Model"
                  value={formData.ro_model}
                  onChange={(e) => handleChange('ro_model', e.target.value)}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Update' : 'Add'} Customer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
