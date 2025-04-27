import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';

// Gallery album data
const galleryItems = [
  {
    id: 1,
    title: 'foto kelas',
    description: 'Foto kelas untuk kalender',
    imageUrl: 'https://rubim1.github.io/video/14.jpg',
    type: 'image'
  },
  {
    id: 2,
    title: 'foto kelas saat selesai PESONAMU',
    description: 'foto kelas saat selesai PESONAMU',
    imageUrl: 'https://rubim1.github.io/video/15.jpg',
    type: 'image'
  },
  {
    id: 3,
    title: 'foto kelas saat selesai PESONAMU',
    description: 'foto kelas saat selesai PESONAMU',
    imageUrl: 'https://rubim1.github.io/video/16.jpg',
    type: 'image'
  },
  {
    id: 4,
    title: 'Momen Spesial',
    description: 'Momen ke rumah wali kelas',
    imageUrl: 'https://rubim1.github.io/video/vid1.mp4',
    videoUrl: 'https://rubim1.github.io/video/vid1.mp4',
    type: 'video'
  },
  {
    id: 5,
    title: 'Keseruan teman-teman Kelas',
    description: 'Video kompilasi aktivitas seru kelas kita',
    imageUrl: 'https://rubim1.github.io/video/vid2.mp4',
    videoUrl: 'https://rubim1.github.io/video/vid2.mp4',
    type: 'video'
  },
  {
    id: 6,
    title: 'Makan bersama',
    description: 'makan bersama teman-teman kelas di rumah wali kelas',
    imageUrl: 'https://rubim1.github.io/video/vid3.mp4',
    videoUrl: 'https://rubim1.github.io/video/vid3.mp4',
    type: 'video'
  },
  {
    id: 7,
    title: 'Berbuka bersama',
    description: 'berbuka bersama teman-teman kelas',
    imageUrl: 'https://rubim1.github.io/video/4.jpg',
    type: 'image'
  },
  {
    id: 8,
    title: 'Melaksanakan Projek Penguatan Profil Pancasila',
    description: 'melaksanakan projek penguatan profil pancasila',
    imageUrl: 'https://rubim1.github.io/video/5.jpg',
    type: 'image'
  },
  {
    id: 9,
    title: 'Ramadan islamic culture',
    description: 'melaksanakan PAISLOVE',
    imageUrl: 'https://rubim1.github.io/video/6.jpg',
    type: 'image'
  },
  {
    id: 10,
    title: 'Berlatih untuk acara PESONAMU',
    description: 'berlatih untuk acara PESONAMU',
    imageUrl: 'https://rubim1.github.io/video/7.jpg',
    type: 'image'
  },
  {
    id: 11,
    title: 'Momen Kebersamaan',
    description: 'Kebersamaan yang membuat kita semakin solid',
    imageUrl: 'https://rubim1.github.io/video/8.jpg',
    type: 'image'
  },
  {
    id: 12,
    title: 'Potret Keceriaan',
    description: 'Keceriaan yang terpancar dari setiap wajah',
    imageUrl: 'https://rubim1.github.io/video/9.jpg',
    type: 'image'
  }
];

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  description: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl, title, description }) => {
  // Use a ref to handle proper cleanup of the video element
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  
  // Handle escape key press
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
  
  // Pause video on close to save resources
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div 
        className="w-full max-w-lg sm:max-w-2xl md:max-w-4xl bg-card/95 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border border-primary/30"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 300 
        }}
        onClick={e => e.stopPropagation()}
        style={{ 
          maxHeight: isMobile ? '90vh' : '85vh',
          overflowY: 'auto'
        }}
      >
        <div className="aspect-video w-full bg-black/90 relative">
          {/* Add loading indicator */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <video 
            ref={videoRef}
            src={videoUrl} 
            controls
            className="w-full h-full relative z-20"
            autoPlay
            playsInline
            preload="metadata"
            onLoadedData={(e) => {
              // Hide the loading indicator once video is loaded
              if (e.currentTarget.parentElement) {
                const loadingEl = e.currentTarget.parentElement.querySelector('div');
                if (loadingEl) loadingEl.style.display = 'none';
              }
            }}
            controlsList="nodownload"
          />
        </div>
        <div className="p-4 sm:p-6">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-300 text-sm sm:text-base">{description}</p>
        </div>
        <button 
          className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/70 text-white hover:bg-primary transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <i className="fas fa-times"></i>
        </button>
      </motion.div>
    </motion.div>
  );
};

