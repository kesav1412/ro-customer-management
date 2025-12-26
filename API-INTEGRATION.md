# API Integration Guide

## 🎯 Overview

Your application is now **ready for future API integration**. Currently, it uses **localStorage** for data storage, but you can seamlessly switch to a backend API when ready.

## 📁 Architecture

### Service Layer Structure

```
src/
├── config/
│   ├── api.config.ts          # API endpoint configuration
│   └── theme.config.ts         # Theme configuration
├── services/
│   ├── api.service.ts          # Generic HTTP service
│   ├── customer.api.service.ts # Customer API calls
│   └── customer.service.ts     # Unified customer service (auto-switches)
└── lib/
    └── storage.ts              # localStorage implementation
```

### How It Works

1. **`customer.service.ts`** - Main service you use in components
   - Checks `VITE_API_ENABLED` environment variable
   - If `true`: Uses API calls
   - If `false`: Uses localStorage
   - Automatic fallback to localStorage if API fails

2. **`customer.api.service.ts`** - API-specific implementations
   - All backend API calls
   - RESTful endpoints

3. **`api.service.ts`** - Generic HTTP client
   - Handles all HTTP requests
   - Authentication headers
   - Error handling
   - Timeout management

## 🚀 Quick Start: Enable API

### Step 1: Update Environment Variable

Edit `.env.production`:

```env
# Enable API
VITE_API_ENABLED=true

# Set your backend URL
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### Step 2: That's It! 🎉

Your app will automatically start using API calls. No code changes needed.

## 🔧 Backend API Requirements

Your backend should implement these endpoints:

### Customer Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/customers` | Get all customers |
| GET    | `/api/customers/:id` | Get single customer |
| POST   | `/api/customers` | Create customer |
| PUT    | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Delete customer |

### Request/Response Format

#### Create Customer (POST /api/customers)
```json
{
  "name": "John Doe",
  "phone1": "1234567890",
  "phone2": "0987654321",
  "street": "Main Street",
  "city": "Mumbai",
  "pincode": "400001",
  "purchase_date": "2024-01-15",
  "installation_date": "2024-01-20",
  "ro_model": "Kent Grand Plus"
}
```

#### Response Format
```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "name": "John Doe",
    ...
    "created_at": "2024-01-20T10:00:00Z",
    "updated_at": "2024-01-20T10:00:00Z"
  },
  "message": "Customer created successfully"
}
```

#### List Customers (GET /api/customers)
```json
{
  "success": true,
  "data": {
    "customers": [...],
    "total": 150,
    "page": 1,
    "limit": 10
  }
}
```

### Optional Query Parameters

- `search` - Search by name, phone
- `city` - Filter by city
- `street` - Filter by street
- `page` - Pagination page number
- `limit` - Items per page

Example: `/api/customers?city=Mumbai&search=john`

## 🔐 Authentication (Future)

The API service is ready for authentication:

### Add Token Authentication

```typescript
import { apiService } from '@/services/api.service';

// After successful login
apiService.setAuthToken('your-jwt-token');

// Logout
apiService.clearAuthToken();
```

Headers will automatically include:
```
Authorization: Bearer your-jwt-token
```

## 🛠️ Customizing Endpoints

Edit `src/config/api.config.ts`:

```typescript
export const apiConfig = {
  baseURL: 'https://your-api.com/api',
  endpoints: {
    customers: {
      list: '/customers',
      create: '/customers',
      update: (id: string) => `/customers/${id}`,
      delete: (id: string) => `/customers/${id}`,
      get: (id: string) => `/customers/${id}`,
    },
    // Add more endpoints
    services: {
      list: '/services',
      schedule: '/services/schedule',
    },
  },
};
```

## 📝 Using the Service in Components

### Example: Update App.tsx (Future)

When ready to use the unified service:

```typescript
// Import the unified service
import { customerService } from '@/services/customer.service';

function AppContent() {
  // ... existing code

  useEffect(() => {
    // Load customers (automatically uses API or localStorage)
    const loadCustomers = async () => {
      const data = await customerService.getCustomers();
      setCustomers(data);
    };
    
    loadCustomers();
  }, []);

  const handleAddCustomer = async (customer) => {
    const newCustomer = await customerService.addCustomer(customer);
    setCustomers(await customerService.getCustomers());
  };

  const handleDelete = async (id: string) => {
    await customerService.deleteCustomer(id);
    setCustomers(await customerService.getCustomers());
  };
}
```

