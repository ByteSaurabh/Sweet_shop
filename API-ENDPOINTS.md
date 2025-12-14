# API Endpoints Documentation & Testing

## 🎯 All Functional API Endpoints

### Base URL
```
http://localhost:3000/api
```

---

## 1️⃣ Authentication Endpoints (Public)

### POST /api/auth/register
**Register a new user**

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "675d...",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "user"
  }
}
```

---

### POST /api/auth/login
**Login existing user**

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sweetshop.com",
    "password": "admin123"
  }'
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "675d...",
    "email": "admin@sweetshop.com",
    "fullName": "Admin User",
    "role": "admin"
  }
}
```

---

## 2️⃣ Sweet Viewing Endpoints (Public - No Auth Required)

### GET /api/sweets
**Get all sweets**

**Request:**
```bash
curl http://localhost:3000/api/sweets
```

**Response (200):**
```json
[
  {
    "id": "675d...",
    "name": "Chocolate Truffle",
    "description": "Rich dark chocolate",
    "category": "Chocolate",
    "price": 2.99,
    "quantity": 50,
    "image_url": "https://...",
    "created_at": "2024-12-14T...",
    "updated_at": "2024-12-14T..."
  }
]
```

---

### GET /api/sweets/search
**Search sweets with filters**

**Query Parameters:**
- `name` - Search by name (case-insensitive)
- `category` - Filter by category
- `minPrice` - Minimum price
- `maxPrice` - Maximum price

**Examples:**
```bash
# Search by name
curl "http://localhost:3000/api/sweets/search?name=chocolate"

# Filter by category
curl "http://localhost:3000/api/sweets/search?category=Chocolate"

# Price range
curl "http://localhost:3000/api/sweets/search?minPrice=1&maxPrice=5"

# Combined filters
curl "http://localhost:3000/api/sweets/search?name=truffle&category=Chocolate&minPrice=2&maxPrice=4"
```

**Response (200):** Array of matching sweets

---

### GET /api/sweets/categories
**Get all unique categories**

**Request:**
```bash
curl http://localhost:3000/api/sweets/categories
```

**Response (200):**
```json
["Chocolate", "Gummy", "Caramel", "Mint"]
```

---

## 3️⃣ Sweet Management Endpoints (Protected - Auth Required)

### POST /api/sweets
**Create a new sweet**

**Request:**
```bash
curl -X POST http://localhost:3000/api/sweets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Strawberry Gummy",
    "description": "Chewy strawberry candy",
    "category": "Gummy",
    "price": 1.99,
    "quantity": 100,
    "image_url": "https://..."
  }'
```

**Response (201):**
```json
{
  "id": "675d...",
  "name": "Strawberry Gummy",
  "description": "Chewy strawberry candy",
  "category": "Gummy",
  "price": 1.99,
  "quantity": 100,
  "image_url": "https://...",
  "created_by": "675d...",
  "created_at": "2024-12-14T...",
  "updated_at": "2024-12-14T..."
}
```

---

### PUT /api/sweets/:id
**Update a sweet's details**

**Request:**
```bash
curl -X PUT http://localhost:3000/api/sweets/675d... \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Premium Chocolate Truffle",
    "price": 3.99,
    "quantity": 75
  }'
```

**Response (200):** Updated sweet object

---

### DELETE /api/sweets/:id
**Delete a sweet (Admin Only)**

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/sweets/675d... \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE"
```

**Response (200):**
```json
{
  "message": "Sweet deleted successfully"
}
```

**Error (403):** If not admin
```json
{
  "error": "Access denied. Admin privileges required."
}
```

---

## 4️⃣ Inventory Management Endpoints (Protected)

### POST /api/sweets/:id/purchase
**Purchase a sweet (decreases quantity)**

**Request:**
```bash
curl -X POST http://localhost:3000/api/sweets/675d.../purchase \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "quantity": 5
  }'
```

**Response (200):**
```json
{
  "message": "Purchase successful",
  "totalPrice": 14.95,
  "remainingStock": 45
}
```

**Error (400):** Not enough stock
```json
{
  "error": "Not enough stock available"
}
```

---

### POST /api/sweets/:id/restock
**Restock a sweet (Admin Only - increases quantity)**

**Request:**
```bash
curl -X POST http://localhost:3000/api/sweets/675d.../restock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE" \
  -d '{
    "quantity": 50
  }'
```

**Response (200):**
```json
{
  "message": "Restock successful",
  "newQuantity": 95
}
```

**Error (403):** If not admin
```json
{
  "error": "Access denied. Admin privileges required."
}
```

---

## 🔐 Authentication

For protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Getting a Token:
1. Register: `POST /api/auth/register`
2. Or Login: `POST /api/auth/login`
3. Extract the `token` from response
4. Use in subsequent requests

---

## 🎨 Sweet Data Model

Each sweet has these properties:

```typescript
{
  id: string,              // Unique identifier (MongoDB _id)
  name: string,            // Sweet name (required)
  description: string,     // Description (optional)
  category: string,        // Category (required)
  price: number,           // Price in dollars (required)
  quantity: number,        // Stock quantity (default: 0)
  image_url: string,       // Image URL (optional)
  created_by: string,      // User ID who created it
  created_at: string,      // ISO date string
  updated_at: string       // ISO date string
}
```

---

## 🧪 Testing All Endpoints

### Quick Test Script:
```bash
# Make executable
chmod +x backend/test-endpoints.sh

# Run tests
./backend/test-endpoints.sh
```

### Manual Testing with curl:

**1. Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","fullName":"Test"}'
```

**2. Login & Save Token:**
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sweetshop.com","password":"admin123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo $TOKEN
```

**3. Get All Sweets:**
```bash
curl http://localhost:3000/api/sweets
```

**4. Search Sweets:**
```bash
curl "http://localhost:3000/api/sweets/search?name=chocolate&minPrice=2"
```

**5. Create Sweet:**
```bash
curl -X POST http://localhost:3000/api/sweets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name":"Test Sweet",
    "category":"Test",
    "price":2.99,
    "quantity":50
  }'
```

**6. Purchase Sweet:**
```bash
# Get a sweet ID first
SWEET_ID=$(curl -s http://localhost:3000/api/sweets | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

# Purchase it
curl -X POST "http://localhost:3000/api/sweets/$SWEET_ID/purchase" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"quantity":2}'
```

---

## 📊 Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (not admin) |
| 404 | Not Found |
| 500 | Server Error |

---

## ✅ All Endpoints Summary

| Method | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| POST | /api/auth/register | ❌ | ❌ | Register user |
| POST | /api/auth/login | ❌ | ❌ | Login user |
| GET | /api/sweets | ❌ | ❌ | Get all sweets |
| GET | /api/sweets/search | ❌ | ❌ | Search sweets |
| GET | /api/sweets/categories | ❌ | ❌ | Get categories |
| POST | /api/sweets | ✅ | ❌ | Create sweet |
| PUT | /api/sweets/:id | ✅ | ❌ | Update sweet |
| DELETE | /api/sweets/:id | ✅ | ✅ | Delete sweet |
| POST | /api/sweets/:id/purchase | ✅ | ❌ | Purchase sweet |
| POST | /api/sweets/:id/restock | ✅ | ✅ | Restock sweet |

**Legend:**
- ✅ = Required
- ❌ = Not Required

---

## 🚀 All Endpoints Are Functional!

Every endpoint listed above is:
- ✅ Implemented in the backend
- ✅ Tested and working
- ✅ Connected to MongoDB
- ✅ Using proper authentication
- ✅ With role-based access control
- ✅ Following REST best practices

Start the backend with `npm run dev` and test them! 🎉
