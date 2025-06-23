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
app.use('/api/proteins', protein_routes_1.proteinRoutes);
app.use('/api/protein-positions', proteinPosition_routes_1.default);
// Connect to MongoDB
(0, database_1.connectDB)();
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}`);
});
