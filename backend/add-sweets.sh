#!/bin/bash

# Add sweets via API
# Make sure backend is running first: npm run dev

TOKEN=""

echo "Creating sweets via API..."
echo "Make sure the backend is running (npm run dev)"
echo ""

# First, we need to login or register to get a token
echo "Step 1: Register/Login to get token"
echo "Please run this in another terminal if you haven't:"
echo "  cd backend && npm run dev"
echo ""
echo "Then register a user through the frontend at http://localhost:8080"
echo ""
echo "After logging in, check localStorage for the token:"
echo "  Open DevTools > Application > Local Storage > token"
echo ""
echo "Then run the API calls manually:"
echo ""

# Sample sweets data
cat << 'EOF'
curl -X POST http://localhost:3000/api/sweets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Chocolate Truffle",
    "description": "Rich dark chocolate truffle with cocoa dusting",
    "category": "Chocolate",
    "price": 2.99,
    "quantity": 50,
    "image_url": "https://images.unsplash.com/photo-1511381939415-e44015466834"
  }'

curl -X POST http://localhost:3000/api/sweets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Strawberry Gummy",
    "description": "Chewy strawberry-flavored gummy candy",
    "category": "Gummy",
    "price": 1.99,
    "quantity": 100,
    "image_url": "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f"
  }'

curl -X POST http://localhost:3000/api/sweets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Caramel Delight",
    "description": "Soft caramel squares wrapped in gold foil",
    "category": "Caramel",
    "price": 3.49,
    "quantity": 75,
    "image_url": "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7"
  }'
EOF
