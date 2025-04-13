#!/bin/bash

# Script to completely wipe GitHub Pages and deploy a fresh version
# Use this if you're having problems with old files causing errors
# Just run: bash clean-deploy.sh

echo "📦 Installing gh-pages package if needed..."
npm install -g gh-pages

echo "🧹 Cleaning gh-pages branch completely..."
gh-pages-clean

echo "🔨 Building site for GitHub Pages..."
npx vite build --config vite.github.config.ts

echo "🧾 Creating necessary files for SPA routing..."
touch dist/.nojekyll
cp client/404.html dist/

echo "🚀 Deploying to GitHub Pages (forcing deletion of old files)..."
gh-pages -d dist --add false

echo "✅ Clean deployment complete! Your site should be available at https://rubim1.github.io/website/"
echo "⏳ Note: It might take a few minutes for GitHub to update the site."