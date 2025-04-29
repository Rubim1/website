#!/bin/bash

# Build the client for Cloudflare Pages
echo "Building for Cloudflare Pages deployment..."
npm run build:cloudflare

# Check if build was successful
if [ ! -d "./dist" ]; then
  echo "Error: Build failed. The dist directory was not created."
  exit 1
fi

# Create the necessary files for SPA routing
echo "/* /index.html 200" > ./dist/_redirects
echo '{
  "version": 1,
  "include": ["/*"],
  "exclude": []
}' > ./dist/_routes.json

echo "=========================="
echo "Build completed successfully!"
echo "=========================="
echo ""
echo "To deploy to Cloudflare Pages:"
echo ""
echo "OPTION 1: Direct Upload (Recommended)"
echo "1. Log in to Cloudflare Dashboard at https://dash.cloudflare.com"
echo "2. Go to Pages > Create a project > Direct Upload"
echo "3. Name your project 'class-chat-app' or similar"
echo "4. Upload the entire 'dist' folder"
echo ""
echo "OPTION 2: Command Line (Requires API Token)"
echo "Run: npx wrangler pages deploy dist --project-name=class-chat-app"
echo ""
echo "=========================="