import mongoose, { Document, Schema } from 'mongoose';

export interface IProtein extends Document {
  name: string;
  uniprotId: string;
  pathway: 'HR' | 'NHEJ' | 'MR';
  description: string;
  function: string;
  interactions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProteinSchema = new Schema<IProtein>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    uniprotId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    pathway: {
      type: String,
      required: true,
      enum: ['HR', 'NHEJ', 'MR'],
    },
    description: {
      type: String,
      required: true,
    },
    function: {
      type: String,
      required: true,
    },
    interactions: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

export const Protein = mongoose.model<IProtein>('Protein', ProteinSchema); 