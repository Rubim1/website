import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AIChat from "@/pages/AIChat";
import { AppProvider } from "@/contexts/AppContext";
import { Theme3DProvider } from "@/contexts/Theme3DContext";
import LoadingScreen from "@/components/LoadingScreen";
import SmoothScroll from "@/components/SmoothScroll";
import { useState, useEffect, useRef } from "react";

// Calculate base URL for production or development environment
const BASE_URL = import.meta.env.MODE === 'production' ? '/website' : '';

function Router() {
  return (
    <Switch>
      <Route path={`${BASE_URL}/`} component={Home} />
      <Route path={`${BASE_URL}/ai-chat`} component={AIChat} />
      <Route path={`${BASE_URL}/*`} component={NotFound} />
    </Switch>
  );
}

function App() {
  const [musicPlayerInstance, setMusicPlayerInstance] = useState<JSX.Element | null>(null);
  const playerInitializedRef = useRef(false);
  
  // Ensure only one MusicPlayer instance is created
  useEffect(() => {
    // Ensure we only initialize the player once ever
    if (playerInitializedRef.current) {
      return;
    }
    
    playerInitializedRef.current = true;
    
    // Use a slight delay to ensure we don't create multiple instances
    setTimeout(() => {
      if (!window.hasOwnProperty('musicPlayerActive') || window.musicPlayerActive !== true) {
        import("@/components/MusicPlayer").then((module) => {
          const MusicPlayer = module.default;
          setMusicPlayerInstance(<MusicPlayer />);
          console.log("Music player initialized");
        });
      } else {
        console.log("Music player already exists, not creating another");
      }
    }, 1000);
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
