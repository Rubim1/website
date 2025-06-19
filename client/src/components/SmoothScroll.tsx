import React, { useEffect, ReactNode, useRef } from 'react';

interface SmoothScrollProps {
  children: ReactNode;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const rafRef = useRef<number | null>(null);
  const scrollTargetRef = useRef<number | null>(null);
  const isScrollingRef = useRef(false);

  // Enhanced smooth scrolling with custom easing
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  };

  const smoothScrollTo = (targetY: number, duration: number = 1000) => {
    const startY = window.pageYOffset;
    const difference = targetY - startY;
    const startTime = performance.now();
    
    isScrollingRef.current = true;

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      
      window.scrollTo(0, startY + difference * easedProgress);
      
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        isScrollingRef.current = false;
        rafRef.current = null;
      }
    };
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(step);
  };

  // Enhanced anchor link handling
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        
        const targetId = anchor.getAttribute('href')?.replace('#', '');
        const targetElement = document.getElementById(targetId || '');
        
        if (targetElement) {
          const headerOffset = 100; // Adjust for navigation bar
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo(0, offsetPosition);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Simple scroll-triggered animations only for specific elements
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -20% 0px',
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        
        if (entry.isIntersecting) {
          // Only animate specific cards/components, not entire sections
          element.classList.add('scroll-animate');
        }
      });
    }, observerOptions);

    // Only observe cards and small components, not sections
    const observeElements = () => {
      const elementsToObserve = document.querySelectorAll(
        '.glass-card:not(.scroll-animate), .neon-border:not(.scroll-animate)'
      );
      
      elementsToObserve.forEach((element) => {
        observer.observe(element);
      });
    };

    // Delay observation to ensure DOM is ready
    const timeoutId = setTimeout(observeElements, 500);
    
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // Parallax effect for background elements
  useEffect(() => {
    let ticking = false;

    const updateParallax = () => {
      if (isScrollingRef.current) return;
      
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      
      parallaxElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const speed = parseFloat(htmlElement.dataset.parallax || '0.5');
        const yPos = -(scrolled * speed);
        htmlElement.style.transform = `translateY(${yPos}px)`;
      });
      
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;