# Sweet Shop API - MongoDB Backend

A Node.js/Express REST API for the Sweet Shop application using MongoDB.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Sweets (Protected - requires authentication)
- `GET /api/sweets` - Get all sweets
- `POST /api/sweets` - Add a new sweet
- `GET /api/sweets/search` - Search sweets by name, category, or price range
- `GET /api/sweets/categories` - Get unique categories
- `PUT /api/sweets/:id` - Update a sweet
- `DELETE /api/sweets/:id` - Delete a sweet (Admin only)

### Inventory (Protected)
- `POST /api/sweets/:id/purchase` - Purchase a sweet (decreases quantity)
- `POST /api/sweets/:id/restock` - Restock a sweet (Admin only)

### Purchases (Protected)
- `GET /api/purchases` - Get user's purchase history

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=3000
   ```

3. Run the server:
   ```bash
   npm start
   ```

## Deploy to Render

1. Push this `backend` folder to a GitHub repository
2. Go to [render.com](https://render.com)
3. Create a new "Web Service"
4. Connect your GitHub repository
5. Set the following:
   - **Root Directory**: `backend` (if in a subfolder)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
7. Deploy!

## Making a User Admin

To make a user an admin, connect to MongoDB and run:
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```
