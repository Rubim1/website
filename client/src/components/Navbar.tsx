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
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled ? 'py-2 glass-card-dark border-b border-accent/10' : 'py-4 bg-transparent'
      }`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <motion.a 
            href="#hero" 
            className="flex items-center group magnetic-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseMove={(e) => {
              const resetTransform = magneticEffect(e, 15);
              setTimeout(resetTransform, 1000);
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget;
              target.style.transform = 'translate(0px, 0px)';
            }}
          >
            <span className="text-2xl font-bold font-orbitron relative">
              <span className="seven-text mr-1">7</span>
              <span className="modern-gradient-text">AMAZING</span>
              <motion.span 
                className="absolute -bottom-1 left-0 h-0.5 bg-accent/80"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
              />
            </span>
          </motion.a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-black/20 backdrop-blur-sm rounded-full border border-accent/10 p-1">
              {navLinks.map((link, index) => (
                <motion.a 
                  key={index} 
                  href={link.url}
                  className={`px-4 py-2 mx-1 rounded-full transition-all duration-300 text-sm relative ripple-container ${
                    activeLink === link.url 
                      ? 'text-white bg-accent/20 border border-accent/30 shine-effect' 
                      : 'text-gray-300 hover:text-white border border-transparent'
                  }`}
                  whileHover={{ 
                    scale: 1.05,
                    textShadow: '0 0 5px rgba(0, 184, 255, 0.5)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => createRipple(e)}
                  onMouseEnter={(e) => {
                    // Add a subtle glow effect on hover
                    const target = e.currentTarget;
                    target.style.boxShadow = '0 0 5px rgba(0, 184, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget;
                    target.style.boxShadow = 'none';
                  }}
                >
                  {link.title}
                  {activeLink === link.url && (
                    <motion.span 
                      className="absolute inset-0 rounded-full bg-accent/10 -z-10"
                      layoutId="activeNavItem"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.a>
              ))}
            </div>
            
            {/* AI Chat Link */}
            <Link href="/ai-chat">
              <motion.div 
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-semibold text-sm ripple-container cursor-pointer"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(60, 60, 255, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => createRipple(e)}
              >
                <i className="fas fa-robot mr-2"></i>
                AI Chat
              </motion.div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button 
            className="md:hidden glass-card rounded-full h-10 w-10 flex items-center justify-center focus:outline-none"
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
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-accent`}></i>
            </motion.div>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 glass-card-dark md:hidden flex flex-col pt-24"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <div className="container mx-auto px-4 flex flex-col space-y-6 items-center">
              <div className="w-full max-w-md mx-auto">
                {navLinks.map((link, index) => (
                  <motion.a 
                    key={index} 
                    href={link.url}
                    className={`neon-border glass-card rounded-lg my-3 py-4 px-6 flex items-center justify-between w-full ripple-container ${
                      activeLink === link.url ? 'border-accent/50 text-white' : 'text-gray-200'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={(e) => {
                      createRipple(e);
                      setMobileMenuOpen(false);
                    }}
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: "0 0 15px rgba(0, 184, 255, 0.3)",
                      x: 5
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="text-xl">{link.title}</span>
                    <motion.div
                      whileHover={{
                        x: [0, 5, 0],
                        transition: { duration: 0.5, repeat: Infinity }
                      }}
                    >
                      <i className="fas fa-chevron-right text-accent"></i>
                    </motion.div>
                  </motion.a>
                ))}
              </div>


              {/* AI Chat Link for Mobile */}
              <motion.div
                className="pt-3 w-full max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: navLinks.length * 0.1 + 0.1 }}
              >
                <Link href="/ai-chat">
                  <motion.div 
                    className="neon-border glass-card rounded-lg my-3 py-4 px-6 flex items-center justify-between w-full ripple-container text-white bg-gradient-to-r from-blue-600 to-purple-600"
                    onClick={(e) => {
                      createRipple(e);
                      setMobileMenuOpen(false);
                    }}
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: "0 0 15px rgba(60, 60, 255, 0.5)",
                      x: 5
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="text-xl">AI Chat</span>
                    <motion.div
                      whileHover={{
                        x: [0, 5, 0],
                        transition: { duration: 0.5, repeat: Infinity }
                      }}
                    >
                      <i className="fas fa-robot text-white"></i>
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div
                className="pt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: navLinks.length * 0.1 + 0.2 }}
              >
                <motion.button 
                  className="modern-button bg-accent/80 text-white px-8 py-3 rounded-full border border-accent/50 ripple-container push-button"
                  onClick={(e) => {
                    createRipple(e);
                    setMobileMenuOpen(false);
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 15px rgba(0, 184, 255, 0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close Menu
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;