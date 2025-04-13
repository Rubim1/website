import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  minLoadingTime?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ minLoadingTime = 2000 }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading process
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minLoadingTime);

    // Increment progress
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const nextProgress = prevProgress + (100 - prevProgress) * 0.05;
        return nextProgress > 99 ? 100 : nextProgress;
      });
    }, 100);

    // Clean up
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [minLoadingTime]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" } 
          }}
        >
          <div className="w-full max-w-md px-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-5xl md:text-6xl font-orbitron font-bold seven-text mb-2">7Amazing</h1>
              <p className="text-foreground/70">Welcome to the digital experience</p>
            </motion.div>
            
            <div className="relative w-full h-1 bg-accent/20 rounded-full overflow-hidden mb-4">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-accent"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-accent">Loading assets...</p>
              <p className="text-sm text-accent">{Math.round(progress)}%</p>
            </div>
            
            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 20 }).map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute rounded-full bg-accent/30"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    scale: Math.random() * 0.5 + 0.5,
                  }}
                  animate={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    opacity: [0.2, 0.8, 0.2],
                  }}
                  transition={{
                    duration: Math.random() * 5 + 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    width: Math.random() * 10 + 5,
                    height: Math.random() * 10 + 5,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;