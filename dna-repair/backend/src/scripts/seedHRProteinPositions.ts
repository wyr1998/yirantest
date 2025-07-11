import { connectDB } from '../config/database';
import { ProteinPosition } from '../models/ProteinPosition';
import dotenv from 'dotenv';

dotenv.config();

// Use environment variables with fallbacks for development
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dna-repair';

// Set environment variable if not already set
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = MONGODB_URI;
}

const hrProteinPositions = [
  {
    proteinId: "BRCA1",
    pathway: "HR",
    position: { x: 200, y: 100 }
  },
  {
    proteinId: "BRCA2", 
    pathway: "HR",
    position: { x: 300, y: 150 }
  },
  {
    proteinId: "RAD51",
    pathway: "HR", 
    position: { x: 400, y: 200 }
  },
  {
    proteinId: "MRE11",
    pathway: "HR",
    position: { x: 100, y: 50 }
  },
  {
    proteinId: "RAD50",
    pathway: "HR",
    position: { x: 150, y: 75 }
  },
  {
    proteinId: "NBS1",
    pathway: "HR",
    position: { x: 200, y: 50 }
  },
  {
    proteinId: "ATM",
    pathway: "HR",
    position: { x: 250, y: 75 }
  },
  {
    proteinId: "PALB2",
    pathway: "HR",
    position: { x: 350, y: 125 }
  }
];

const seedProteinPositions = async () => {
  try {
    await connectDB();
    // Clear existing HR protein positions
    await ProteinPosition.deleteMany({ pathway: 'HR' });
    // Insert new protein positions
    await ProteinPosition.insertMany(hrProteinPositions);
    console.log('Successfully seeded HR protein positions');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding protein positions:', error);
    process.exit(1);
  }
};

seedProteinPositions(); 