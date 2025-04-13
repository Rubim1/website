import { useCallback } from 'react';

export const useParticles = () => {
  const initParticles = useCallback((container: HTMLElement) => {
    // Clear any existing particles
    container.innerHTML = '';
    
    // Determine the number of particles based on screen size
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      
      // Random size between 1 and 3px
      const size = Math.random() * 2 + 1;
      
      // Random color (blue/purple shades)
      const colors = ['#38bdf8', '#22d3ee', '#a855f7', '#8b5cf6'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Random position
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      
      // Random opacity
      const opacity = Math.random() * 0.5 + 0.1;
      
      // Set styles
      particle.style.position = 'absolute';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      particle.style.borderRadius = '50%';
      particle.style.top = `${top}%`;
      particle.style.left = `${left}%`;
      particle.style.opacity = opacity.toString();
      particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
      
      // Animation
      particle.style.animation = `float ${Math.random() * 8 + 4}s ease-in-out infinite`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      container.appendChild(particle);
    }
    
    // Handle window resize
    const handleResize = () => {
      // Re-initialize particles
      initParticles(container);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      container.innerHTML = '';
    };
  }, []);

  return { initParticles };
};
