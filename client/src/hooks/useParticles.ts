import { useCallback } from 'react';

export const useParticles = () => {
  const initParticles = useCallback((container: HTMLElement) => {
    // Clear any existing particles
    container.innerHTML = '';
    
    // Determine the number of particles based on screen size
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      
      // Random size between 1 and 5px with randomized shape
      const isGlowingOrb = Math.random() > 0.7;
      const size = isGlowingOrb ? Math.random() * 4 + 2 : Math.random() * 2 + 1;
      
      // Modern color palette with vibrant cyan and blues
      const colors = [
        'rgba(0, 191, 255, 0.7)',  // Deep Sky Blue
        'rgba(32, 178, 170, 0.7)', // Light Sea Green
        'rgba(64, 224, 208, 0.7)', // Turquoise
        'rgba(0, 206, 209, 0.7)',  // Dark Turquoise
        'rgba(72, 209, 204, 0.7)', // Medium Turquoise
        'rgba(0, 255, 255, 0.7)'   // Aqua/Cyan
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Random position
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      
      // Depth effect with z-index and blur
      const depth = Math.random();
      const blur = depth < 0.3 ? 3 : depth < 0.6 ? 2 : 1;
      const zIndex = Math.floor(depth * 10);
      
      // Random opacity
      const opacity = Math.random() * 0.7 + 0.1;
      
      // Set styles
      particle.style.position = 'absolute';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      if (isGlowingOrb) {
        // Create glowing orbs with special effects
        particle.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        particle.style.boxShadow = `0 0 ${size * 4}px ${color}`;
        particle.style.filter = `blur(${blur}px)`;
      } else {
        // Regular particles
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
      }
      
      particle.style.borderRadius = '50%';
      particle.style.top = `${top}%`;
      particle.style.left = `${left}%`;
      particle.style.opacity = opacity.toString();
      particle.style.zIndex = zIndex.toString();
      
      // Randomized animation with different paths and speeds
      const animationType = Math.random() > 0.5 ? 'particle-float' : 'float';
      const animationDuration = Math.random() * 15 + 5;
      
      particle.style.animation = `${animationType} ${animationDuration}s ease-in-out infinite`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      // Add mouse interaction on some particles
      if (Math.random() > 0.7) {
        particle.classList.add('interactive-particle');
      }
      
      container.appendChild(particle);
    }
    
    // Add shooting stars occasionally
    const addShootingStars = () => {
      // Create a shooting star
      const createShootingStar = () => {
        const star = document.createElement('div');
        
        // Position at random edge of screen
        const fromTop = Math.random() > 0.5;
        const startX = fromTop ? Math.random() * 100 : (Math.random() > 0.5 ? -5 : 105);
        const startY = fromTop ? -5 : Math.random() * 100;
        
        const endX = startX + (Math.random() * 30 - 15);
        const endY = startY + (Math.random() * 30 + 10);
        
        // Styles
        star.style.position = 'absolute';
        star.style.width = '2px';
        star.style.height = '2px';
        star.style.backgroundColor = 'white';
        star.style.borderRadius = '50%';
        star.style.top = `${startY}%`;
        star.style.left = `${startX}%`;
        star.style.boxShadow = '0 0 20px white, 0 0 30px rgba(0, 191, 255, 0.8)';
        star.style.opacity = '0';
        star.style.zIndex = '5';
        star.style.filter = 'blur(0.5px)';
        
        // Animation
        star.animate([
          { 
            opacity: 0,
            transform: 'translateX(0) translateY(0) scale(1)',
            offset: 0 
          },
          { 
            opacity: 1,
            transform: 'translateX(5px) translateY(5px) scale(1.5)',
            offset: 0.1 
          },
          { 
            opacity: 1,
            transform: `translateX(${endX - startX}px) translateY(${endY - startY}px) scale(0.5)`,
            offset: 0.9 
          },
          { 
            opacity: 0,
            transform: `translateX(${endX - startX + 5}px) translateY(${endY - startY + 5}px) scale(0)`,
            offset: 1 
          }
        ], {
          duration: Math.random() * 2000 + 1000,
          easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
        }).onfinish = () => {
          star.remove();
        };
        
        container.appendChild(star);
      };
      
      // Create shooting stars at random intervals
      const createStarInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          createShootingStar();
        }
      }, 3000);
      
      return createStarInterval;
    };
    
    const shootingStarsInterval = addShootingStars();
    
    // Add interactive gradient overlay
    const addGradientOverlay = () => {
      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.background = 'radial-gradient(circle at 50% 50%, rgba(0, 191, 255, 0.05) 0%, rgba(0, 0, 0, 0) 70%)';
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '1';
      overlay.style.opacity = '0.8';
      
      // Move gradient with mouse
      const moveGradient = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        overlay.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0, 191, 255, 0.05) 0%, rgba(0, 0, 0, 0) 70%)`;
      };
      
      window.addEventListener('mousemove', moveGradient);
      container.appendChild(overlay);
      
      return { overlay, moveGradient };
    };
    
    const { overlay, moveGradient } = addGradientOverlay();
    
    // Handle window resize
    const handleResize = () => {
      // Re-initialize particles
      initParticles(container);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', moveGradient);
      clearInterval(shootingStarsInterval);
      container.innerHTML = '';
    };
  }, []);

  return { initParticles };
};
