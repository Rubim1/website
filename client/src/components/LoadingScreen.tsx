import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

interface LoadingScreenProps {
  minLoadingTime?: number;
}

// Futuristic quotes to display during loading
const futuristicQuotes = [
  "Initializing neural pathways...",
  "Synthesizing visual matrix...",
  "Calibrating quantum interface...",
  "Harmonizing energy fields...",
  "Assembling holographic projections...",
  "Synchronizing parallel processes...",
  "Establishing neural network...", 
  "Energizing photonic displays...",
  "Activating AI subsystems...",
  "Generating immersive environment..."
];

// List of all critical resource types that should be loaded
const resourceTypes = [
  'img', 'video', 'audio', 'script', 'link[rel="stylesheet"]', 'font'
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ minLoadingTime = 3000 }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPhase, setLoadingPhase] = useState<'initial' | 'main' | 'final'>('initial');
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [resourcesLeft, setResourcesLeft] = useState(0);
  const animateLogoControls = useAnimation();
  const animateTextControls = useAnimation();
  const loadingStartTime = useRef(Date.now());
  const resourcesChecked = useRef(false);
  
  // Logo animation sequences
  useEffect(() => {
    const sequence = async () => {
      await animateLogoControls.start({
        scale: [0.8, 1.2, 1],
        opacity: 1,
        transition: { duration: 1.5, ease: "easeOut" }
      });
      
      // Pulse animation
      animateLogoControls.start({
        scale: [1, 1.05, 1],
        transition: { 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }
      });
    };
    
    sequence();
  }, [animateLogoControls]);

  // Text animation sequences
  useEffect(() => {
    const textSequence = async () => {
      await animateTextControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, delay: 0.5 }
      });
    };
    
    textSequence();
  }, [animateTextControls]);

  // Function to check all resources are loaded - with extra safety
  const checkAllResourcesLoaded = () => {
    if (resourcesChecked.current) return;
    resourcesChecked.current = true; // Mark as checked immediately to avoid double-calls
    
    console.log('Starting resource check');
    
    try {
      // Only check a limited set of critical resources to avoid problems
      // Focus mainly on images which are most likely to cause loading issues
      const allResources: HTMLElement[] = [];
      const images = document.querySelectorAll('img');
      images.forEach(el => allResources.push(el as HTMLElement));
      
      console.log(`Found ${allResources.length} resources to check`);
      setResourcesLeft(allResources.length);
      
      // If very few or no resources, add artificial delay but proceed quickly
      if (allResources.length < 3) {
        setProgress(70);
        setTimeout(() => {
          setLoadingText('Finalizing experience...');
          setProgress(100);
          setLoadingPhase('final');
          
          setTimeout(() => {
            prepareForTransition();
          }, 1000);
        }, 1500);
        return;
      }
      
      // For actual resources, process normally
      let loadedCount = 0;
      const checkResource = (resource: HTMLElement) => {
        loadedCount++;
        setResourcesLeft(prev => Math.max(0, prev - 1));
        
        // Calculate progress based on resources loaded
        const newProgress = Math.min(95, Math.round((loadedCount / allResources.length) * 100));
        setProgress(newProgress);
        
        console.log(`Resource ${loadedCount}/${allResources.length} loaded`);
        
        if (loadedCount >= allResources.length) {
          setLoadingText('Finalizing experience...');
          setProgress(98);
          setTimeout(() => {
            setProgress(100);
            setLoadingPhase('final');
            
            // Ensure minimum loading time has passed
            const elapsed = Date.now() - loadingStartTime.current;
            const remainingTime = Math.max(0, minLoadingTime - elapsed);
            
            setTimeout(() => {
              prepareForTransition();
            }, remainingTime);
          }, 800);
        }
      };
      
      // Check each resource with timeouts to ensure we don't get stuck
      allResources.forEach((resource, index) => {
        // Add staggered timeouts for each resource to avoid getting stuck on any single one
        const resourceTimeout = setTimeout(() => {
          console.log(`Resource #${index} timed out - marking as loaded anyway`);
          checkResource(resource);
        }, 5000); // 5 second timeout per resource
        
        if (resource.tagName.toLowerCase() === 'img') {
          const img = resource as HTMLImageElement;
          if (img.complete) {
            clearTimeout(resourceTimeout);
            checkResource(img);
          } else {
            img.onload = () => {
              clearTimeout(resourceTimeout);
              checkResource(img);
            };
            img.onerror = () => {
              clearTimeout(resourceTimeout);
              console.log('Image failed to load, continuing anyway');
              checkResource(img); // Count errors as "loaded" to not block the UI
            };
          }
        } else {
          // For other resources, assume they're loaded immediately
          clearTimeout(resourceTimeout);
          checkResource(resource);
        }
      });
    } catch (error) {
      console.error('Error while checking resources:', error);
      // In case of any error, proceed to finish loading
      setProgress(100);
      setLoadingPhase('final');
      setTimeout(() => {
        prepareForTransition();
      }, 1000);
    }
  };
  
  // Prepare the epic transition
  const prepareForTransition = () => {
    // Set a final dramatic pause before transition
    setLoadingText('Launching experience...');
    
    setTimeout(() => {
      // Start the closing sequence
      setIsLoading(false);
    }, 1200);
  };

  // For dynamic futuristic quotes
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  
  // Extended loading delays and phases for a more dramatic experience
  useEffect(() => {
    let safetyTimeout: NodeJS.Timeout;
    let quoteInterval: NodeJS.Timeout;
    let phaseTimeouts: NodeJS.Timeout[] = [];
    
    // Rotate through futuristic quotes for extra coolness - slower interval
    quoteInterval = setInterval(() => {
      setCurrentQuoteIndex(prev => (prev + 1) % futuristicQuotes.length);
      setLoadingText(futuristicQuotes[(currentQuoteIndex + 1) % futuristicQuotes.length]);
    }, 2800); // Longer quote display time
    
    // Fase 1: Mulai dengan cepat tapi tetap keren
    phaseTimeouts.push(setTimeout(() => {
      setLoadingText("Initializing quantum processor...");
      setProgress(10);
    }, 500));
    
    // Fase 2: Main loading phase start
    phaseTimeouts.push(setTimeout(() => {
      setLoadingPhase('main');
      setProgress(30);
      setLoadingText("Establishing neural networks...");
      // Mulai cek resources segera untuk mempercepat loading
      checkAllResourcesLoaded();
    }, 1500));
    
    // Fase 3: Fake resource checking start
    phaseTimeouts.push(setTimeout(() => {
      setProgress(60);
      setLoadingText("Calibrating holographic systems...");
    }, 3000));
    
    // Fase 4: Getting "serious" - mendekati selesai
    phaseTimeouts.push(setTimeout(() => {
      setProgress(80);
      setLoadingText("Synchronizing quantum fluctuations...");
      
      // Set a much shorter safety timeout to force completion after 7 seconds
      safetyTimeout = setTimeout(() => {
        console.log('Extended safety timeout triggered - forcing loading completion');
        
        // Final countdown sequence
        setProgress(95);
        setLoadingText("Finalizing system initialization...");
        
        // Final phase transition
        setTimeout(() => {
          setProgress(100);
          setLoadingPhase('final');
          setLoadingText("System online");
          
          // Final dramatic pause before showing the app
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }, 500);
      }, 7000); // 7 second safety timeout
    }, 5000));
    
    // Simulate progress even if no resources are detected
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        // Faster progress to ensure we don't get stuck
        const increment = (100 - prev) * 0.05;
        return Math.min(95, prev + increment);
      });
    }, 200);
    
    return () => {
      clearInterval(interval);
      clearInterval(quoteInterval);
      if (safetyTimeout) clearTimeout(safetyTimeout);
      // Clear all phase timeouts to prevent memory leaks
      phaseTimeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [minLoadingTime, currentQuoteIndex]);

  // Custom cubic curves for ultra-smooth transition
  const customTransition = {
    type: "spring",
    stiffness: 10,
    damping: 20,
    mass: 2,
  };
  
  // Staggered letter animation for text reveal
  const letterVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.2,
            filter: "brightness(2)",
            transition: { 
              duration: 1.2, 
              ease: [0.22, 1, 0.36, 1] 
            } 
          }}
        >
          {/* Animated gradient background */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 z-0"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              backgroundSize: '200% 200%',
            }}
          />
          
          {/* Animated light beam */}
          <motion.div 
            className="absolute inset-0 overflow-hidden opacity-50 z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
          >
            <motion.div 
              className="w-[150vw] h-40 bg-gradient-to-r from-transparent via-primary/40 to-transparent absolute"
              style={{ rotate: '-30deg' }}
              animate={{ 
                top: ['-10%', '120%'],
              }}
              transition={{ 
                duration: 3.5, 
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 2
              }}
            />
          </motion.div>
          
          <div className="w-full max-w-md px-4 z-20 relative">
            {/* Logo animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={animateLogoControls}
              className="text-center mb-8"
            >
              {/* Futuristic 3D-like logo with shadow effect and holographic rings */}
              <div className="relative inline-block">
                {/* Holographic rings around logo */}
                <div className="absolute -inset-8 flex items-center justify-center pointer-events-none">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={`ring-${i}`}
                      className="absolute rounded-full border border-primary/60"
                      style={{ 
                        width: `${100 + i * 40}px`, 
                        height: `${100 + i * 40}px`,
                        boxShadow: "0 0 10px 1px rgba(121, 40, 202, 0.3)",
                        opacity: 0.6 - (i * 0.15)
                      }}
                      animate={{ 
                        rotate: i % 2 === 0 ? [0, 360] : [360, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 10 + i * 5, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                      }}
                    />
                  ))}
                  
                  {/* Holographic scan line */}
                  <motion.div 
                    className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-primary/80 to-transparent"
                    animate={{ top: ["-50%", "150%"] }}
                    transition={{ 
                      duration: 2.5, 
                      repeat: Infinity, 
                      repeatDelay: 1,
                      ease: "easeInOut"
                    }}
                    style={{ 
                      boxShadow: "0 0 15px 5px rgba(121, 40, 202, 0.4)",
                      filter: "blur(1px)"
                    }}
                  />
                </div>
                
                {/* Digital code rain effect behind text */}
                <div className="absolute inset-0 overflow-hidden opacity-20 mix-blend-overlay">
                  {Array.from({ length: 15 }).map((_, index) => (
                    <motion.div
                      key={`code-${index}`}
                      className="absolute text-xs text-primary font-mono whitespace-nowrap"
                      style={{
                        left: `${(index / 15) * 100}%`,
                        top: -20,
                      }}
                      animate={{
                        top: ["0%", "100%"],
                        opacity: [0, 1, 0] 
                      }}
                      transition={{
                        top: {
                          duration: 1.5 + Math.random() * 3,
                          repeat: Infinity,
                          delay: index * 0.2,
                        },
                        opacity: {
                          duration: 1.5 + Math.random() * 3,
                          repeat: Infinity,
                          delay: index * 0.2,
                        }
                      }}
                    >
                      10110101<br/>
                      00101101<br/>
                      11010110<br/>
                      01010101
                    </motion.div>
                  ))}
                </div>
                
                {/* Main logo text with holographic effect */}
                <motion.h1 
                  className="text-5xl md:text-7xl font-orbitron font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary"
                  style={{
                    filter: "drop-shadow(0 2px 10px rgba(121, 40, 202, 0.5))",
                    WebkitBackgroundClip: "text",
                    position: "relative",
                    zIndex: 2
                  }}
                  animate={{ 
                    textShadow: [
                      "0 0 10px rgba(121, 40, 202, 0.5)",
                      "0 0 20px rgba(121, 40, 202, 0.7)",
                      "0 0 10px rgba(121, 40, 202, 0.5)"
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  7Amazing
                </motion.h1>
                
                {/* Glitch effect on text */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    opacity: [0, 0.3, 0],
                    x: [0, 2, -2, 0],
                    filter: ["blur(0px)", "blur(1px)", "blur(0px)"]
                  }}
                  transition={{
                    duration: 0.2,
                    repeat: Infinity,
                    repeatDelay: 5,
                    times: [0, 0.1, 0.2, 1]
                  }}
                >
                  <div className="text-5xl md:text-7xl font-orbitron font-bold text-blue-400 opacity-70">
                    7Amazing
                  </div>
                </motion.div>
              </div>
              
              <motion.p 
                className="text-foreground/70 font-medium text-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={animateTextControls}
              >
                {loadingPhase === 'final' ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    Prepare for amazement
                  </motion.span>
                ) : (
                  "Digital experience unleashed"
                )}
              </motion.p>
            </motion.div>
            
            {/* Progressive loading bar with glow effect */}
            <motion.div 
              className="relative w-full h-2 bg-background/50 rounded-full overflow-hidden mb-6 border border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6 }}
                style={{
                  boxShadow: "0 0 10px 1px rgba(121, 40, 202, 0.5)"
                }}
              />
            </motion.div>
            
            {/* Loading status text with animation */}
            <motion.div 
              className="flex justify-between items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                {loadingPhase !== 'final' ? (
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                ) : (
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-green-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  />
                )}
                <p className="text-sm font-medium text-foreground/90">
                  {loadingText}
                  {loadingPhase !== 'final' && resourcesLeft > 0 && (
                    <span className="text-xs text-accent/80 ml-1">
                      ({resourcesLeft} items remaining)
                    </span>
                  )}
                </p>
              </div>
              <motion.p 
                className="text-sm font-bold text-primary"
                animate={{ scale: progress === 100 ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.5 }}
              >
                {Math.round(progress)}%
              </motion.p>
            </motion.div>
            
            {/* Animated particles with glow effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              {Array.from({ length: 30 }).map((_, index) => (
                <motion.div
                  key={index}
                  className={`absolute rounded-full ${index % 5 === 0 ? 'bg-primary' : index % 3 === 0 ? 'bg-accent' : 'bg-primary/40'}`}
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    scale: Math.random() * 0.5 + 0.2,
                    opacity: 0
                  }}
                  animate={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    opacity: [0, 0.4, 0],
                    scale: [0.2, 0.5, 0.2]
                  }}
                  transition={{
                    duration: Math.random() * 5 + 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 2
                  }}
                  style={{
                    width: Math.random() * 15 + 3,
                    height: Math.random() * 15 + 3,
                    filter: index % 5 === 0 ? "blur(1px) brightness(1.5)" : "blur(0.5px)",
                    boxShadow: index % 5 === 0 ? "0 0 10px 2px rgba(121, 40, 202, 0.5)" : "none"
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Digital Code Rain Effect (Matrix style) */}
          <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
            {Array.from({ length: 20 }).map((_, index) => (
              <motion.div
                key={`coderain-${index}`}
                className="absolute font-mono text-xs text-primary/80 whitespace-pre"
                initial={{
                  x: Math.random() * 100 + "%", 
                  y: -300,
                  opacity: 0.3 + Math.random() * 0.5
                }}
                animate={{
                  y: ["0%", "100%"]
                }}
                transition={{
                  duration: 8 + Math.random() * 15,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear"
                }}
                style={{
                  textShadow: "0 0 5px #00ff00"
                }}
              >
                {Array.from({ length: 15 }).map(() => 
                  Math.random() > 0.5 ? "1" : "0"
                ).join("\n")}
              </motion.div>
            ))}
          </div>
          
          {/* Cosmic stars effect in background */}
          <div className="absolute inset-0 z-0">
            {Array.from({ length: 100 }).map((_, index) => (
              <motion.div
                key={`star-${index}`}
                className="absolute rounded-full bg-white"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: Math.random() * 0.5 + 0.1,
                }}
                animate={{
                  opacity: [0.1, 0.8, 0.1]
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: Math.random() * 3
                }}
                style={{
                  width: Math.random() * 2 + 1,
                  height: Math.random() * 2 + 1,
                }}
              />
            ))}
          </div>
          
          {/* DNA Double Helix Animation - Futuristic Element */}
          <div className="absolute z-10 pointer-events-none" style={{ top: '15%', right: '10%' }}>
            <motion.div
              className="relative w-20 h-40"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              {/* DNA Strands */}
              {Array.from({ length: 10 }).map((_, index) => (
                <React.Fragment key={`dna-${index}`}>
                  <motion.div
                    className="absolute w-20 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{
                      top: `${index * 4}px`,
                      transform: `rotateY(${index * 36}deg) translateZ(10px)`,
                      opacity: 0.7,
                      boxShadow: "0 0 8px 2px rgba(102, 51, 255, 0.5)"
                    }}
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: index * 0.1
                    }}
                  />
                  <motion.div
                    className="absolute w-20 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    style={{
                      top: `${index * 4 + 20}px`,
                      transform: `rotateY(${(index * 36) + 180}deg) translateZ(10px)`,
                      opacity: 0.7,
                      boxShadow: "0 0 8px 2px rgba(6, 182, 212, 0.5)"
                    }}
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: index * 0.1 + 1
                    }}
                  />
                </React.Fragment>
              ))}
            </motion.div>
          </div>

          {/* Holographic Circle Scanner Effect */}
          <motion.div 
            className="absolute w-64 h-64 rounded-full border-2 border-primary z-10 pointer-events-none"
            style={{ 
              bottom: '10%', 
              left: '10%',
              boxShadow: "0 0 15px 5px rgba(121, 40, 202, 0.3)",
              backgroundImage: "radial-gradient(circle, rgba(121, 40, 202, 0.1) 0%, rgba(0, 0, 0, 0) 70%)"
            }}
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 180],
              borderColor: ["rgba(121, 40, 202, 0.8)", "rgba(56, 189, 248, 0.8)", "rgba(121, 40, 202, 0.8)"]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {/* Scanner Lines */}
            <motion.div 
              className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent top-1/2 left-0"
              animate={{ rotate: [0, 359] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-primary to-transparent top-0 left-1/2"
              animate={{ rotate: [0, -359] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            {/* Data Points */}
            {Array.from({ length: 8 }).map((_, index) => (
              <motion.div
                key={`point-${index}`}
                className="absolute w-2 h-2 rounded-full bg-accent"
                style={{ 
                  top: `${20 + Math.sin(index) * 50}%`, 
                  left: `${20 + Math.cos(index) * 50}%`,
                  boxShadow: "0 0 10px 2px rgba(121, 40, 202, 0.7)" 
                }}
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{ 
                  duration: 2,
                  delay: index * 0.3,
                  repeat: Infinity
                }}
              />
            ))}
          </motion.div>

          {/* Final reveal animation that plays just before exit */}
          {loadingPhase === 'final' && progress === 100 && (
            <motion.div 
              className="absolute inset-0 bg-primary/10 z-30 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.5, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-white text-6xl font-orbitron font-bold"
                style={{
                  textShadow: "0 0 20px rgba(255, 255, 255, 0.8)"
                }}
              >
                SYSTEM ONLINE
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;