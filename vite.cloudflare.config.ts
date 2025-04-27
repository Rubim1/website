import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import errorModal from '@replit/vite-plugin-runtime-error-modal';
import { cartographer } from '@replit/vite-plugin-cartographer';
import shadcnThemeJson from '@replit/vite-plugin-shadcn-theme-json';

/**
 * Vite configuration for Cloudflare Pages deployment
 * 
 * This configuration is optimized for Cloudflare Pages and includes:
 * - Static site generation
 * - Firebase for real-time database capabilities
 */
export default defineConfig({
  plugins: [
    react(),
    errorModal(),
    cartographer(),
    shadcnThemeJson(),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': '/client/src',
      '@assets': '/attached_assets',
      '@shared': '/shared',
    },
  },
  // Adding environment variables to ensure they are available to the client
  define: {
    __FIREBASE_ENABLED__: true,
    __IS_CLOUDFLARE_DEPLOYMENT__: true
  }
});