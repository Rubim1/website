import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Determine if we're in GitHub Pages environment
const isGitHubPages = window.location.hostname.includes('github.io');
// If on GitHub Pages, use a mock API or external API URL
// For development and regular deployment, use relative paths
const API_BASE_URL = isGitHubPages 
  ? '/website/mock-api' // Use local mock API files in the /website/mock-api directory
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
  // Prefix URL with API_BASE_URL if it's an API call and doesn't already have http/https
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
