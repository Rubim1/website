import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { AppProvider } from "@/contexts/AppContext";
import { Theme3DProvider } from "@/contexts/Theme3DContext";
import LoadingScreen from "@/components/LoadingScreen";
import SmoothScroll from "@/components/SmoothScroll";
import { useState, useEffect } from "react";

// Calculate base URL for production or development environment
const BASE_URL = import.meta.env.MODE === 'production' ? '/website' : '';

function Router() {
  return (
    <Switch>
      <Route path={`${BASE_URL}/`} component={Home} />
      <Route path={`${BASE_URL}/*`} component={NotFound} />
    </Switch>
  );
}

function App() {
  const [musicPlayerInstance, setMusicPlayerInstance] = useState<JSX.Element | null>(null);
  
  // Ensure only one MusicPlayer instance is created
  useEffect(() => {
    import("@/components/MusicPlayer").then((module) => {
      const MusicPlayer = module.default;
      setMusicPlayerInstance(<MusicPlayer />);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Theme3DProvider>
        <AppProvider>
          <LoadingScreen />
          <SmoothScroll>
            <Router />
            {musicPlayerInstance}
            <Toaster />
          </SmoothScroll>
        </AppProvider>
      </Theme3DProvider>
    </QueryClientProvider>
  );
}

export default App;
