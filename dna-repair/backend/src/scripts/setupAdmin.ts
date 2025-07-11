import { connectDB } from '../config/database';
import { Admin } from '../models/Admin';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use environment variables with fallbacks for development
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dna-repair';
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';

// Set environment variables if not already set
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = MONGODB_URI;
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = JWT_SECRET;
}

const setupAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.username);
      process.exit(0);
    }

    // Get admin credentials from environment variables with defaults
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123'; // 默认密码
    const email = process.env.ADMIN_EMAIL || 'admin@yiranest.cloud';

    // Create initial admin
    const admin = new Admin({
      username,
      password, // This will be hashed automatically
      email,
      role: 'super_admin'
    });

    await admin.save();
    console.log('Admin created successfully:', admin.username);
    console.log('Default credentials:');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('IMPORTANT: Please change the password after first login!');
    console.log('You can use the "Change Password" feature in the admin dashboard.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error setting up admin:', error);
    process.exit(1);
  }
};

setupAdmin(); 