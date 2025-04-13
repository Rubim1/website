import React from 'react';
import { motion } from 'framer-motion';

interface NavItem {
  title: string;
  desc: string;
  url: string;
  icon: string;
  delay: number;
  external?: boolean;
}

const navItems: NavItem[] = [
  {
    title: "About Our Class",
    desc: "Learn about our amazing class and its members",
    url: "#about",
    icon: "fa-users",
    delay: 0
  },
  {
    title: "Calendar",
    desc: "View our class calendar with events and holidays",
    url: "#calendar",
    icon: "fa-calendar-alt",
    delay: 0.1
  },
  {
    title: "E-Presensi Kelas",
    desc: "Access our class attendance records",
    url: "https://docs.google.com/spreadsheets/d/1DOFuQjICT47k1L5rqpxp3ety3M7JjkD5ncvNKM5T9JI/edit?gid=1424646149#gid=1424646149",
    icon: "fa-clipboard-list",
    delay: 0.2,
    external: true
  },
  {
    title: "Jadwal Piket",
    desc: "View our class duty schedule",
    url: "#schedule",
    icon: "fa-calendar-check",
    delay: 0.3
  },
  {
    title: "The Champions",
    desc: "Celebrate our class achievements",
    url: "https://sites.google.com/guru.smp.belajar.id/webkelas7a/menu/champions",
    icon: "fa-trophy",
    delay: 0.4,
    external: true
  },
  {
    title: "E-Jurnal Kelas 7A",
    desc: "Access our class journal",
    url: "https://docs.google.com/spreadsheets/d/1Anuhn4Xv2syaUC1X8_0G9zeZ9N3Sg7wTrXaxwQS72TM/edit?gid=2005592952#gid=2005592952",
    icon: "fa-book",
    delay: 0.5,
    external: true
  }
];

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24">
      {/* Background with parallax */}
      <div 
        className="absolute inset-0 parallax-bg z-0" 
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          filter: 'brightness(0.15) contrast(1.2)'
        }}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black z-0" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping-slow"></div>
          <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-white rounded-full animate-ping-slow" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/3 left-3/4 w-1 h-1 bg-white rounded-full animate-ping-slow" style={{ animationDelay: '0.8s' }}></div>
          <div className="absolute top-2/3 left-1/5 w-1 h-1 bg-white rounded-full animate-ping-slow" style={{ animationDelay: '1.2s' }}></div>
          <div className="absolute top-1/2 left-4/5 w-1 h-1 bg-white rounded-full animate-ping-slow" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/5 left-2/5 w-1 h-1 bg-white rounded-full animate-ping-slow" style={{ animationDelay: '1.8s' }}></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <motion.div 
          className="animate-float"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-orbitron font-bold mb-4 relative inline-block">
            <span className="seven-text animate-text mr-1">7</span>
            <span className="gradient-text">AMAZING</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-text">We Are Amazing Class</p>
        </motion.div>
        
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
          {navItems.map((item, index) => (
            <motion.div
              key={index}
              className="float-card bg-black/50 backdrop-blur-md rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:border-white/50 border border-white/10"
              style={{ animationDelay: `${item.delay}s` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + item.delay }}
              whileHover={{ 
                boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
                borderColor: "rgba(255, 255, 255, 0.3)"
              }}
            >
              <div className="text-3xl text-accent mb-4">
                <i className={`fas ${item.icon}`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
              <p className="text-gray-300 mb-4">{item.desc}</p>
              <a 
                href={item.url} 
                target={item.external ? "_blank" : undefined} 
                rel={item.external ? "noopener noreferrer" : undefined}
                className="frame-impact inline-block bg-white text-black font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:bg-gray-200"
              >
                {item.external ? "Access" : "Explore"} <i className={`fas ${item.external ? "fa-external-link-alt" : "fa-arrow-right"} ml-1`}></i>
              </a>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <a 
            href="#gallery" 
            className="frame-impact inline-block bg-accent text-white font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-300 hover:bg-accent/80 hover:-translate-y-1 border border-accent/50 shadow-lg shadow-accent/10"
          >
            Explore Our Gallery <i className="fas fa-images ml-2"></i>
          </a>
        </motion.div>
        
        {/* Music player toggle */}
        <motion.div 
          className="fixed bottom-4 right-4 z-50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <button 
            className="bg-black/80 border border-white/20 rounded-full w-12 h-12 flex items-center justify-center shadow-lg shadow-black/50 hover:border-accent/50 transition-all duration-300"
            onClick={() => document.querySelector('.audio-player')?.classList.remove('minimized')}
          >
            <i className="fas fa-music text-accent"></i>
          </button>
        </motion.div>
      </div>
      
      {/* Animated down arrow */}
      <motion.div 
        className="absolute bottom-8 left-0 right-0 mx-auto text-center"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <a href="#about" className="text-white text-4xl hover:text-accent transition-colors">
          <i className="fas fa-chevron-down"></i>
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
