import React, { useEffect, useRef } from 'react';
import { useParticles } from '@/hooks/useParticles';

const ParticleBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { initParticles } = useParticles();

  useEffect(() => {
    if (containerRef.current) {
      initParticles(containerRef.current);
    }

    // Cleanup will be handled by the hook
  }, [initParticles]);

  return (
    <div className="particle-container" ref={containerRef}></div>
  );
};

export default ParticleBackground;
