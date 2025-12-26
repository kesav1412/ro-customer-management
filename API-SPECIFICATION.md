# Backend API Specification

## Base URL
```
Production: https://api.yourdomain.com/api
Development: http://localhost:3000/api
```

## Authentication
```
Header: Authorization: Bearer {token}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": ["Error detail 1", "Error detail 2"]
  }
}
```

## Endpoints

### 1. Get All Customers
**GET** `/customers`

Query Parameters:
- `search` (string, optional) - Search in name, phone
- `city` (string, optional) - Filter by city
- `street` (string, optional) - Filter by street
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": "uuid-123",
        "name": "John Doe",
        "phone1": "1234567890",
        "phone2": "0987654321",
        "street": "Main Street",
        "city": "Mumbai",
        "pincode": "400001",
        "purchase_date": "2024-01-15",
        "installation_date": "2024-01-20",
        "ro_model": "Kent Grand Plus",
        "created_at": "2024-01-20T10:00:00Z",
        "updated_at": "2024-01-20T10:00:00Z"
      }
    ],
    "total": 150,
    "page": 1,
    "limit": 20
  }
}
```

### 2. Get Single Customer
**GET** `/customers/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "name": "John Doe",
    ...
  }
}
```

### 3. Create Customer
**POST** `/customers`

**Request Body:**
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

**Validation Rules:**
- `name`: required, string, 2-100 characters
- `phone1`: required, string, 10 digits
- `phone2`: optional, string, 10 digits
- `street`: required, string, 2-200 characters
- `city`: required, string, 2-100 characters
- `pincode`: required, string, 6 digits
- `purchase_date`: required, date (YYYY-MM-DD)
- `installation_date`: required, date (YYYY-MM-DD)
- `ro_model`: required, string, 2-100 characters

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "name": "John Doe",
    ...
    "created_at": "2024-01-20T10:00:00Z",
    "updated_at": "2024-01-20T10:00:00Z"
  },
  "message": "Customer created successfully"
}
```

### 4. Update Customer
**PUT** `/customers/:id`

**Request Body:** (all fields optional)
```json
{
  "name": "John Doe Updated",
  "phone1": "9876543210",
  ...
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    ...
    "updated_at": "2024-01-21T11:00:00Z"
  },
  "message": "Customer updated successfully"
}
```

### 5. Delete Customer
**DELETE** `/customers/:id`

**Response:**
```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 408 | Request Timeout |
| 500 | Internal Server Error |

## CORS Configuration

Allow these headers:
```
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Database Schema

### customers table
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  phone1 VARCHAR(15) NOT NULL,
  phone2 VARCHAR(15),
  street VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  purchase_date DATE NOT NULL,
  installation_date DATE NOT NULL,
  ro_model VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_customers_city ON customers(city);
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_customers_phone1 ON customers(phone1);
```

## Sample Backend Implementation

### Node.js + Express + PostgreSQL

```javascript
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(cors());
app.use(express.json());

// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const { search, city, street, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM customers WHERE 1=1';
    const params = [];
    let paramCount = 1;
    
    if (search) {
      query += ` AND (name ILIKE $${paramCount} OR phone1 LIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }
    
    if (city) {
      query += ` AND city = $${paramCount}`;
      params.push(city);
      paramCount++;
    }
    
    if (street) {
      query += ` AND street = $${paramCount}`;
      params.push(street);
      paramCount++;
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    const countResult = await pool.query('SELECT COUNT(*) FROM customers');
    
    res.json({
      success: true,
      data: {
        customers: result.rows,
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create customer
app.post('/api/customers', async (req, res) => {
  try {
    const {
      name, phone1, phone2, street, city, pincode,
      purchase_date, installation_date, ro_model
    } = req.body;
    
    // Validation
    if (!name || !phone1 || !street || !city || !pincode || 
        !purchase_date || !installation_date || !ro_model) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    const result = await pool.query(
      `INSERT INTO customers (name, phone1, phone2, street, city, pincode, 
       purchase_date, installation_date, ro_model)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, phone1, phone2, street, city, pincode, 
       purchase_date, installation_date, ro_model]
    );
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Customer created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update customer
app.put('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 2}`);
    const values = Object.values(updates);
    
    const result = await pool.query(
      `UPDATE customers SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Customer updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete customer
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM customers WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Testing

### cURL Examples

```bash
# Get all customers
curl http://localhost:3000/api/customers

# Search customers
curl "http://localhost:3000/api/customers?search=john&city=Mumbai"

# Create customer
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone1": "1234567890",
    "street": "Main Street",
    "city": "Mumbai",
    "pincode": "400001",
    "purchase_date": "2024-01-15",
    "installation_date": "2024-01-20",
    "ro_model": "Kent Grand Plus"
  }'

# Update customer
curl -X PUT http://localhost:3000/api/customers/uuid-123 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe Updated"}'

# Delete customer
curl -X DELETE http://localhost:3000/api/customers/uuid-123
```

## Deployment Checklist

- [ ] Database setup and migrations
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] API endpoints tested
- [ ] Error handling implemented
- [ ] Validation rules enforced
- [ ] SSL/HTTPS enabled
- [ ] Rate limiting configured
- [ ] Logging setup
- [ ] Monitoring enabled

---

This specification provides everything needed to build a compatible backend API for your application.
