import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/contexts/AppContext';

// Gallery album data
const galleryItems = [
  {
    id: 1,
    title: 'Class Activities',
    description: 'Learning and growing together in our daily activities',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80',
    type: 'image'
  },
  {
    id: 2,
    title: 'Togetherness',
    description: 'A description of the togetherness/solidarity/camaraderie between students and their homeroom teacher.',
    imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
    type: 'image'
  },
  {
    id: 3,
    title: 'Field Trip',
    description: 'Exploring and learning outside the classroom',
    imageUrl: 'https://images.unsplash.com/photo-1540151812223-c30b3fab58e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    type: 'image'
  },
  {
    id: 4,
    title: 'Together We Learn, Together We Excel',
    description: 'A motivational video showcasing our commitment to excellence and the power of learning together',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
    type: 'video'
  },
  {
    id: 5,
    title: 'Music Performance',
    description: 'Our talented students performing at the annual showcase',
    imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    videoUrl: 'https://www.youtube.com/embed/EExwffrNBMg?autoplay=1',
    type: 'video'
  },
  {
    id: 6,
    title: 'Class Creativity',
    description: 'Creative projects displayed in our annual exhibition',
    imageUrl: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
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
  if (!isOpen) return null;

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="w-full max-w-4xl bg-card/90 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border border-primary/30"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="aspect-video w-full">
          <iframe 
            src={videoUrl} 
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-300">{description}</p>
        </div>
        <button 
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-primary transition-colors"
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </button>
      </motion.div>
    </motion.div>
  );
};

const GallerySection: React.FC = () => {
  const { openImageModal } = useAppContext();
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="gallery" className="relative py-20">
      {/* Video Modal */}
      <VideoModal 
        isOpen={videoModal.isOpen}
        onClose={handleVideoClose}
        videoUrl={videoModal.videoUrl}
        title={videoModal.title}
        description={videoModal.description}
      />
    
      {/* Background with cosmic effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-background"></div>
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-no-repeat bg-cover"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="inline-block text-4xl font-orbitron font-bold gradient-text pb-2 border-b-2 border-primary">
            Our Gallery
          </h2>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
            Capturing moments and memories from our amazing class journey.
          </p>
        </motion.div>
        
        {/* Gallery Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {galleryItems.map((item) => (
            <motion.div 
              key={item.id}
              className="bg-card/20 backdrop-blur-md rounded-xl overflow-hidden border border-primary/20 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-64 overflow-hidden">
                {item.type === 'image' ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110" 
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-primary/80 rounded-full flex items-center justify-center pulse-animation">
                        <i className="fas fa-play text-white text-xl"></i>
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-70"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-gray-300">{item.description}</p>
                </div>
              </div>
              <div className="p-4 flex justify-end">
                <button 
                  className="frame-impact px-4 py-2 bg-primary/80 hover:bg-primary rounded-lg text-white text-sm transition-colors flex items-center gap-2"
                  onClick={() => {
                    if (item.type === 'video' && item.videoUrl) {
                      // Open a video modal - we'll need to create this functionality
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
        
        {/* Add more images button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button 
            className="frame-impact inline-block bg-gradient-to-r from-accent to-primary text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 hover:from-accent/80 hover:to-primary/80 hover:-translate-y-1 shadow-lg shadow-accent/30"
            onClick={() => alert('View more photos clicked!')}
          >
            View More Photos <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;
