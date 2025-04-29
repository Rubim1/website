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
  // Import MusicPlayer directly
  const [MusicPlayer, setMusicPlayer] = useState<React.ComponentType | null>(null);
  
  // Load the music player component
  useEffect(() => {
    // Import the component
    import("@/components/MusicPlayer").then((module) => {
      setMusicPlayer(() => module.default);
      window.musicPlayerActive = true;
      console.log("Music player initialized and ready to use");
    }).catch(err => {
      console.error("Failed to load music player:", err);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Theme3DProvider>
        <AppProvider>
          <LoadingScreen />
          <SmoothScroll>
            <Router />
            {MusicPlayer && <MusicPlayer />}
            <Toaster />
          </SmoothScroll>
        </AppProvider>
      </Theme3DProvider>
    </QueryClientProvider>
  );
}

export default App;
