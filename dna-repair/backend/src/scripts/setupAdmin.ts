import { connectDB } from '../config/database';
import { Admin } from '../models/Admin';

// Set MongoDB URI for Docker environment
process.env.MONGODB_URI = 'mongodb://admin:password@mongodb:27017/dna-repair?authSource=admin';
process.env.JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';

const setupAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.username);
      process.exit(0);
    }

    // Get admin credentials from environment variables
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD;
    const email = process.env.ADMIN_EMAIL || 'admin@yiranest.cloud';

    if (!password) {
      console.error('ADMIN_PASSWORD environment variable is required');
      console.error('Please set ADMIN_PASSWORD before running this script');
      process.exit(1);
    }

    // Create initial admin
    const admin = new Admin({
      username,
      password, // This will be hashed automatically
      email,
      role: 'super_admin'
    });

    await admin.save();
    console.log('Admin created successfully:', admin.username);
    console.log('You can now login with the credentials you provided');
    console.log('IMPORTANT: Change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error setting up admin:', error);
    process.exit(1);
  }
};

setupAdmin(); 