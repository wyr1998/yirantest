import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { proteinRoutes } from './routes/protein.routes';
import proteinPositionRoutes from './routes/proteinPosition.routes';
import blogRoutes from './routes/blog.routes';
import proteinModificationRoutes from './routes/proteinModification.routes';
import authRoutes from './routes/auth.routes';
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
      auth: {
        base: '/api/auth',
        methods: {
          POST_LOGIN: '/api/auth/login - Admin login',
          GET_VERIFY: '/api/auth/verify - Verify token',
          POST_LOGOUT: '/api/auth/logout - Logout',
          POST_SETUP: '/api/auth/setup - Create initial admin (first-time only)',
          POST_CHANGE_PASSWORD: '/api/auth/change-password - Change admin password (requires auth)'
        }
      },
      proteins: {
        base: '/api/proteins',
        methods: {
          GET: 'Get all proteins (public)',
          POST: 'Create a new protein (admin only)',
          GET_ID: '/api/proteins/:id - Get a specific protein (public)',
          PUT: '/api/proteins/:id - Update a protein (admin only)',
          DELETE: '/api/proteins/:id - Delete a protein (admin only)',
          GET_PATHWAY: '/api/proteins/pathway/:pathway - Get proteins by pathway (public)'
        }
      },
      proteinModifications: {
        base: '/api/protein-modifications',
        methods: {
          GET: '/api/protein-modifications/protein/:proteinId - Get all modifications for a protein (public)',
          POST: '/api/protein-modifications/protein/:proteinId - Create a new modification (admin only)',
          PUT: '/api/protein-modifications/:id - Update a modification (admin only)',
          DELETE: '/api/protein-modifications/:id - Delete a modification (admin only)'
        }
      },
      proteinPositions: {
        base: '/api/protein-positions',
        methods: {
          GET: '/api/protein-positions/:pathway - Get protein positions for a pathway (public)',
          POST: '/api/protein-positions/:pathway - Save protein positions for a pathway (admin only)',
          PUT: '/api/protein-positions/:pathway/:proteinId - Update a single protein position (admin only)',
          DELETE: '/api/protein-positions/:pathway/reset - Reset all positions for a pathway (admin only)'
        }
      },
      blogs: {
        base: '/api/blogs',
        methods: {
          GET: 'Get all blog posts (public)',
          POST: 'Create a new blog post (admin only)',
          GET_ID: '/api/blogs/:id - Get a specific blog post (public)',
          PUT: '/api/blogs/:id - Update a blog post (admin only)',
          DELETE: '/api/blogs/:id - Delete a blog post (admin only)',
          SEARCH: '/api/blogs/search?query=... - Search blog posts (public)',
          CATEGORY: '/api/blogs/category/:category - Get posts by category (public)'
        }
      }
    },
    security: {
      note: 'Admin endpoints require JWT token in Authorization header: Bearer <token>',
      public_endpoints: 'GET requests for viewing data are public',
      admin_endpoints: 'POST, PUT, DELETE requests require admin authentication'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
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