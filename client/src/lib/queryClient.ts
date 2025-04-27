import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Determine if we're in GitHub Pages environment
const isGitHubPages = window.location.hostname.includes('github.io');

// API mapping for GitHub Pages (will be loaded if we're on GitHub Pages)
let apiMapping: Record<string, string> = {};

// Load the API mapping if we're on GitHub Pages
if (isGitHubPages) {
  // We'll load this mapping when the app initializes
  fetch('/website/mock-api/api-mapping.json')
    .then(res => res.json())
    .then(mapping => {
      apiMapping = mapping;
      console.log('Loaded API mapping for GitHub Pages:', apiMapping);
    })
    .catch(err => {
      console.error('Failed to load API mapping:', err);
    });
}

// If on GitHub Pages, use mockup API, otherwise use relative paths
const API_BASE_URL = isGitHubPages 
  ? '/website' // Base URL for GitHub Pages deployment
  : '';

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest<T = any>(
  url: string,
  options: {
    method: string;
    body?: string;
    headers?: Record<string, string>;
  },
): Promise<T> {
  // Special handling for GitHub Pages - use mock API if available
  if (isGitHubPages && url.startsWith('/api') && apiMapping[url]) {
    // If this is a GET request, we can map to the mock API
    if (options.method === 'GET') {
      const mockApiUrl = `${API_BASE_URL}${apiMapping[url]}`;
      console.log(`Mapping API ${options.method} from ${url} to ${mockApiUrl}`);
      
      const res = await fetch(mockApiUrl, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        credentials: "include",
      });
      
      await throwIfResNotOk(res);
      return res.json();
    } else {
      // For non-GET requests, we'll just log and pretend it succeeded
      console.log(`Mock ${options.method} to ${url} with body:`, options.body);
      
      // Return a mock response based on the request
      if (url === '/api/chat/messages' && options.body) {
        // Create a fake "message received" response
        const parsedBody = JSON.parse(options.body);
        return {
          id: Math.floor(Math.random() * 10000),
          externalId: `mock-${Date.now()}`,
          ...parsedBody,
          timestamp: new Date().toISOString()
        } as any;
      }
      
      // Generic success response for other endpoints
      return { success: true } as any;
    }
  }
  
  // Regular API handling with BASE_URL prefix
  const fullUrl = url.startsWith('/api') && !url.startsWith('http') 
    ? `${API_BASE_URL}${url}` 
    : url;
    
  const res = await fetch(fullUrl, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Get the query URL and apply the API_BASE_URL if it's an API path
    const queryUrl = queryKey[0] as string;
    
    // If we're on GitHub Pages and have a mapping for this API, use the mock API
    if (isGitHubPages && queryUrl.startsWith('/api') && apiMapping[queryUrl]) {
      const mockApiUrl = `${API_BASE_URL}${apiMapping[queryUrl]}`;
      console.log(`Mapping API call from ${queryUrl} to ${mockApiUrl}`);
      
      const res = await fetch(mockApiUrl, {
        credentials: "include",
      });
      
      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }
      
      await throwIfResNotOk(res);
      return await res.json();
    }
    
    // Otherwise use normal API with BASE_URL prefix
    const fullUrl = queryUrl.startsWith('/api') && !queryUrl.startsWith('http')
      ? `${API_BASE_URL}${queryUrl}`
      : queryUrl;
      
    const res = await fetch(fullUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
