#!/bin/bash

echo "Setting up secure authentication system..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file from example..."
    cp env.example .env
    echo "Please edit .env file and set your secure credentials before continuing!"
    echo "Required variables:"
    echo "  - JWT_SECRET (change to a strong secret)"
    echo "  - ADMIN_PASSWORD (set your admin password)"
    echo ""
    echo "After editing .env, run this script again."
    exit 1
fi

# Install backend dependencies
echo "Installing backend dependencies..."
cd dna-repair/backend
npm install

# Build the backend
echo "Building backend..."
npm run build

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../../main-frontend
npm install

# Build the frontend
echo "Building frontend..."
npm run build

# Go back to root
cd ..

echo "Setup complete!"
echo ""
echo "To start the application with secure authentication:"
echo "1. Make sure your .env file is configured with secure credentials"
echo "2. Run: docker-compose up --build"
echo "3. Login with the credentials you set in .env"
echo ""
echo "For production deployment, make sure to:"
echo "1. Use strong, unique secrets in .env"
echo "2. Enable HTTPS"
echo "3. Configure proper firewall rules" 