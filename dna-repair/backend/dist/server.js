"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const protein_routes_1 = require("./routes/protein.routes");
const proteinPosition_routes_1 = __importDefault(require("./routes/proteinPosition.routes"));
const blog_routes_1 = __importDefault(require("./routes/blog.routes"));
const proteinModification_routes_1 = __importDefault(require("./routes/proteinModification.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const database_1 = require("./config/database");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
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
                    POST_SETUP: '/api/auth/setup - Create initial admin (first-time only)'
                }
            },
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
app.use('/api/auth', auth_routes_1.default);
app.use('/api/proteins', protein_routes_1.proteinRoutes);
app.use('/api/protein-positions', proteinPosition_routes_1.default);
app.use('/api/blogs', blog_routes_1.default);
app.use('/api/protein-modifications', proteinModification_routes_1.default);
// Connect to MongoDB
(0, database_1.connectDB)();
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}`);
});
