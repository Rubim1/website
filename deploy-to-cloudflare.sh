#!/bin/bash

# Script to build and deploy to Cloudflare Pages

echo "Building for Cloudflare Pages deployment..."
NODE_ENV=production vite build --config vite.cloudflare.config.ts

echo "Deployment build created in /dist directory"
echo ""
echo "To deploy to Cloudflare Pages, run:"
echo "wrangler pages deploy dist"
echo ""
echo "Or log into the Cloudflare Dashboard and use the Direct Upload option"
echo "https://dash.cloudflare.com/"