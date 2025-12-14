require('dotenv').config();
const mongoose = require('mongoose');

// Simple connection test
async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('URI:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@'));
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected successfully');
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections:', collections.map(c => c.name));
    
    // Try to insert a test document
    const Sweet = mongoose.model('Sweet', new mongoose.Schema({
      name: String,
      description: String,
      category: String,
      price: Number,
      quantity: Number,
      imageUrl: String
    }));
    
    const testSweet = await Sweet.create({
      name: 'Test Sweet',
      description: 'Testing connection',
      category: 'Test',
      price: 1.99,
      quantity: 10,
      imageUrl: ''
    });
    
    console.log('✅ Created test document:', testSweet._id);
    
    // Clean up test document
    await Sweet.findByIdAndDelete(testSweet._id);
    console.log('✅ Cleaned up test document');
    
    await mongoose.connection.close();
    console.log('✅ Connection test complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

testConnection();
