import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme3D } from '@/contexts/Theme3DContext';
import { useToast } from '@/hooks/use-toast';

// Define custom elements for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        url?: string;
      };
    }
  }
}

interface NavItem {
  title: string;
  desc: string;
  url: string;
  icon: string;
  delay: number;
  external?: boolean;
}

const navItems: NavItem[] = [
  {
    title: "About Our Class",
    desc: "Learn about our amazing class and its members",
    url: "#about",
    icon: "fa-users",
    delay: 0
  },
  {
    title: "Calendar",
    desc: "View our class calendar with events and holidays",
    url: "#calendar",
    icon: "fa-calendar-alt",
    delay: 0.1
  },
  {
    title: "E-Presensi Kelas",
    desc: "Access our class attendance records",
    url: "https://docs.google.com/spreadsheets/d/1DOFuQjICT47k1L5rqpxp3ety3M7JjkD5ncvNKM5T9JI/edit?gid=1424646149#gid=1424646149",
    icon: "fa-clipboard-list",
    delay: 0.2,
    external: true
  },
  {
    title: "Jadwal Piket",
    desc: "View our class duty schedule",
    url: "#schedule",
    icon: "fa-calendar-check",
    delay: 0.3
  },
  {
    title: "The Champions",
    desc: "Celebrate our class achievements",
    url: "https://sites.google.com/guru.smp.belajar.id/webkelas7a/menu/champions",
    icon: "fa-trophy",
    delay: 0.4,
    external: true
  },
  {
    title: "E-Jurnal Kelas 7A",
    desc: "Access our class journal",
    url: "https://docs.google.com/spreadsheets/d/1Anuhn4Xv2syaUC1X8_0G9zeZ9N3Sg7wTrXaxwQS72TM/edit?gid=2005592952#gid=2005592952",
    icon: "fa-book",
    delay: 0.5,
    external: true
  }
];

