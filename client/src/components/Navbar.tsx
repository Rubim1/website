import React, { useState, useEffect } from 'react';
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
  // const { enable3D, toggleEnable3D } = useTheme3D(); //Removed variables
  const isMobile = useIsMobile();

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
          setActiveLink(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
          className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 shadow-2xl max-w-5xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <motion.a 
              href="#hero" 
              className="flex items-center group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl font-bold font-orbitron relative">
                <span className="bg-gradient-to-r from-blue-300 via-blue-500 to-blue-900 bg-clip-text text-transparent mr-1">7</span>
                <span className="text-white">AMAZING</span>
              </span>
            </motion.a>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link, index) => (
                <motion.a 
                  key={index} 
                  href={link.url}
                  className={`px-4 py-2 rounded-full transition-all duration-300 text-sm relative ${
                    activeLink === link.url 
                      ? 'text-black bg-white font-medium' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => createRipple(e)}
                >
                  {link.title}
                </motion.a>
              ))}
            </div>
            
            {/* AI Chat Link - Desktop */}
            <div className="hidden lg:block">
              <Link href="/ai-chat">
                <motion.div 
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-800 rounded-full text-white font-medium text-sm cursor-pointer"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fas fa-robot mr-2"></i>
                  AI Chat
                </motion.div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <motion.button 
              className="lg:hidden bg-white/10 backdrop-blur-sm rounded-full h-10 w-10 flex items-center justify-center focus:outline-none"
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <motion.div
                animate={mobileMenuOpen ? "open" : "closed"}
                variants={{
                  open: { rotate: 180 },
                  closed: { rotate: 0 }
                }}
                transition={{ duration: 0.3 }}
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-white`}></i>
              </motion.div>
            </motion.button>
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
                {navLinks.map((link, index) => (
                  <motion.a 
                    key={index} 
                    href={link.url}
                    className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl my-3 py-4 px-6 flex items-center justify-between w-full ${
                      activeLink === link.url ? 'bg-white text-black' : 'text-white'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setMobileMenuOpen(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-lg font-medium">{link.title}</span>
                    <i className="fas fa-chevron-right"></i>
                  </motion.a>
                ))}
              </div>

              {/* AI Chat Link for Mobile */}
              <motion.div
                className="w-full max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 + 0.1 }}
              >
                <Link href="/ai-chat">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-800 rounded-2xl py-4 px-6 flex items-center justify-between w-full text-white"
                    onClick={() => setMobileMenuOpen(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-lg font-medium">AI Chat</span>
                    <i className="fas fa-robot"></i>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;