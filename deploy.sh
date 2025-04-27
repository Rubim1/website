#!/bin/bash

# Simple GitHub Pages deployment script - no setup required
# Just run: bash deploy.sh

echo "📦 Installing gh-pages package locally..."
npm install gh-pages --save-dev

echo "🔨 Building site for GitHub Pages..."
npx vite build --config vite.github.config.ts

echo "🧾 Creating necessary files for SPA routing..."
touch dist/.nojekyll
cp client/404.html dist/

echo "🚀 Deploying to GitHub Pages..."
npx gh-pages -d dist

echo "✅ Deployment complete! Your site should be available at https://rubim1.github.io/website/"
echo "⏳ Note: It might take a few minutes for GitHub to update the site."