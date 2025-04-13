import React, { useEffect, ReactNode } from 'react';

interface SmoothScrollProps {
  children: ReactNode;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  // Implement smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        
        const targetId = anchor.getAttribute('href')?.replace('#', '');
        const targetElement = document.getElementById(targetId || '');
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Adjust for navigation bar height
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  // Add animation on scroll for elements with data-aos attribute
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      document.querySelectorAll('[data-aos]').forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < windowHeight * 0.8 && rect.bottom > 0;
        
        if (isVisible) {
          element.classList.add('aos-animate');
        }
      });
    };
    
    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;