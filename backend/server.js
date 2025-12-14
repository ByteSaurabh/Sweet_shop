require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const sweetsRoutes = require('./routes/sweets');
const purchasesRoutes = require('./routes/purchases');

const app = express();

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority'
    });
    console.log('✅ Connected to MongoDB successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Please check your MONGODB_URI in the .env file');
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);
app.use('/api/purchases', purchasesRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Sweet Shop API is running!',
    endpoints: {
      auth: ['POST /api/auth/register', 'POST /api/auth/login'],
      sweets: ['GET /api/sweets', 'POST /api/sweets', 'GET /api/sweets/search', 'PUT /api/sweets/:id', 'DELETE /api/sweets/:id'],
      inventory: ['POST /api/sweets/:id/purchase', 'POST /api/sweets/:id/restock'],
      purchases: ['GET /api/purchases']
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
