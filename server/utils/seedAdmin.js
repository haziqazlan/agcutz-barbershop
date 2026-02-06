import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });

    if (existingAdmin) {
      console.log('Admin already exists with email:', process.env.ADMIN_EMAIL);
      process.exit(0);
    }

    // Create new admin
    const admin = await Admin.create({
      email: process.env.ADMIN_EMAIL || 'admin@barbershop.com',
      password: process.env.ADMIN_PASSWORD || 'changeme123',
    });

    console.log('Admin created successfully!');
    console.log('Email:', admin.email);
    console.log('Password:', process.env.ADMIN_PASSWORD || 'changeme123');
    console.log('\n⚠️  IMPORTANT: Change the default password immediately after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