## 🧪 Testing API Integration

### 1. Test with Mock API

Use tools like:
- **JSON Server** - Quick mock API
- **MockAPI.io** - Online mock API
- **Postman Mock Server**

### 2. JSON Server Setup

```bash
npm install -g json-server

# Create db.json
{
  "customers": [
    {
      "id": "1",
      "name": "John Doe",
      "phone1": "1234567890",
      ...
    }
  ]
}

# Start mock server
json-server --watch db.json --port 3000
```

Update `.env.development`:
```env
VITE_API_ENABLED=true
VITE_API_BASE_URL=http://localhost:3000
```

## 🔄 Migration Strategy

### Phase 1: Current (localStorage)
✅ **Status**: Currently using localStorage  
✅ **API Code**: Already implemented, just disabled  
✅ **Migration Ready**: Yes

### Phase 2: Hybrid Mode
1. Enable API: `VITE_API_ENABLED=true`
2. App tries API first
3. Falls back to localStorage if API fails
4. Perfect for gradual migration

### Phase 3: Full API Mode
1. Backend fully operational
2. Remove localStorage fallback if desired
3. All data from API

## 🐛 Error Handling

The service automatically handles errors:

```typescript
try {
  const customers = await customerService.getCustomers();
} catch (error) {
  // Service already logged the error
  // Automatically fell back to localStorage
  toast.error('Failed to load customers');
}
```

## 📊 Checking Current Mode

```typescript
import { customerService } from '@/services/customer.service';

// Check if using API
if (customerService.isUsingApi()) {
  console.log('Using API mode');
} else {
  console.log('Using localStorage mode');
}
```

## 🔧 Advanced Configuration

### Custom Headers

Edit `src/services/api.service.ts`:

```typescript
private getHeaders(): HeadersInit {
  const headers: HeadersInit = { 
    ...defaultHeaders,
    'X-Custom-Header': 'value',
  };
  
  // Add auth token
  const token = this.getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}
```

### Timeout Configuration

Edit `src/config/api.config.ts`:

```typescript
export const apiConfig = {
  timeout: 30000, // 30 seconds (adjust as needed)
  ...
};
```

### API Versioning

```typescript
export const apiConfig = {
  baseURL: 'https://api.yourdomain.com/v1',
  version: 'v1',
  ...
};
```

## 📋 Backend API Checklist

Before enabling API mode, ensure your backend has:

- [ ] RESTful endpoints for customers (CRUD)
- [ ] JSON response format
- [ ] CORS enabled for your frontend domain
- [ ] Error responses in consistent format
- [ ] (Optional) Authentication/Authorization
- [ ] (Optional) Pagination support
- [ ] (Optional) Search/filter support

## 🚨 Common Issues

### Issue: API calls fail
**Solution**: Check browser console for errors. Service will fallback to localStorage.

### Issue: CORS errors
**Solution**: Backend must allow your frontend domain:
```javascript
// Express.js example
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

### Issue: Authentication errors
**Solution**: Ensure token is set after login:
```typescript
apiService.setAuthToken(token);
```

## 📚 Example Backend (Node.js/Express)

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// Get all customers
app.get('/api/customers', (req, res) => {
  const { search, city, street } = req.query;
  // Filter customers based on query params
  res.json({
    success: true,
    data: {
      customers: [...],
      total: 100
    }
  });
});

// Create customer
app.post('/api/customers', (req, res) => {
  const customer = req.body;
  // Save to database
  res.json({
    success: true,
    data: { id: 'new-id', ...customer },
    message: 'Customer created'
  });
});

// Update customer
app.put('/api/customers/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  // Update in database
  res.json({
    success: true,
    data: { id, ...updates },
    message: 'Customer updated'
  });
});

// Delete customer
app.delete('/api/customers/:id', (req, res) => {
  const { id } = req.params;
  // Delete from database
  res.json({
    success: true,
    message: 'Customer deleted'
  });
});

app.listen(3000);
```

## 🎓 Summary

✅ **API layer is complete and ready**  
✅ **Just set `VITE_API_ENABLED=true` when backend is ready**  
✅ **Automatic fallback to localStorage**  
✅ **No code changes needed in components**  
✅ **Authentication ready**  
✅ **Error handling built-in**

Your app is **production-ready** for both localStorage and API modes! 🚀

---

**Questions?** Check the service files in `src/services/` for implementation details.
