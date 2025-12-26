import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Customer, Service } from './lib/supabase';
import { storageService } from './lib/storage';
import { serviceStorage } from './lib/serviceStorage';
import { exportToCSV, exportToExcel, exportToPDF, exportServicesToCSV, exportServicesToExcel, exportServicesToPDF } from './lib/export';
import { Dashboard } from './components/Dashboard';
import { CustomerForm } from './components/CustomerForm';
import { CustomerList } from './components/CustomerList';
import { SearchFilter } from './components/SearchFilter';
import { ServiceForm } from './components/ServiceForm';
import { ServiceList } from './components/ServiceList';
import { ServiceFilter } from './components/ServiceFilter';
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
  Snackbar,
  Alert,
  Paper,
  CircularProgress,
  ButtonGroup,
} from '@mui/material';
import {
  Add as AddIcon,
  Brightness4 as MoonIcon,
  Brightness7 as SunIcon,
  FileDownload as DownloadIcon,
  Opacity as DropletsIcon,
  Logout as LogoutIcon,
  TableChart as TableChartIcon,
  PictureAsPdf as PictureAsPdfIcon,
} from '@mui/icons-material';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();
  const [editingService, setEditingService] = useState<Service | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedStreet, setSelectedStreet] = useState('all');
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [selectedServiceCity, setSelectedServiceCity] = useState('all');
  const [selectedServiceStreet, setSelectedServiceStreet] = useState('all');
  const [selectedServiceType, setSelectedServiceType] = useState('all');
  const [selectedServiceStatus, setSelectedServiceStatus] = useState('all');
  const [selectedServiceDate, setSelectedServiceDate] = useState('all');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (isAuthenticated) {
      const data = storageService.getCustomers();
      setCustomers(data);
      const serviceData = serviceStorage.getServices();
      setServices(serviceData);
    }
  }, [isAuthenticated]);

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

  const filteredServices = useMemo(() => {
    let filtered = services;

    if (selectedServiceDate && selectedServiceDate !== 'all') {
      filtered = filtered.filter(service => service.service_date === selectedServiceDate);
    }

    if (selectedServiceCity && selectedServiceCity !== 'all') {
      filtered = filtered.filter(service => service.customer_city === selectedServiceCity);
    }

    if (selectedServiceStreet && selectedServiceStreet !== 'all') {
      filtered = filtered.filter(service => service.customer_street === selectedServiceStreet);
    }

    if (selectedServiceType && selectedServiceType !== 'all') {
      filtered = filtered.filter(service => service.service_type === selectedServiceType);
    }

    if (selectedServiceStatus && selectedServiceStatus !== 'all') {
      filtered = filtered.filter(service => service.status === selectedServiceStatus);
    }

    if (serviceSearchTerm) {
      const search = serviceSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.customer_name.toLowerCase().includes(search) ||
          service.customer_phone.includes(search) ||
          service.technician?.toLowerCase().includes(search) ||
          service.notes?.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [services, serviceSearchTerm, selectedServiceCity, selectedServiceStreet, selectedServiceType, selectedServiceStatus, selectedServiceDate]);

  const todayServices = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return services.filter(service => service.service_date === today);
  }, [services]);

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

  const handleAddService = (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingService) {
      const updated = serviceStorage.updateService(editingService.id!, service);
      if (updated) {
        setServices(serviceStorage.getServices());
        showToast('Service updated successfully');
      }
      setEditingService(undefined);
    } else {
      serviceStorage.addService(service);
      setServices(serviceStorage.getServices());
      showToast('Service added successfully');
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setIsServiceFormOpen(true);
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      serviceStorage.deleteService(id);
      setServices(serviceStorage.getServices());
      showToast('Service deleted successfully', 'error');
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCustomer(undefined);
  };

  const handleCloseServiceForm = () => {
    setIsServiceFormOpen(false);
    setEditingService(undefined);
  };

  const handleViewTodayServices = () => {
    navigate('/services');
    setSelectedServiceDate(new Date().toISOString().split('T')[0]);
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/dashboard');
  };

  // Get current tab value based on route
  const getCurrentTabValue = () => {
    const path = location.pathname;
    if (path.includes('/customers')) return 1;
    if (path.includes('/services')) return 2;
    return 0; // dashboard
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/dashboard');
        break;
      case 1:
        navigate('/customers');
        break;
      case 2:
        navigate('/services');
        break;
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

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
              Customer & Service Management • {user?.name}
            </Typography>
          </Box>
          <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout} title="Logout">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 3, mb: 4, flexGrow: 1 }}>
        <Paper elevation={0} sx={{ borderRadius: 2 }}>
          <Tabs
            value={getCurrentTabValue()}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              px: 2,
            }}
          >
            <Tab label="Dashboard" />
            <Tab label="Customers" />
            <Tab label="Services" />
          </Tabs>

          <Box sx={{ py: 3 }}>
            <Routes>
              <Route path="/dashboard" element={
                <Dashboard 
                  customers={customers} 
                  todayServices={todayServices}
                  onViewTodayServices={handleViewTodayServices}
                />
              } />
              
              <Route path="/customers" element={
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { sm: 'flex-end' }, flexWrap: 'wrap' }}>
                    <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
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
                    <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                      <ButtonGroup variant="outlined" size="small">
                        <Button
                          startIcon={<TableChartIcon />}
                          onClick={() => {
                            exportToExcel(filteredCustomers);
                            showToast('Customers exported to Excel');
                          }}
                        >
                          Excel
                        </Button>
                        <Button
                          startIcon={<DownloadIcon />}
                          onClick={() => {
                            exportToCSV(filteredCustomers);
                            showToast('Customers exported to CSV');
                          }}
                        >
                          CSV
                        </Button>
                        <Button
                          startIcon={<PictureAsPdfIcon />}
                          onClick={() => {
                            exportToPDF(filteredCustomers);
                            showToast('Customers exported to PDF');
                          }}
                        >
                          PDF
                        </Button>
                      </ButtonGroup>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setIsFormOpen(true)}
                      >
                        Add Customer
                      </Button>
                    </Box>
                  </Box>

                  <CustomerList
                    customers={filteredCustomers}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </Box>
              } />

              <Route path="/services" element={
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { sm: 'flex-end' }, flexWrap: 'wrap' }}>
                    <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
                      <ServiceFilter
                        searchTerm={serviceSearchTerm}
                        onSearchChange={setServiceSearchTerm}
                        services={services}
                        selectedCity={selectedServiceCity}
                        selectedStreet={selectedServiceStreet}
                        selectedServiceType={selectedServiceType}
                        selectedStatus={selectedServiceStatus}
                        selectedDate={selectedServiceDate}
                        onCityChange={(value) => {
                          setSelectedServiceCity(value);
                          if (value !== selectedServiceCity) {
                            setSelectedServiceStreet('all');
                          }
                        }}
                        onStreetChange={setSelectedServiceStreet}
                        onServiceTypeChange={setSelectedServiceType}
                        onStatusChange={setSelectedServiceStatus}
                        onDateChange={setSelectedServiceDate}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                      <ButtonGroup variant="outlined" size="small">
                        <Button
                          startIcon={<TableChartIcon />}
                          onClick={() => {
                            exportServicesToExcel(filteredServices);
                            showToast('Services exported to Excel');
                          }}
                        >
                          Excel
                        </Button>
                        <Button
                          startIcon={<DownloadIcon />}
                          onClick={() => {
                            exportServicesToCSV(filteredServices);
                            showToast('Services exported to CSV');
                          }}
                        >
                          CSV
                        </Button>
                        <Button
                          startIcon={<PictureAsPdfIcon />}
                          onClick={() => {
                            exportServicesToPDF(filteredServices);
                            showToast('Services exported to PDF');
                          }}
                        >
                          PDF
                        </Button>
                      </ButtonGroup>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setIsServiceFormOpen(true)}
                      >
                        Add Service
                      </Button>
                    </Box>
                  </Box>

                  <ServiceList
                    services={filteredServices}
                    onEdit={handleEditService}
                    onDelete={handleDeleteService}
                  />
                </Box>
              } />

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Box>
        </Paper>
      </Container>

      {/* Customer Form Dialog */}
      <CustomerForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleAddCustomer}
        initialData={editingCustomer}
      />

      {/* Service Form Dialog */}
      <ServiceForm
        open={isServiceFormOpen}
        onClose={handleCloseServiceForm}
        onSubmit={handleAddService}
        initialData={editingService}
        customers={customers}
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
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
