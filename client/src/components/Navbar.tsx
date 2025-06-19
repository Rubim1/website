import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createRipple, magneticEffect } from '@/lib/microInteractions';
// import { useTheme3D } from '@/contexts/Theme3DContext'; //Removed import
import { Switch } from '@/components/ui/switch';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'wouter';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('#');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [highlighter, setHighlighter] = useState({ width: 0, left: 0, opacity: 0 });
  // const { enable3D, toggleEnable3D } = useTheme3D(); //Removed variables
  const isMobile = useIsMobile();
  const navRef = useRef<HTMLDivElement>(null);

  // Function to update highlighter position with correct calculation
  const updateHighlighter = (targetUrl: string) => {
    if (navRef.current) {
      requestAnimationFrame(() => {
        // Find the navigation container and target link
        const navContainer = navRef.current!.querySelector('.flex.items-center.space-x-2.relative.z-10') as HTMLElement;
        
        if (navContainer) {
          // Get only the navigation links within the container (excluding other elements)
          const navLinks = navContainer.querySelectorAll('a[data-nav-link]') as NodeListOf<HTMLElement>;
          const targetLink = Array.from(navLinks).find(link => 
            link.getAttribute('data-nav-link') === targetUrl
          );
          
          if (targetLink) {
            // Calculate position relative to the nav container, not the document
            const containerRect = navContainer.getBoundingClientRect();
            const linkRect = targetLink.getBoundingClientRect();
            
            setHighlighter({
              width: linkRect.width,
              left: linkRect.left - containerRect.left,
              opacity: 1
            });
          }
        }
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Update active link based on scroll position
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop - 100;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = `#${section.getAttribute('id')}`;

        if (offset >= sectionTop && offset < sectionTop + sectionHeight) {
          if (activeLink !== sectionId) {
            setActiveLink(sectionId);
            // Update highlighter immediately when section changes
            if (!isMobile) {
              setTimeout(() => updateHighlighter(sectionId), 50);
            }
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  // Initialize highlighter position on mount and when activeLink changes
  useEffect(() => {
    if (!isMobile && navRef.current && activeLink) {
      const timer = setTimeout(() => {
        updateHighlighter(activeLink);
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [activeLink, isMobile]);

  const navLinks = [
    { title: 'Home', url: '#hero' },
    { title: 'About', url: '#about' },
    { title: 'Developer', url: '#developer' },
    { title: 'Calendar', url: '#calendar' },
    { title: 'Schedule', url: '#schedule' },
    { title: 'Gallery', url: '#gallery' },
    { title: 'Chat', url: '#chat' }
  ];

  return (
    <>
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 w-auto">
        <motion.div 
          className="relative rounded-full px-4 py-2 shadow-2xl max-w-5xl"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.8,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        >
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <a 
              href="#hero" 
              className="flex items-center group"
            >
              <span className="text-xl font-bold font-orbitron relative">
                <span className="bg-gradient-to-r from-blue-300 via-blue-500 to-blue-900 bg-clip-text text-transparent mr-1">7</span>
                <span className="text-white">AMAZING</span>
              </span>
            </a>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center relative" ref={navRef}>
              {/* Animated Selection Highlighter */}
              <motion.div
                className="absolute rounded-xl z-0 h-10"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
                }}
                animate={{
                  width: highlighter.width,
                  x: highlighter.left,
                  opacity: highlighter.opacity
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                initial={{ opacity: 0 }}
              />
              
              {/* Navigation links */}
              <div className="flex items-center space-x-2 relative z-10">
                {navLinks.map((link) => (
                  <a 
                    key={link.url} 
                    href={link.url}
                    data-nav-link={link.url}
                    className={`px-4 py-2 rounded-xl transition-colors duration-200 text-sm relative cursor-pointer ${
                      activeLink === link.url 
                        ? 'text-white font-medium' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <span className="relative z-10">{link.title}</span>
                  </a>
                ))}
              </div>
            </div>
            
            {/* AI Chat Link - Desktop */}
            <div className="hidden lg:block">
              <Link href="/ai-chat">
                <div 
                  className="px-4 py-2 rounded-full text-white font-medium text-sm cursor-pointer relative overflow-hidden"
                  style={{
                    background: 'rgba(59, 130, 246, 0.15)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <span className="relative z-10">
                    <i className="fas fa-robot mr-2"></i>
                    AI Chat
                  </span>
                </div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden rounded-full h-10 w-10 flex items-center justify-center focus:outline-none"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div>
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-white`}></i>
              </div>
            </button>
          </div>
        </motion.div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xl lg:hidden flex flex-col pt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="container mx-auto px-4 flex flex-col space-y-6 items-center">
              <div className="w-full max-w-md mx-auto">
                {navLinks.map((link) => (
                  <a 
                    key={link.url} 
                    href={link.url}
                    className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl my-3 py-4 px-6 flex items-center justify-between w-full transition-colors duration-200 ${
                      activeLink === link.url ? 'bg-white text-black' : 'text-white'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-lg font-medium">{link.title}</span>
                    <i className="fas fa-chevron-right"></i>
                  </a>
                ))}
              </div>

              {/* AI Chat Link for Mobile */}
              <div className="w-full max-w-md mx-auto">
                <Link href="/ai-chat">
                  <div 
                    className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-800 rounded-2xl py-4 px-6 flex items-center justify-between w-full text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-lg font-medium">AI Chat</span>
                    <i className="fas fa-robot"></i>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;