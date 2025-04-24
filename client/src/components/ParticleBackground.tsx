import React from 'react';

/**
 * ParticleBackground component renders a lightweight stars background
 * for better performance across all devices.
 */
const ParticleBackground: React.FC = () => {
  return (
    <div className="particle-container fixed top-0 left-0 w-full h-full z-0">
      {/* Static background with CSS stars */}
      <div className="w-full h-full bg-black">
        <div className="stars-container"></div>
      </div>
    </div>
  );
};

export default ParticleBackground;
