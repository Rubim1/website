import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { title: 'Home', url: '#' },
    { title: 'About', url: '#about' },
    { title: 'Developer', url: '#developer' },
    { title: 'Calendar', url: '#calendar' },
    { title: 'Schedule', url: '#schedule' },
    { title: 'Gallery', url: '#gallery' }
  ];

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-2 bg-black/80 backdrop-blur-md' : 'py-4 bg-transparent'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <span className="text-2xl font-bold font-orbitron">
              <span className="seven-text">7</span>
              <span className="text-white">A</span>
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.url}
                className="text-gray-300 hover:text-white relative group transition-colors"
              >
                {link.title}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 bg-black/95 md:hidden flex flex-col pt-20"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <div className="container mx-auto px-4 flex flex-col space-y-6 items-center">
              {navLinks.map((link, index) => (
                <motion.a 
                  key={index} 
                  href={link.url}
                  className="text-gray-200 hover:text-white text-xl py-2 border-b border-gray-800 w-full text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.title}
                </motion.a>
              ))}
              <motion.div
                className="pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: navLinks.length * 0.1 }}
              >
                <button 
                  className="bg-accent text-white px-6 py-2 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Close Menu
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;