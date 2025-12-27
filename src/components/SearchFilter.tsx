import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Box,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { Customer } from '@/lib/supabase';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  customers: Customer[];
  selectedCity: string;
  selectedStreet: string;
  onCityChange: (value: string) => void;
  onStreetChange: (value: string) => void;
}

export function SearchFilter({ 
  searchTerm, 
  onSearchChange, 
  customers,
  selectedCity,
  selectedStreet,
  onCityChange,
  onStreetChange,
}: SearchFilterProps) {
  // Get unique cities from customers
  const uniqueCities = Array.from(new Set(customers.map(c => c.city))).sort();
  
  // Get streets filtered by selected city
  const uniqueStreets = Array.from(
    new Set(
      customers
        .filter(c => !selectedCity || selectedCity === 'all' || c.city === selectedCity)
        .map(c => c.street)
    )
  ).sort();

  return (
    <Box sx={{ width: '100%' }}>
      {/* Search Input */}
      <TextField
        fullWidth
        placeholder="Search by name, phone, or RO model..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      {/* Filter Dropdowns */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {/* City Dropdown */}
        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 8px)' } }}>
          <FormControl fullWidth>
            <InputLabel>Filter by City</InputLabel>
            <Select
              value={selectedCity}
              label="Filter by City"
              onChange={(e) => onCityChange(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <LocationIcon color="action" fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="all">All Cities</MenuItem>
              {uniqueCities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Street Dropdown */}
        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 8px)' } }}>
          <FormControl fullWidth>
            <InputLabel>Filter by Street</InputLabel>
            <Select
              value={selectedStreet}
              label="Filter by Street"
              onChange={(e) => onStreetChange(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <LocationIcon color="action" fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="all">All Streets</MenuItem>
              {uniqueStreets.map((street) => (
                <MenuItem key={street} value={street}>
                  {street}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
}