const GallerySection: React.FC = () => {
  const { openImageModal } = useAppContext();
  const isMobile = useIsMobile();
  const [visibleItems, setVisibleItems] = useState<number>(galleryItems.length); // Show all items from the start
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  
  const [videoModal, setVideoModal] = useState<{
    isOpen: boolean;
    videoUrl: string;
    title: string;
    description: string;
  }>({
    isOpen: false,
    videoUrl: '',
    title: '',
    description: ''
  });

  // Load more items when the button is clicked
  const loadMoreItems = useCallback(() => {
    setLoadingMore(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleItems(prev => 
        prev + 3 <= galleryItems.length ? prev + 3 : galleryItems.length
      );
      setLoadingMore(false);
    }, 300);
  }, []);
  
  // Handle proper cleanup of video resources
  useEffect(() => {
    return () => {
      // Cleanup function to remove any media resources
      if (videoModal.isOpen) {
        handleVideoClose();
      }
    };
  }, []);

  const handleVideoOpen = (item: any) => {
    setVideoModal({
      isOpen: true,
      videoUrl: item.videoUrl || '',
      title: item.title,
      description: item.description
    });
  };

  const handleVideoClose = () => {
    setVideoModal({
      ...videoModal,
      isOpen: false
    });
  };
  
  // Simplified variants for better mobile performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = isMobile ? {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  } : {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, type: 'spring', stiffness: 50 } 
    }
  };

  return (
    <section id="gallery" className="relative py-16 md:py-20">
      {/* Video Modal */}
      <AnimatePresence>
        {videoModal.isOpen && (
          <VideoModal 
            isOpen={videoModal.isOpen}
            onClose={handleVideoClose}
            videoUrl={videoModal.videoUrl}
            title={videoModal.title}
            description={videoModal.description}
          />
        )}
      </AnimatePresence>
    
      {/* Background with cosmic effect - simplified for mobile */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-background"></div>
        {!isMobile && (
          <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-no-repeat bg-cover"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-10 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="inline-block text-3xl md:text-4xl font-orbitron font-bold gradient-text pb-2 border-b-2 border-primary">
            Our Gallery
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Capturing moments and memories from our amazing class journey.
          </p>
        </motion.div>
        
        {/* Gallery Grid - optimized with virtualization concept for mobile */}
        <div ref={galleryRef}>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-16"
            variants={!isMobile ? containerVariants : {}}
            initial={!isMobile ? "hidden" : { opacity: 1 }}
            whileInView={!isMobile ? "visible" : { opacity: 1 }}
            viewport={{ once: true, margin: "-100px 0px" }}
          >
            {galleryItems.slice(0, visibleItems).map((item) => (
              <motion.div 
                key={item.id}
                className="bg-card/20 backdrop-blur-md rounded-xl overflow-hidden border border-primary/20 transform transition-all duration-300"
                variants={!isMobile ? itemVariants : undefined}
                whileHover={isMobile ? undefined : { y: -5 }}
                initial={isMobile ? { opacity: 0 } : undefined}
                animate={isMobile ? { opacity: 1 } : undefined}
                layout={!isMobile}
              >
                <div className="relative h-56 md:h-64 overflow-hidden">
                  {item.type === 'image' ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform"
                      style={{ 
                        willChange: 'transform',
                        transform: isMobile ? 'translateZ(0)' : undefined
                      }} 
                      decoding="async"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      {/* Only show video thumbnail - actual video will load in modal */}
                      <div className="w-full h-full bg-black/40">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover opacity-90"
                          style={{transform: 'translateZ(0)'}}
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/90 hover:bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-lg">
                          <i className="fas fa-play text-white text-lg md:text-xl"></i>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-70"></div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg md:text-xl font-semibold text-white line-clamp-1">{item.title}</h3>
                    <p className="text-xs md:text-sm text-gray-300 line-clamp-1">{item.description}</p>
                  </div>
                </div>
                <div className="p-3 md:p-4 flex justify-end">
                  <button 
                    className="px-3 py-1.5 md:px-4 md:py-2 bg-primary/80 hover:bg-primary rounded-lg text-white text-xs md:text-sm transition-colors flex items-center gap-2"
                    onClick={() => {
                      if (item.type === 'video' && item.videoUrl) {
                        handleVideoOpen(item);
                      } else {
                        openImageModal(item.imageUrl, item.title, item.description);
                      }
                    }}
                  >
                    {item.type === 'video' ? (
                      <>
                        <i className="fas fa-play"></i> Watch Video
                      </>
                    ) : (
                      <>
                        <i className="fas fa-images"></i> View Album
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Load more button */}
        {visibleItems < galleryItems.length && (
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button 
              className="inline-block bg-gradient-to-r from-accent to-primary text-white font-medium py-2.5 px-6 md:py-3 md:px-8 rounded-lg transition-all duration-300 disabled:opacity-50"
              onClick={loadMoreItems}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <>Loading <i className="fas fa-circle-notch fa-spin ml-2"></i></>
              ) : (
                <>View More Photos <i className="fas fa-arrow-right ml-2"></i></>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
