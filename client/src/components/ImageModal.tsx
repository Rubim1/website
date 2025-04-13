import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageModalProps {
  imageUrl: string;
  title: string;
  description: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, title, description, onClose }) => {
  const [isVideo, setIsVideo] = useState(false);
  
  // Determine if the URL is a video
  useEffect(() => {
    // Check if the URL ends with common video extensions or is from a video hosting service
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    const isVideoFile = videoExtensions.some(ext => imageUrl.toLowerCase().endsWith(ext));
    setIsVideo(isVideoFile);
  }, [imageUrl]);
  
  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Close modal on outside click
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-background/90 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOutsideClick}
      >
        <motion.div 
          className="max-w-4xl w-full bg-card/30 backdrop-blur-xl rounded-xl overflow-hidden border border-primary/30 relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors z-10"
            onClick={onClose}
          >
            <i className="fas fa-times text-2xl"></i>
          </button>
          <div className="relative">
            {isVideo ? (
              <video 
                src={imageUrl}
                className="w-full max-h-[80vh]"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-auto max-h-[80vh] object-contain" 
              />
            )}
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-300">{description}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal;