const HeroSection: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const { enable3D, isMobileDevice, toggleEnable3D } = useTheme3D();
  const { toast } = useToast();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', updateWindowSize);
    updateWindowSize();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateWindowSize);
    };
  }, []);
  
  // Show performance notification toast
  useEffect(() => {
    // Show a performance toast notification after a delay
    const timeoutId = setTimeout(() => {
      if (!isMobileDevice) {
        toast({
          title: "3D Effects Available",
          description: (
            <div className="flex items-start space-x-2">
              <i className="fas fa-cube mt-0.5 text-primary"></i>
              <span>Enable 3D effects for a more immersive experience. Use the toggle in the bottom left corner. May affect performance on low-end devices.</span>
            </div>
          ),
          duration: 8000,
        });
      }
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  }, [toast, isMobileDevice]);

  const calculateTilt = (x: number, y: number) => {
    if (windowSize.width === 0 || windowSize.height === 0) return { x: 0, y: 0 };
    
    const centerX = windowSize.width / 2;
    const centerY = windowSize.height / 2;
    
    const tiltX = (mousePosition.x - centerX) / centerX * 3;
    const tiltY = (mousePosition.y - centerY) / centerY * 3;
    
    return { x: tiltX, y: tiltY };
  };

  const tilt = calculateTilt(mousePosition.x, mousePosition.y);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24">
      {/* Custom 3D Activation Confirmation Dialog */}
      {confirmDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100]">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setConfirmDialogOpen(false)}
          ></div>
          <div className="relative bg-black/90 backdrop-blur-lg border border-primary/30 rounded-lg w-full max-w-md mx-4 p-6 z-[101] shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <i className="fas fa-exclamation-triangle text-yellow-400 text-xl"></i>
              <h3 className="text-white text-xl font-medium">Enable 3D Effects?</h3>
            </div>
            
            <div className="text-gray-300 mb-6">
              <p className="mb-3">
                3D effects can provide a more immersive experience but may affect performance on low-end devices.
              </p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-md p-3 text-yellow-300 text-sm">
                <p className="flex items-start">
                  <i className="fas fa-lightbulb mt-1 mr-2"></i>
                  <span>If you experience lag or slow performance, you can disable 3D effects by clicking the same button again.</span>
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white transition-colors"
                onClick={() => setConfirmDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 rounded-md bg-primary hover:bg-primary/80 text-white transition-colors"
                onClick={() => {
                  toggleEnable3D();
                  setConfirmDialogOpen(false);
                }}
              >
                <i className="fas fa-cube mr-2"></i>
                Enable 3D
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Background with parallax */}
      <div 
        className="absolute inset-0 parallax-bg z-0" 
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          filter: 'brightness(0.15) contrast(1.2)'
        }}
      />
      
      {/* 3D Spline background */}
      {enable3D && (
        <div className="absolute inset-0 z-[1]">
          <spline-viewer url="https://prod.spline.design/e4b6AHV8wQXG-1Wr/scene.splinecode"></spline-viewer>
        </div>
      )}
      
      {/* Static background (shown when 3D is disabled) */}
      {!enable3D && (
        <div className="absolute inset-0 z-[1]" style={{ background: '#000000' }}>
          <div className="w-full h-full bg-gradient-to-b from-[#001428] to-black">
            <div className="absolute inset-0 opacity-20">
              <div className="stars-container"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black z-0" />
      
      {/* Animated aura */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full bg-accent/20 blur-[100px] z-0"
        style={{
          top: `calc(50% - 250px)`,
          left: `calc(50% - 250px)`,
          transform: `translate(${tilt.x * 20}px, ${tilt.y * 20}px)`,
          transition: 'transform 0.2s ease-out',
          opacity: 0.4
        }}
      />
      
      {/* Static dots instead of animated particles for better performance */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-0 left-0 w-full h-full">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 z-[10] relative text-center">
        <motion.div 
          className="animate-float"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${-tilt.x}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="relative mb-6">
            {/* Ultra-premium title with layered effects */}
            <motion.h1 
              className="text-6xl md:text-8xl font-bold relative inline-block"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut"
              }}
            >
              {/* Background 3D text effect */}
              <span className="absolute -left-1 -top-1 opacity-20 blur-sm text-[#80d8ff]">7</span>
              <span className="absolute -left-0.5 -top-0.5 opacity-30 blur-[1px] text-[#00b8ff]">7</span>
              
              {/* Main number with premium effect */}
              <motion.span 
                className="relative z-10 mr-1 text-transparent bg-clip-text bg-gradient-to-r from-[#00b8ff] to-[#80d8ff]"
                animate={{ 
                  textShadow: [
                    "0 0 10px rgba(0, 191, 255, 0.5), 0 0 20px rgba(0, 191, 255, 0.3)", 
                    "0 0 15px rgba(0, 191, 255, 0.7), 0 0 30px rgba(0, 191, 255, 0.5)", 
                    "0 0 10px rgba(0, 191, 255, 0.5), 0 0 20px rgba(0, 191, 255, 0.3)"
                  ]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "mirror" 
                }}
              >
                7
              </motion.span>
              
              {/* "AMAZING" text with animated gradient */}
              <motion.span 
                className="modern-gradient-text relative z-10"
                initial={{ opacity: 0, filter: "blur(8px)" }}
                animate={{ 
                  opacity: 1, 
                  filter: "blur(0px)"
                }}
                transition={{ 
                  duration: 1.2,
                  delay: 0.3
                }}
              >
                AMAZING
              </motion.span>
              
              {/* Animated highlight underline */}
              <motion.span 
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-[#00b8ff] to-[#80d8ff] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ 
                  duration: 1.2, 
                  delay: 0.6,
                  ease: "easeOut"
                }}
              />
              
              {/* Light reflection effect */}
              <motion.span 
                className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0"
                animate={{ 
                  opacity: [0, 0.5, 0],
                  left: ["-100%", "100%", "100%"]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 5
                }}
              />
            </motion.h1>
            
            {/* Small decorative elements */}
            <motion.span 
              className="absolute -top-6 -right-6 text-[#00b8ff] opacity-60 text-lg"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <i className="fas fa-plus transform scale-75"></i>
            </motion.span>
            
            <motion.span 
              className="absolute bottom-0 -left-6 text-[#80d8ff] opacity-40 text-lg"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <i className="fas fa-circle transform scale-[0.3]"></i>
            </motion.span>
          </div>
          
          {/* Subtitle with animated text */}
          <div className="relative">
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                delay: 0.8
              }}
            >
              <span className="relative">
                <span>We Are Amazing Class</span>
                <motion.span 
                  className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#00b8ff]/50 to-transparent"
                  animate={{ width: ["0%", "100%", "0%"] }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut"
                  }}
                />
              </span>
            </motion.p>
          </div>
          
          {/* Static dots for better performance */}
          <div className="relative w-full max-w-xs mx-auto h-1 my-8">
            <div className="absolute left-0 w-2 h-2 rounded-full bg-accent opacity-60" />
            <div className="absolute left-1/4 w-2 h-2 rounded-full bg-accent opacity-80" />
            <div className="absolute left-2/4 w-2 h-2 rounded-full bg-accent opacity-70" />
            <div className="absolute left-3/4 w-2 h-2 rounded-full bg-accent opacity-90" />
            <div className="absolute right-0 w-2 h-2 rounded-full bg-accent opacity-60" />
          </div>
        </motion.div>
        
        {/* Premium Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto px-4">
          {navItems.map((item, index) => (
            <motion.div
              key={index}
              className="glass-card neon-border rounded-xl overflow-hidden transform transition-all duration-300"
              style={{ 
                animationDelay: `${item.delay}s`,
                position: 'relative'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + item.delay }}
              whileHover={{ 
                y: -8,
                boxShadow: "0 0 25px rgba(0, 191, 255, 0.4)",
                borderColor: "rgba(0, 191, 255, 0.6)"
              }}
            >
              {/* Static background glow for better performance */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-[#00b8ff]/20 to-[#80d8ff]/10 z-0 opacity-30"
              />
              
              {/* Top corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute rotate-45 bg-[#00b8ff]/20 w-24 h-8 -top-4 -right-8 backdrop-blur-sm"></div>
              </div>
              
              <div className="relative z-10 p-6">
                {/* Icon with static glow for better performance */}
                <div 
                  className="w-16 h-16 rounded-full bg-[#00b8ff]/10 flex items-center justify-center text-3xl text-[#00b8ff] mb-4 border border-[#00b8ff]/30 hover:scale-110 transition-all duration-300"
                  style={{ boxShadow: '0 0 8px rgba(0, 191, 255, 0.4)' }}
                >
                  <i className={`fas ${item.icon}`}></i>
                </div>
                
                <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-300 mb-6">{item.desc}</p>
                
                {/* Premium button with hover effect */}
                <motion.a 
                  href={item.url} 
                  target={item.external ? "_blank" : undefined} 
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="relative overflow-hidden inline-flex items-center justify-center group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Button background with gradient */}
                  <span className="absolute inset-0 bg-gradient-to-r from-[#00b8ff] to-[#80d8ff] rounded-lg opacity-90 group-hover:opacity-100 transition-opacity"></span>
                  
                  {/* Button content */}
                  <span className="relative px-6 py-2.5 text-white font-medium flex items-center space-x-1">
                    <span>{item.external ? "Access" : "Explore"}</span>
                    <motion.span
                      animate={item.external ? { x: [0, 3, 0] } : { x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
                    >
                      <i className={`fas ${item.external ? "fa-external-link-alt" : "fa-arrow-right"}`}></i>
                    </motion.span>
                  </span>
                </motion.a>
                
                {/* Static bottom accent line */}
                <div 
                  className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#00b8ff]/0 via-[#00b8ff]/30 to-[#00b8ff]/0"
                />
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <motion.div
            className="relative inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Glow effect behind button */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00b8ff]/40 to-[#80d8ff]/40 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition duration-1000"></div>
            
            {/* Button with glass effect */}
            <a 
              href="#gallery" 
              className="relative inline-flex items-center justify-center min-w-[220px] bg-gradient-to-r from-[#00b8ff] to-[#80d8ff] text-white font-semibold py-4 px-10 rounded-xl text-lg border border-[#80d8ff]/50 shadow-xl"
            >
              <span className="relative z-10 flex items-center">
                <span className="mr-2">Explore Our Gallery</span>
                
                {/* Animated icon */}
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    repeatType: "mirror" 
                  }}
                >
                  <i className="fas fa-images"></i>
                </motion.span>
              </span>
              
              {/* Overlay glass effect */}
              <span className="absolute inset-0 overflow-hidden rounded-xl">
                <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent z-0"></span>
              </span>
            </a>
            
            {/* Animated ripples */}
            <motion.span 
              className="absolute inset-0 rounded-xl border-2 border-[#00b8ff]/40"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.7, 0.4, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.span 
              className="absolute inset-0 rounded-xl border-2 border-[#80d8ff]/30"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.2, 0.5]
              }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              }}
            />
          </motion.div>
        </motion.div>
        
        {/* 3D Toggle Button */}
        <motion.div 
          className="fixed bottom-6 left-6 z-50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <motion.button 
            className="relative group"
            onClick={() => {
              if (enable3D) {
                // If 3D is already enabled, just toggle it off
                toggleEnable3D();
              } else {
                // If 3D is disabled, open confirmation dialog
                setConfirmDialogOpen(true);
              }
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={enable3D ? "Turn off 3D background" : "Turn on 3D background"}
            disabled={isMobileDevice}
          >
            {/* Button background */}
            <div className={`relative w-14 h-14 rounded-full backdrop-blur-md p-[2px] ${isMobileDevice ? 'opacity-50 cursor-not-allowed' : ''} ${enable3D ? 'bg-gradient-to-br from-[#00b8ff]/80 to-[#80d8ff]/60' : 'bg-gradient-to-br from-gray-500/40 to-gray-600/30'}`}>
              <div className="absolute inset-[1px] rounded-full bg-[#001520]/80 backdrop-blur-md" />
              
              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <i className={`fas ${enable3D ? 'fa-cube' : 'fa-square'} ${enable3D ? 'text-[#00b8ff]' : 'text-gray-400'}`}></i>
              </div>
            </div>
          </motion.button>
        </motion.div>
        
        {/* Premium Music player toggle */}
        <motion.div 
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <motion.button 
            className="relative group"
            onClick={() => document.querySelector('.audio-player')?.classList.remove('minimized')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Glowing background */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-[#00b8ff]/20 blur-xl"
              animate={{ 
                scale: [0.85, 1.1, 0.85],
                opacity: [0.4, 0.7, 0.4] 
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Ripple effects */}
            <motion.div 
              className="absolute inset-0 rounded-full border-2 border-[#00b8ff]/20"
              animate={{ 
                scale: [1, 1.4, 1.8, 1],
                opacity: [0.5, 0.3, 0, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            
            {/* Button background */}
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#00b8ff]/80 to-[#80d8ff]/60 backdrop-blur-md p-[2px]">
              <div className="absolute inset-[1px] rounded-full bg-[#001520]/80 backdrop-blur-md" />
              
              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.i 
                  className="fas fa-music text-[#00b8ff]"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    textShadow: [
                      '0 0 4px rgba(0, 184, 255, 0.6)',
                      '0 0 8px rgba(0, 184, 255, 0.8)',
                      '0 0 4px rgba(0, 184, 255, 0.6)'
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/30 to-transparent"
                  style={{ rotate: -30 }}
                  animate={{ 
                    x: ['-100%', '100%'] 
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </div>
          </motion.button>
        </motion.div>
      </div>
      
      {/* Premium animated scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-0 right-0 mx-auto text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.5 }}
      >
        <a href="#about" className="inline-block group">
          {/* Premium scroll text */}
          <motion.p 
            className="text-sm font-light tracking-widest text-[#00b8ff]/80 uppercase mb-2"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Scroll Down
          </motion.p>
          
          {/* Arrow container with glow effect */}
          <div className="relative inline-flex justify-center">
            {/* Glow backdrop */}
            <motion.div 
              className="absolute w-12 h-12 rounded-full bg-[#00b8ff]/10 blur-md"
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Arrow with animation */}
            <motion.div
              className="relative rounded-full w-10 h-10 border border-[#00b8ff]/30 bg-black/30 backdrop-blur-sm flex items-center justify-center group-hover:border-[#00b8ff]/60 transition-all duration-300"
              animate={{ y: [0, 8, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut"
              }}
              whileHover={{ 
                scale: 1.1,
                boxShadow: '0 0 15px rgba(0, 184, 255, 0.3)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                  delay: 0.2
                }}
              >
                <i className="fas fa-chevron-down text-[#00b8ff] text-lg"></i>
              </motion.div>
            </motion.div>
            
            {/* Animated lines */}
            <motion.div 
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-10 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
            >
              <motion.div 
                className="w-full h-full bg-gradient-to-b from-[#00b8ff]/40 to-transparent"
                animate={{ y: [-40, 40] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "linear"
                }}
              />
            </motion.div>
          </div>
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
