#!/bin/bash

# This script will set up and run your project locally
echo "Setting up and running project locally..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run the development server
echo "Starting development server..."
npm run dev

# The script will hang here while the server runs
# Press Ctrl+C to stop the server