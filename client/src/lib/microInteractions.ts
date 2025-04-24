/**
 * Library for playful micro-interactions that can be used throughout the site
 */
import { Variants } from 'framer-motion';

// Hover variants
export const hoverScale: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { type: 'spring', stiffness: 400, damping: 10 }
  },
  tap: { 
    scale: 0.95,
    transition: { type: 'spring', stiffness: 400, damping: 10 }
  }
};

export const hoverBounce: Variants = {
  initial: { y: 0 },
  hover: { 
    y: -5,
    transition: { 
      type: 'spring', 
      stiffness: 400, 
      damping: 10
    }
  },
  tap: { 
    y: 2,
    transition: { 
      type: 'spring', 
      stiffness: 400, 
      damping: 10
    }
  }
};

export const hoverRotate: Variants = {
  initial: { rotate: 0 },
  hover: { 
    rotate: [0, -5, 5, -3, 3, 0],
    transition: { 
      duration: 0.6,
    }
  }
};

export const hoverGlow: Variants = {
  initial: { 
    boxShadow: '0 0 0 rgba(0, 184, 255, 0)' 
  },
  hover: { 
    boxShadow: '0 0 15px rgba(0, 184, 255, 0.5)',
    transition: { duration: 0.3 }
  }
};

export const hoverShine: Variants = {
  initial: { 
    backgroundPosition: '200% 0',
  },
  hover: { 
    backgroundPosition: '-200% 0',
    transition: { 
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear',
    }
  }
};

// Text-specific interactions
export const textReveal: Variants = {
  initial: {
    clipPath: 'inset(0 100% 0 0)',
    opacity: 0
  },
  animate: {
    clipPath: 'inset(0 0 0 0)',
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  },
  exit: {
    clipPath: 'inset(0 0 0 100%)',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
};

export const letterSpacing: Variants = {
  initial: { letterSpacing: '0px' },
  hover: { 
    letterSpacing: '1px',
    transition: { 
      duration: 0.3
    }
  }
};

export const textGradientShift: Variants = {
  initial: { 
    backgroundPosition: '0% 50%',
    backgroundSize: '200% 200%',
  },
  hover: { 
    backgroundPosition: '100% 50%',
    transition: { duration: 0.6 }
  }
};

// Icon-specific interactions
export const iconSpin: Variants = {
  initial: { rotate: 0 },
  hover: { 
    rotate: 360,
    transition: { 
      duration: 0.6,
      ease: 'easeInOut'
    }
  }
};

export const iconBounce: Variants = {
  initial: { scale: 1, y: 0 },
  hover: {
    scale: [1, 1.2, 0.9, 1.1, 1],
    y: [0, -4, 2, -2, 0],
    transition: {
      duration: 0.6
    }
  }
};

export const iconPulse: Variants = {
  initial: { 
    scale: 1,
    opacity: 1 
  },
  hover: { 
    scale: [1, 1.2, 1],
    opacity: [1, 0.8, 1],
    transition: { 
      duration: 0.6,
      repeat: Infinity,
      repeatType: 'reverse'
    }
  }
};

// Button-specific interactions 
export const buttonPush: Variants = {
  initial: { 
    scale: 1,
    boxShadow: '0 4px 0 0 rgba(0, 0, 0, 0.2)',
    y: 0
  },
  hover: { 
    scale: 1.05,
    boxShadow: '0 6px 0 0 rgba(0, 0, 0, 0.2)',
    y: -2,
    transition: { 
      type: 'spring', 
      stiffness: 500, 
      damping: 15 
    }
  },
  tap: { 
    scale: 0.98,
    boxShadow: '0 0px 0 0 rgba(0, 0, 0, 0.2)',
    y: 4,
    transition: { 
      type: 'spring', 
      stiffness: 500, 
      damping: 15 
    }
  }
};

export const liquid: Variants = {
  initial: { 
    borderRadius: '8px'
  },
  hover: { 
    borderRadius: ['8px', '12px 4px 12px 4px', '4px 12px 4px 12px', '8px'],
    transition: { 
      duration: 1,
      repeat: Infinity
    }
  }
};

// Content reveal interactions
export const staggerChildren = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { 
    y: 20,
    opacity: 0 
  },
  animate: { 
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 100
    }
  }
};

// Card interactions
export const cardHover: Variants = {
  initial: { 
    y: 0,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  hover: { 
    y: -10,
    boxShadow: '0 20px 25px -5px rgba(0, 184, 255, 0.1), 0 10px 10px -5px rgba(0, 184, 255, 0.04)',
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 15
    }
  }
};

// Creates a magnetic effect (follows cursor slightly)
export const magneticEffect = (e: React.MouseEvent, intensity: number = 20) => {
  const target = e.currentTarget as HTMLElement;
  const boundingRect = target.getBoundingClientRect();
  
  const centerX = boundingRect.left + boundingRect.width / 2;
  const centerY = boundingRect.top + boundingRect.height / 2;
  
  const moveX = (e.clientX - centerX) / intensity;
  const moveY = (e.clientY - centerY) / intensity;
  
  target.style.transform = `translate(${moveX}px, ${moveY}px)`;
  
  return () => {
    target.style.transform = 'translate(0px, 0px)';
  };
};

// Create ripple effect on click
export const createRipple = (event: React.MouseEvent<HTMLElement>) => {
  const button = event.currentTarget;
  
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  
  const rect = button.getBoundingClientRect();
  
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.classList.add('ripple');
  
  const ripple = button.querySelector('.ripple');
  
  if (ripple) {
    ripple.remove();
  }
  
  button.appendChild(circle);
};