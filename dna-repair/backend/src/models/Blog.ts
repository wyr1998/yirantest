import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishDate: Date;
  tags: string[];
  category: string;
  isAdminOnly: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    category: {
      type: String,
      required: true,
      enum: ['DNA-Repair', 'Research', 'General'],
      default: 'General',
    },
    isAdminOnly: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Blog = mongoose.model<IBlog>('Blog', BlogSchema); 