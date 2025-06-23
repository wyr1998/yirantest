import mongoose, { Document, Schema } from 'mongoose';

export interface IProteinPosition extends Document {
  proteinId: string;
  pathway: 'HR' | 'NHEJ';
  position: {
    x: number;
    y: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProteinPositionSchema = new Schema<IProteinPosition>(
  {
    proteinId: {
      type: String,
      required: true,
      trim: true,
    },
    pathway: {
      type: String,
      required: true,
      enum: ['HR', 'NHEJ'],
    },
    position: {
      x: {
        type: Number,
        required: true,
        default: 0,
      },
      y: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique protein per pathway
ProteinPositionSchema.index({ proteinId: 1, pathway: 1 }, { unique: true });

export const ProteinPosition = mongoose.model<IProteinPosition>('ProteinPosition', ProteinPositionSchema); 