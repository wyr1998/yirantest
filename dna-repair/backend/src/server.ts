import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { proteinRoutes } from './routes/protein.routes';
import proteinPositionRoutes from './routes/proteinPosition.routes';
import blogRoutes from './routes/blog.routes';
import proteinModificationRoutes from './routes/proteinModification.routes';
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
      },
      proteinModifications: {
        base: '/api/protein-modifications',
        methods: {
          GET: '/api/protein-modifications/protein/:proteinId - Get all modifications for a protein',
          POST: '/api/protein-modifications/protein/:proteinId - Create a new modification',
          PUT: '/api/protein-modifications/:id - Update a modification',
          DELETE: '/api/protein-modifications/:id - Delete a modification'
        }
      },
      blogs: {
        base: '/api/blogs',
        methods: {
          GET: 'Get all blog posts',
          POST: 'Create a new blog post',
          GET_ID: '/api/blogs/:id - Get a specific blog post',
          PUT: '/api/blogs/:id - Update a blog post',
          DELETE: '/api/blogs/:id - Delete a blog post',
          SEARCH: '/api/blogs/search?query=... - Search blog posts',
          CATEGORY: '/api/blogs/category/:category - Get posts by category'
        }
      }
    }
  });
});

// Routes
app.use('/api/proteins', proteinRoutes);
app.use('/api/protein-positions', proteinPositionRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/protein-modifications', proteinModificationRoutes);

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}`);
}); 