import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      console.log(`📧 Email: ${existingAdmin.email}`);
      process.exit(0);
    }
    
    // Create new admin
    const admin = await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('═══════════════════════════════════');
    console.log(`📧 Email:    ${admin.email}`);
    console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD}`);
    console.log('═══════════════════════════════════');
    console.log('⚠️  Remember to change the password in production!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
