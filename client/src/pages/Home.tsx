import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import DeveloperSection from '@/components/DeveloperSection';
import ScheduleSection from '@/components/ScheduleSection';
import GallerySection from '@/components/GallerySection';
import CalendarSection from '@/components/CalendarSection';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';
import ImageModal from '@/components/ImageModal';
import MusicPlayer from '@/components/MusicPlayer';
import { useAppContext } from '@/contexts/AppContext';

const Home: React.FC = () => {
  const { imageModal, closeImageModal } = useAppContext();

  useEffect(() => {
    // Set page title
    document.title = '7 Amazing Class Website';
  }, []);

  return (
    <div className="bg-background text-foreground font-poppins overflow-x-hidden min-h-screen">
      <ParticleBackground />
      <Navbar />
      
      <HeroSection />
      <AboutSection />
      <DeveloperSection />
      <CalendarSection />
      <ScheduleSection />
      <GallerySection />
      <Footer />
      
      {/* Music Player */}
      <MusicPlayer />
      
      {/* Image Modal */}
      {imageModal.isOpen && <ImageModal 
        imageUrl={imageModal.imageUrl}
        title={imageModal.title}
        description={imageModal.description}
        onClose={closeImageModal}
      />}
    </div>
  );
};

export default Home;
