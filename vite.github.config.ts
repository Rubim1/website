import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import fs from 'fs';

// This is a special Vite config for GitHub Pages deployment
export default defineConfig({
  plugins: [
    react(),
    themePlugin(),
    {
      name: 'copy-404-html',
      closeBundle() {
        // Copy 404.html to dist folder
        fs.copyFileSync(
          path.resolve(import.meta.dirname, 'client/404.html'),
          path.resolve(import.meta.dirname, 'dist/404.html')
        );
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  base: "/website/", // Sesuaikan dengan nama repository
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
});