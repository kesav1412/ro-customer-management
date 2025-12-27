import { Service } from '../lib/supabase';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Box,
} from '@mui/material';
import {
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Build as BuildIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useMemo } from 'react';

interface ServiceFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  services: Service[];
  selectedCity: string;
  selectedStreet: string;
  selectedServiceType: string;
  selectedStatus: string;
  selectedDate: string;
  onCityChange: (value: string) => void;
  onStreetChange: (value: string) => void;
  onServiceTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDateChange: (value: string) => void;
}

export function ServiceFilter({
  searchTerm,
  onSearchChange,
  services,
  selectedCity,
  selectedStreet,
  selectedServiceType,
  selectedStatus,
  selectedDate,
  onCityChange,
  onStreetChange,
  onServiceTypeChange,
  onStatusChange,
  onDateChange,
}: ServiceFilterProps) {
  
  // Get unique cities
  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(services.map(s => s.customer_city)));
    return uniqueCities.sort();
  }, [services]);

  // Get unique streets based on selected city
  const streets = useMemo(() => {
    if (!selectedCity || selectedCity === 'all') {
      return Array.from(new Set(services.map(s => s.customer_street))).sort();
    }
    const filteredServices = services.filter(s => s.customer_city === selectedCity);
    return Array.from(new Set(filteredServices.map(s => s.customer_street))).sort();
  }, [services, selectedCity]);

  // Get unique dates
  const dates = useMemo(() => {
    const uniqueDates = Array.from(new Set(services.map(s => s.service_date)));
    return uniqueDates.sort();
  }, [services]);

  const serviceTypes = ['maintenance', 'repair', 'installation', 'filter_change'];
  const statuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {/* Search */}
      <Box sx={{ width: { xs: '100%', md: 'calc(50% - 8px)' } }}>
        <TextField
          fullWidth
          placeholder="Search by customer name, phone, or technician..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Date Filter */}
      <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' } }}>
        <FormControl fullWidth>
          <InputLabel>Service Date</InputLabel>
          <Select
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            label="Service Date"
            startAdornment={
              <InputAdornment position="start">
                <CalendarIcon fontSize="small" />
              </InputAdornment>
            }
          >
            <MenuItem value="all">All Dates</MenuItem>
            {dates.map((date) => (
              <MenuItem key={date} value={date}>
                {new Date(date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Service Type Filter */}
      <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' } }}>
        <FormControl fullWidth>
          <InputLabel>Service Type</InputLabel>
          <Select
            value={selectedServiceType}
            onChange={(e) => onServiceTypeChange(e.target.value)}
            label="Service Type"
            startAdornment={
              <InputAdornment position="start">
                <BuildIcon fontSize="small" />
              </InputAdornment>
            }
          >
            <MenuItem value="all">All Types</MenuItem>
            {serviceTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* City Filter */}
      <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' } }}>
        <FormControl fullWidth>
          <InputLabel>City</InputLabel>
          <Select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            label="City"
            startAdornment={
              <InputAdornment position="start">
                <LocationIcon fontSize="small" />
              </InputAdornment>
            }
          >
            <MenuItem value="all">All Cities</MenuItem>
            {cities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Street Filter */}
      <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' } }}>
        <FormControl fullWidth disabled={!selectedCity || selectedCity === 'all'}>
          <InputLabel>Street</InputLabel>
          <Select
            value={selectedStreet}
            onChange={(e) => onStreetChange(e.target.value)}
            label="Street"
            startAdornment={
              <InputAdornment position="start">
                <LocationIcon fontSize="small" />
              </InputAdornment>
            }
          >
            <MenuItem value="all">All Streets</MenuItem>
            {streets.map((street) => (
              <MenuItem key={street} value={street}>
                {street}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Status Filter */}
      <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' } }}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            label="Status"
          >
            <MenuItem value="all">All Statuses</MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
