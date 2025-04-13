#!/bin/bash

# This script will add deploy scripts to your package.json
# Run this script after you've downloaded the project

echo "Adding deployment scripts to package.json..."

# Temp file for sed operations
TMP_FILE="package.json.tmp"

# Add predeploy and deploy scripts to package.json
sed -e '/"db:push": "drizzle-kit push"/a\    "predeploy": "vite build --config vite.github.config.ts",\n    "deploy": "gh-pages -d dist"' package.json > $TMP_FILE
mv $TMP_FILE package.json

echo "Scripts added successfully!"
echo "Now you can run the following commands:"
echo "  npm run dev      - Run the app locally"
echo "  npm run deploy   - Deploy to GitHub Pages"