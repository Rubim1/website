# Class 7A Website

A dynamic class website featuring an immersive developer section with game-inspired visual effects and interactive design elements.

## Features

- Interactive UI with parallax effects and animations
- Class information and schedule
- Gallery with photos and videos
- Calendar with upcoming events
- Music player with curated tracks
- Developer section with special effects

## Simple Deployment Guide

### Running Locally
After downloading this project, simply run:

```bash
npm install  # Install dependencies
npm run dev  # Start development server
```

Your site will be available at `http://localhost:5000`

### Deploy to GitHub Pages
To deploy to GitHub Pages, use one of these simple methods:

#### Option 1: Standard Deployment
```bash
bash deploy.sh
```

#### Option 2: Clean Deployment (Delete all old files first)
If you're having issues with old files causing errors:

```bash
bash clean-deploy.sh
```

This will completely wipe the gh-pages branch and deploy a fresh version.

### GitHub Actions Deployment
This project is also configured to deploy automatically via GitHub Actions:

1. Push your code to GitHub
2. Go to your repository "Settings" → "Pages"
3. Set "Source" to "GitHub Actions"
4. Go to the "Actions" tab and trigger the "Manual Deploy to GitHub Pages" workflow

## Troubleshooting

If videos don't play correctly:
- Check browser console for errors
- Verify video file URLs are accessible
- Make sure the video extensions are supported (.mp4, .webm, etc.)

If deployment fails:
- Check GitHub repository settings
- Ensure you have proper permissions
- Try the `clean-deploy.sh` script which forces a clean deployment

## Technology Stack

- React with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Three.js for 3D effects
- Vite for building

## License

MIT