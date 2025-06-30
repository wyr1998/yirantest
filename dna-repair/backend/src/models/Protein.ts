import mongoose, { Document, Schema } from 'mongoose';

const InteractionSchema = new Schema({
  targetId: {
    type: Schema.Types.ObjectId,
    ref: 'Protein',
    required: true,
  },
  type: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  targetModification: {
    position: { type: String, required: false },
    type: { type: String, required: false },
  }
}, { _id: false });

export interface IProtein extends Document {
  name: string;
  uniprotId: string;
  pathway: 'HR' | 'NHEJ' | 'Both';
  description: string;
  function: string;
  interactions: {
    targetId: mongoose.Types.ObjectId;
    type?: string;
    description?: string;
    targetModification?: {
      position: string;
      type: string;
    };
  }[];
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
      enum: ['HR', 'NHEJ', 'Both'],
    },
    description: {
      type: String,
      required: true,
    },
    function: {
      type: String,
      required: true,
    },
    interactions: [InteractionSchema],
  },
  {
    timestamps: true,
  }
);

export const Protein = mongoose.model<IProtein>('Protein', ProteinSchema); 