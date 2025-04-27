// Add TypeScript type definitions for global variables used in the app

interface Window {
  // Custom globals for environment detection
  __IS_CLOUDFLARE_DEPLOYMENT__?: boolean;
  
  // Other globals
  THREE?: any;
}