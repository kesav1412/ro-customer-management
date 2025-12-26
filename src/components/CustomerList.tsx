import { Customer } from '@/lib/supabase';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Chip,
  Box,
  Grid,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { format, addMonths, isBefore } from 'date-fns';

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export function CustomerList({ customers, onEdit, onDelete }: CustomerListProps) {
  const getNextServiceDate = (installationDate: string) => {
    return addMonths(new Date(installationDate), 3);
  };

  const isOverdue = (installationDate: string) => {
    const nextService = getNextServiceDate(installationDate);
    return isBefore(nextService, new Date());
  };

  if (customers.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 12, color: 'text.secondary' }}>
        <Typography variant="body1">
          No customers found. Add your first customer to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {customers.map((customer) => {
        const nextService = getNextServiceDate(customer.installation_date);
        const overdue = isOverdue(customer.installation_date);

        return (
          <Grid item xs={12} sm={6} lg={4} key={customer.id}>
            <Card sx={{ height: '100%', transition: 'all 0.3s' }}>
              <CardHeader
                title={
                  <Typography variant="h6" color="primary" fontWeight={600}>
                    {customer.name}
                  </Typography>
                }
                action={
                  <Box>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onEdit(customer)}
                      sx={{ mr: 0.5 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(customer.id!)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                }
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon fontSize="small" color="primary" />
                    <Typography variant="body2">
                      {customer.phone1}
                      {customer.phone2 && (
                        <Typography component="span" variant="body2" color="text.secondary">
                          {' '}/ {customer.phone2}
                        </Typography>
                      )}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon fontSize="small" color="primary" />
                    <Typography variant="body2">
                      {customer.street}, {customer.city} - {customer.pincode}
                    </Typography>
                  </Box>

                  <Box sx={{ pt: 1, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                      RO Model
                    </Typography>
                    <Chip
                      label={customer.ro_model}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        Next Service:
                      </Typography>
                    </Box>
                    <Chip
                      label={format(nextService, 'dd MMM yyyy')}
                      size="small"
                      color={overdue ? 'error' : 'success'}
                      variant="filled"
                    />
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ pt: 0.5 }}>
                    Installed: {format(new Date(customer.installation_date), 'dd MMM yyyy')}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
