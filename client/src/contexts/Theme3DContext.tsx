
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Theme3DContextProps {
  enable3D: boolean;
  isMobileDevice: boolean;
  toggleEnable3D: () => void;
}

const defaultContextValue: Theme3DContextProps = {
  enable3D: false,
  isMobileDevice: false,
  toggleEnable3D: () => {},
};

const Theme3DContext = createContext<Theme3DContextProps>(defaultContextValue);

export const useTheme3D = () => useContext(Theme3DContext);

export const Theme3DProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(true); // Default to true for safety
  const [enable3D, setEnable3D] = useState<boolean>(false);

  // Improved mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|windows phone|opera mini|iemobile|mobile/i;
      const isMobile = mobileRegex.test(userAgent) || 
                      window.innerWidth < 768 || 
                      ('ontouchstart' in window) ||
                      (navigator.maxTouchPoints > 0);
      
      setIsMobileDevice(isMobile);
      
      // Removed the force disable for mobile devices to allow mobile users to toggle 3D
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize 3D state
  useEffect(() => {
    if (isMobileDevice) {
      setEnable3D(false);
      return;
    }
    
    const saved = localStorage.getItem('enable3D');
    setEnable3D(saved === 'true');
  }, [isMobileDevice]);

  const toggleEnable3D = () => {
    // Removed the mobile device check to allow mobile users to toggle 3D
    const newState = !enable3D;
    setEnable3D(newState);
    localStorage.setItem('enable3D', String(newState));
  };

  return (
    <Theme3DContext.Provider value={{ enable3D, isMobileDevice, toggleEnable3D }}>
      {children}
    </Theme3DContext.Provider>
  );
};
