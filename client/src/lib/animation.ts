/**
 * Creates a frame impact effect on the specified element
 * @param element The DOM element to apply the effect to
 * @param event The mouse event that triggered the effect
 */
export const createFrameImpact = (
  element: HTMLElement,
  event: React.MouseEvent<HTMLElement>
): void => {
  // Get the position relative to the element
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  // Create shockwave effect
  const shockwave = document.createElement('div');
  
  shockwave.style.position = 'absolute';
  shockwave.style.left = `${x}px`;
  shockwave.style.top = `${y}px`;
  shockwave.style.transform = 'translate(-50%, -50%)';
  shockwave.style.width = '10px';
  shockwave.style.height = '10px';
  shockwave.style.borderRadius = '50%';
  shockwave.style.backgroundColor = 'rgba(34, 211, 238, 0.2)';
  shockwave.style.boxShadow = '0 0 10px rgba(34, 211, 238, 0.5)';
  shockwave.style.zIndex = '10';
  shockwave.style.animation = 'ping 0.8s cubic-bezier(0, 0, 0.2, 1)';
  
  element.appendChild(shockwave);
  
  setTimeout(() => {
    if (element.contains(shockwave)) {
      element.removeChild(shockwave);
    }
  }, 800);
};

/**
 * Animation variants for staggered children animations
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
};

export const zoomIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

/**
 * Creates a hover effect for elements
 */
export const hoverScale = {
  scale: 1.05,
  transition: { type: "spring", stiffness: 400, damping: 10 }
};

/**
 * Creates a tap effect for elements
 */
export const tapScale = {
  scale: 0.95
};
