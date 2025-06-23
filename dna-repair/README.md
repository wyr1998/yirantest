# DNA Repair Knowledge Base

An interactive web application for visualizing and exploring DNA repair proteins and their interactions.

## Project Structure

```
dna-repair/
├── frontend/           # React frontend application
│   ├── public/        # Static files
│   └── src/           # Source code
│       ├── components/    # React components
│       ├── data/         # Static data (temporary)
│       ├── types/        # TypeScript interfaces
│       └── App.tsx       # Main application component
│
└── backend/           # Node.js/Express backend
    ├── src/           # Source code
    │   ├── models/    # MongoDB models
    │   ├── routes/    # API routes
    │   └── server.ts  # Main server file
    └── package.json   # Backend dependencies
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/dna-repair
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

The frontend will run on http://localhost:3000

## API Endpoints

- `GET /` - API documentation
- `GET /api/proteins` - Get all proteins
- `GET /api/proteins/:id` - Get a specific protein
- `POST /api/proteins` - Create a new protein
- `PUT /api/proteins/:id` - Update a protein
- `DELETE /api/proteins/:id` - Delete a protein

## Technologies Used

### Frontend
- React
- TypeScript
- ReactFlow for network visualization
- Styled Components for styling

### Backend
- Node.js
- Express
- MongoDB
- TypeScript 