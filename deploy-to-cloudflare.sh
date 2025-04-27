#!/bin/bash

# Script to deploy the app to Cloudflare Pages
echo "📦 Preparing to deploy to Cloudflare Pages"

# Ensure the script is executable
chmod +x ./deploy-to-cloudflare.sh

# Install dependencies if needed
echo "📥 Installing dependencies..."
npm install

# Build for Cloudflare Pages
echo "🔨 Building for Cloudflare Pages..."
npx vite build --config vite.cloudflare.config.ts

# Success message
echo "✅ Build completed!"
echo "📝 Manual steps to deploy to Cloudflare Pages:"
echo "1. Install Cloudflare Wrangler CLI: npm install -g wrangler"
echo "2. Login to Cloudflare: wrangler login"
echo "3. Create a new Cloudflare Pages project: wrangler pages project create [YOUR-PROJECT-NAME]"
echo "4. Deploy the built files: wrangler pages deploy dist"
echo ""
echo "🔍 Alternatively, you can manually upload the 'dist' folder through the Cloudflare Dashboard:"
echo "1. Go to https://dash.cloudflare.com/"
echo "2. Navigate to Pages > Create a project > Direct upload"
echo "3. Upload the 'dist' folder that was just created"

# Make the script executable
chmod +x ./deploy-to-cloudflare.sh