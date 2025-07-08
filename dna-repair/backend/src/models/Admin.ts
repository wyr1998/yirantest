import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IAdmin extends Document {
  username: string;
  password: string;
  email?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

const adminSchema = new Schema<IAdmin>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin'
  }
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
adminSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
adminSchema.methods.generateAuthToken = function(): string {
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  return jwt.sign(
    { 
      id: this._id, 
      username: this.username, 
      role: this.role 
    },
    secret,
    { expiresIn: '24h' }
  );
};

export const Admin = mongoose.model<IAdmin>('Admin', adminSchema); 