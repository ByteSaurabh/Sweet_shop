const mongoose = require('mongoose');
const Sweet = require('./models/Sweet');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Sample data to seed the database
const sampleSweets = [
  {
    name: 'Chocolate Truffle',
    description: 'Rich dark chocolate truffle with cocoa dusting',
    category: 'Chocolate',
    price: 2.99,
    quantity: 50,
    imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834'
  },
  {
    name: 'Strawberry Gummy',
    description: 'Chewy strawberry-flavored gummy candy',
    category: 'Gummy',
    price: 1.99,
    quantity: 100,
    imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f'
  },
  {
    name: 'Caramel Delight',
    description: 'Soft caramel squares wrapped in gold foil',
    category: 'Caramel',
    price: 3.49,
    quantity: 75,
    imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7'
  },
  {
    name: 'Mint Chocolate',
    description: 'Refreshing mint chocolate squares',
    category: 'Chocolate',
    price: 2.79,
    quantity: 60,
    imageUrl: 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2'
  },
  {
    name: 'Fruit Jellies',
    description: 'Assorted fruit-flavored jelly candies',
    category: 'Gummy',
    price: 1.49,
    quantity: 120,
    imageUrl: 'https://images.unsplash.com/photo-1581798459219-c8f585e3fc10'
  }
];

async function seedDatabase() {
  try {
    require('dotenv').config();
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Sweet.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@sweetshop.com',
      password: 'admin123',
      fullName: 'Admin User',
      role: 'admin'
    });
    console.log('👤 Created admin user (admin@sweetshop.com / admin123)');

    // Create regular user
    const regularUser = await User.create({
      email: 'user@sweetshop.com',
      password: 'user123',
      fullName: 'Regular User',
      role: 'user'
    });
    console.log('👤 Created regular user (user@sweetshop.com / user123)');

    // Add sweets
    const sweets = await Sweet.insertMany(
      sampleSweets.map(sweet => ({ ...sweet, createdBy: adminUser._id }))
    );
    console.log(`🍬 Added ${sweets.length} sample sweets`);

    console.log('\n✨ Database seeded successfully!');
    console.log('\n📝 Test accounts:');
    console.log('   Admin: admin@sweetshop.com / admin123');
    console.log('   User:  user@sweetshop.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedDatabase();
