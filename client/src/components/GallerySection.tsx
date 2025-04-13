import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/contexts/AppContext';

// Gallery album data
const galleryItems = [
  {
    id: 1,
    title: 'Kebersamaan Kelas',
    description: 'Momen indah saat kita berkumpul bersama, berbagi cerita dan tawa',
    imageUrl: 'https://rubim1.github.io/video/1.jpg',
    type: 'image'
  },
  {
    id: 2,
    title: 'Kenangan Manis',
    description: 'Setiap foto menyimpan sejuta kenangan yang tak terlupakan',
    imageUrl: 'https://rubim1.github.io/video/2.jpg',
    type: 'image'
  },
  {
    id: 3,
    title: 'Keceriaan Bersama',
    description: 'Saat-saat bahagia yang selalu kita rayakan bersama',
    imageUrl: 'https://rubim1.github.io/video/3.jpg',
    type: 'image'
  },
  {
    id: 4,
    title: 'Momen Spesial',
    description: 'Video dokumentasi kegiatan kelas yang penuh makna',
    imageUrl: 'https://rubim1.github.io/video/vid1.mp4',
    videoUrl: 'https://rubim1.github.io/video/vid1.mp4',
    type: 'video'
  },
  {
    id: 5,
    title: 'Keseruan Kelas',
    description: 'Video kompilasi aktivitas seru di kelas kita',
    imageUrl: 'https://rubim1.github.io/video/vid2.mp4',
    videoUrl: 'https://rubim1.github.io/video/vid2.mp4',
    type: 'video'
  },
  {
    id: 6,
    title: 'Kenangan Terindah',
    description: 'Momen-momen berharga yang akan selalu kita ingat',
    imageUrl: 'https://rubim1.github.io/video/vid3.mp4',
    videoUrl: 'https://rubim1.github.io/video/vid3.mp4',
    type: 'video'
  },
  {
    id: 7,
    title: 'Potret Keakraban',
    description: 'Kebersamaan yang membuat kita semakin dekat',
    imageUrl: 'https://rubim1.github.io/video/4.jpg',
    type: 'image'
  },
  {
    id: 8,
    title: 'Momen Bersama',
    description: 'Setiap momen bersama adalah kenangan yang tak tergantikan',
    imageUrl: 'https://rubim1.github.io/video/5.jpg',
    type: 'image'
  },
  {
    id: 9,
    title: 'Keseruan Tak Terlupakan',
    description: 'Saat-saat menyenangkan yang selalu kita nantikan',
    imageUrl: 'https://rubim1.github.io/video/6.jpg',
    type: 'image'
  },
  {
    id: 10,
    title: 'Kenangan Masa Sekolah',
    description: 'Potret kebersamaan di masa-masa sekolah yang berharga',
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
