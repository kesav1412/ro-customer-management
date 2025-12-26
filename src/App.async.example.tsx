/**
 * EXAMPLE: App.tsx with Async Customer Service
 * 
 * This is an example showing how to update your App.tsx
 * to use the new unified customer service that supports both
 * localStorage and API.
 * 
 * WHEN TO USE THIS:
 * - When you want to enable API integration
 * - When you need async data loading
 * - When you need better error handling
 * 
 * CURRENT STATUS:
 * - Your app currently uses storageService directly (synchronous)
 * - This example shows the async version (API-ready)
 * - Both approaches work! Use this when ready for API.
 */

import { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Customer } from './lib/supabase';
import { customerService } from './services/customer.service'; // NEW: Use unified service
import { exportToCSV, exportToExcel } from './lib/export';
import { Dashboard } from './components/Dashboard';
import { CustomerForm } from './components/CustomerForm';
import { CustomerList } from './components/CustomerList';
import { SearchFilter } from './components/SearchFilter';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { useToast } from './hooks/use-toast';
import { Toaster } from './components/ui/toaster';
import {
  Plus,
  Sun,
  Moon,
  Download,
  Droplets,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedStreet, setSelectedStreet] = useState('all');
  const [loading, setLoading] = useState(true); // NEW: Loading state

  // NEW: Async data loading
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const data = await customerService.getCustomers();
        setCustomers(data);
      } catch (error) {
        toast({
          title: 'Error loading customers',
          description: 'Failed to load customer data. Please try again.',
          variant: 'destructive',
        });
        console.error('Failed to load customers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [toast]);

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

  // NEW: Async add customer
  const handleAddCustomer = async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingCustomer) {
        await customerService.updateCustomer(editingCustomer.id!, customer);
        toast({
          title: 'Customer updated',
          description: 'Customer information has been updated successfully.',
        });
      } else {
        await customerService.addCustomer(customer);
        toast({
          title: 'Customer added',
          description: 'New customer has been added successfully.',
        });
      }
      
      // Reload customers
      const data = await customerService.getCustomers();
      setCustomers(data);
      setEditingCustomer(undefined);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save customer. Please try again.',
        variant: 'destructive',
      });
      console.error('Failed to save customer:', error);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  // NEW: Async delete customer
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.deleteCustomer(id);
        const data = await customerService.getCustomers();
        setCustomers(data);
        toast({
          title: 'Customer deleted',
          description: 'Customer has been removed successfully.',
          variant: 'destructive',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete customer. Please try again.',
          variant: 'destructive',
        });
        console.error('Failed to delete customer:', error);
      }
    }
  };

  const handleExportCSV = () => {
    exportToCSV(filteredCustomers);
    toast({
      title: 'Export successful',
      description: 'Customer data exported to CSV file.',
    });
  };

  const handleExportExcel = () => {
    exportToExcel(filteredCustomers);
    toast({
      title: 'Export successful',
      description: 'Customer data exported to Excel file.',
    });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCustomer(undefined);
  };

  // NEW: Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-muted-foreground">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Rest of your component remains the same */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        {/* ... existing header code ... */}
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-orange-100 dark:bg-orange-950">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
            >
              Customers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard customers={customers} />
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between">
                <div className="flex-1 w-full">
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
                </div>
                <Button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto shrink-0"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            </div>

            <CustomerList
              customers={filteredCustomers}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TabsContent>
        </Tabs>
      </main>

      <CustomerForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleAddCustomer}
        initialData={editingCustomer}
      />

      <Toaster />
    </div>
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
