#!/bin/bash

# This script fixes common GitHub Pages deployment issues
# Run this after you've tried deploying once

echo "🔍 Checking your repository..."

# Install gh-pages locally if it's not already installed
echo "📦 Installing gh-pages package locally..."
npm install gh-pages --save-dev

# Build specifically for GitHub Pages
echo "🔨 Building site for GitHub Pages..."
npx vite build --config vite.github.config.ts

# Make sure the base path in vite.github.config.ts matches your repository name
echo "⚙️ Creating necessary files for GitHub Pages SPA..."

# Create .nojekyll file to disable Jekyll processing
touch dist/.nojekyll

# Create a proper index.html in the root
cp dist/index.html dist/404.html

# Make sure the 404.html has proper SPA redirect code
cat > dist/404.html << 'EOL'
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>7 Amazing Class Website</title>
  <script type="text/javascript">
    // Single Page Apps for GitHub Pages
    // MIT License
    // https://github.com/rafgraph/spa-github-pages
    var pathSegmentsToKeep = 1;

    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
      l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  </script>
</head>
<body>
</body>
</html>
EOL

# Add SPA redirect script to index.html
sed -i.bak '/<head>/a \
  <script type="text/javascript"> \
    // This script checks if you are being redirected from a 404 page \
    (function(l) { \
      if (l.search[1] === "/") { \
        var decoded = l.search.slice(1).split("&").map(function(s) { \
          return s.replace(/~and~/g, "&") \
        }).join("?"); \
        window.history.replaceState(null, null, \
          l.pathname.slice(0, -1) + decoded + l.hash \
        ); \
      } \
    }(window.location)) \
  </script>' dist/index.html

# Deploy to GitHub Pages with force option to replace all content
echo "🚀 Force deploying to GitHub Pages..."
npx gh-pages -d dist --add false

echo "✅ Fix completed! Wait a few minutes and check your site again at https://rubim1.github.io/website/"
echo "If you still have issues, make sure your GitHub repository settings are correctly configured for GitHub Pages."