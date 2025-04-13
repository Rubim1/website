import React, { createContext, useState, useContext, ReactNode } from 'react';

type ImageModalType = {
  isOpen: boolean;
  imageUrl: string;
  title: string;
  description: string;
};

interface AppContextProps {
  imageModal: ImageModalType;
  openImageModal: (imageUrl: string, title: string, description: string) => void;
  closeImageModal: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [imageModal, setImageModal] = useState<ImageModalType>({
    isOpen: false,
    imageUrl: '',
    title: '',
    description: '',
  });

  const openImageModal = (imageUrl: string, title: string, description: string) => {
    setImageModal({
      isOpen: true,
      imageUrl,
      title,
      description,
    });
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setImageModal({
      ...imageModal,
      isOpen: false,
    });
    document.body.style.overflow = '';
  };

  return (
    <AppContext.Provider
      value={{
        imageModal,
        openImageModal,
        closeImageModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
