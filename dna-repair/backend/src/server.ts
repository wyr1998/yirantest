import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { proteinRoutes } from './routes/protein.routes';
import proteinPositionRoutes from './routes/proteinPosition.routes';
import { connectDB } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to DNA Repair Knowledge Base API',
    version: '1.0.0',
    endpoints: {
      proteins: {
        base: '/api/proteins',
        methods: {
          GET: 'Get all proteins',
          POST: 'Create a new protein',
          GET_ID: '/api/proteins/:id - Get a specific protein',
          PUT: '/api/proteins/:id - Update a protein',
          DELETE: '/api/proteins/:id - Delete a protein'
        }
      }
    }
  });
});

// Routes
app.use('/proteins', proteinRoutes);
app.use('/protein-positions', proteinPositionRoutes);

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}`);
}); 