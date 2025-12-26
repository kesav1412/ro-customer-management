import { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Customer } from './lib/supabase';
import { storageService } from './lib/storage';
import { exportToCSV, exportToExcel } from './lib/export';
import { Dashboard } from './components/Dashboard';
import { CustomerForm } from './components/CustomerForm';
import { CustomerList } from './components/CustomerList';
import { SearchFilter } from './components/SearchFilter';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Container,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Brightness4 as MoonIcon,
  Brightness7 as SunIcon,
  FileDownload as DownloadIcon,
  Opacity as DropletsIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedStreet, setSelectedStreet] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const data = storageService.getCustomers();
    setCustomers(data);
  }, []);

  const filteredCustomers = useMemo(() => {
    let filtered = customers;

    if (selectedCity && selectedCity !== 'all') {
      filtered = filtered.filter(customer => customer.city === selectedCity);
    }

    if (selectedStreet && selectedStreet !== 'all') {
      filtered = filtered.filter(customer => customer.street === selectedStreet);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(search) ||
          customer.phone1.includes(search) ||
          customer.phone2?.includes(search) ||
          customer.ro_model.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [customers, searchTerm, selectedCity, selectedStreet]);

  const showToast = (message: string, severity: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddCustomer = (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingCustomer) {
      const updated = storageService.updateCustomer(editingCustomer.id!, customer);
      if (updated) {
        setCustomers(storageService.getCustomers());
        showToast('Customer updated successfully');
      }
      setEditingCustomer(undefined);
    } else {
      storageService.addCustomer(customer);
      setCustomers(storageService.getCustomers());
      showToast('Customer added successfully');
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      storageService.deleteCustomer(id);
      setCustomers(storageService.getCustomers());
      showToast('Customer deleted successfully', 'error');
    }
  };

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setAnchorEl(null);
  };

  const handleExportCSV = () => {
    exportToCSV(filteredCustomers);
    showToast('Data exported to CSV successfully');
    handleExportClose();
  };

  const handleExportExcel = () => {
    exportToExcel(filteredCustomers);
    showToast('Data exported to Excel successfully');
    handleExportClose();
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCustomer(undefined);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Paper
            elevation={0}
            sx={{
              p: 1,
              mr: 2,
              background: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
              borderRadius: 2,
            }}
          >
            <DropletsIcon sx={{ color: 'white' }} />
          </Paper>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div" fontWeight={600}>
              John Aqua Cure System
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Customer & Service Management
            </Typography>
          </Box>
          <IconButton color="inherit" onClick={handleExportClick} sx={{ mr: 1 }}>
            <DownloadIcon />
          </IconButton>
          <IconButton color="inherit" onClick={toggleTheme}>
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Export Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleExportClose}>
        <MenuItem onClick={handleExportCSV}>Export as CSV</MenuItem>
        <MenuItem onClick={handleExportExcel}>Export as Excel</MenuItem>
      </Menu>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 3, mb: 4, flexGrow: 1 }}>
        <Paper elevation={0} sx={{ borderRadius: 2 }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              px: 2,
            }}
          >
            <Tab label="Dashboard" />
            <Tab label="Customers" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Dashboard customers={customers} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { sm: 'flex-end' } }}>
                <Box sx={{ flexGrow: 1, width: '100%' }}>
                  <SearchFilter
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    customers={customers}
                    selectedCity={selectedCity}
                    selectedStreet={selectedStreet}
                    onCityChange={(value) => {
                      setSelectedCity(value);
                      if (value !== selectedCity) {
                        setSelectedStreet('all');
                      }
                    }}
                    onStreetChange={setSelectedStreet}
                  />
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setIsFormOpen(true)}
                  sx={{ flexShrink: 0 }}
                >
                  Add Customer
                </Button>
              </Box>

              <CustomerList
                customers={filteredCustomers}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Box>
          </TabPanel>
        </Paper>
      </Container>

      {/* Customer Form Dialog */}
      <CustomerForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleAddCustomer}
        initialData={editingCustomer}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
