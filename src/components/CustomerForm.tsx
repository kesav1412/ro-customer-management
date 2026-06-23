import { useState, useEffect } from 'react';
import { Customer } from '@/lib/supabase';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>
  ) => void;
  initialData?: Customer;
}

export function CustomerForm({
  open,
  onClose,
  onSubmit,
  initialData,
}: CustomerFormProps) {
  const [formData, setFormData] = useState<
    Omit<Customer, 'id' | 'created_at' | 'updated_at'>
  >({
    customer_id: '',
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
        customer_id: initialData.customer_id || '',
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
        customer_id: '',
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

  const handleChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ color: 'primary.main', fontWeight: 600 }}>
        {initialData ? 'Edit Customer' : 'Add New Customer'}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
              {/* Customer ID */}
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 10px)' } }}>
                <TextField
                  fullWidth
                  label="Customer ID"
                  value={formData.customer_id}
                  onChange={(e) =>
                    handleChange('customer_id', e.target.value)
                  }
                  required
                />
              </Box>

              {/* Customer Name */}
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 10px)' } }}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  value={formData.name}
                  onChange={(e) =>
                    handleChange('name', e.target.value)
                  }
                  required
                />
              </Box>

              {/* Primary Phone */}
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 10px)' } }}>
                <TextField
                  fullWidth
                  label="Primary Phone"
                  type="tel"
                  value={formData.phone1}
                  onChange={(e) =>
                    handleChange('phone1', e.target.value)
                  }
                  required
                />
              </Box>

              {/* Secondary Phone */}
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 10px)' } }}>
                <TextField
                  fullWidth
                  label="Secondary Phone"
                  type="tel"
                  value={formData.phone2}
                  onChange={(e) =>
                    handleChange('phone2', e.target.value)
                  }
                />
              </Box>

              {/* Street Address */}
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 10px)' } }}>
                <TextField
                  fullWidth
                  label="Street Address"
                  value={formData.street}
                  onChange={(e) =>
                    handleChange('street', e.target.value)
                  }
                  required
                />
              </Box>

              {/* City */}
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 10px)' } }}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={(e) =>
                    handleChange('city', e.target.value)
                  }
                  required
                />
              </Box>

              {/* Pincode */}
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 10px)' } }}>
                <TextField
                  fullWidth
                  label="Pincode"
                  value={formData.pincode}
                  onChange={(e) =>
                    handleChange('pincode', e.target.value)
                  }
                  required
                />
              </Box>

              {/* Purchase Date */}
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 10px)' } }}>
                <TextField
                  fullWidth
                  label="Purchase Date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) =>
                    handleChange('purchase_date', e.target.value)
                  }
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              {/* Installation Date */}
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 10px)' } }}>
                <TextField
                  fullWidth
                  label="Installation Date"
                  type="date"
                  value={formData.installation_date}
                  onChange={(e) =>
                    handleChange('installation_date', e.target.value)
                  }
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              {/* RO Model */}
              <Box sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="RO Model"
                  value={formData.ro_model}
                  onChange={(e) =>
                    handleChange('ro_model', e.target.value)
                  }
                  required
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            {initialData ? 'Update' : 'Add'} Customer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}