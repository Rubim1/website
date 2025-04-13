import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import * as THREE from 'three';

const DeveloperSection: React.FC = () => {
  const profileRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const fullText = "nah I'd adapt";

  // Social media links with actual URLs
  const socialLinks = [
    { platform: 'instagram', icon: 'fa-instagram', color: 'from-purple-600 to-pink-600', url: 'https://www.instagram.com/itsbymz2' },
    { platform: 'whatsapp', icon: 'fa-whatsapp', color: 'from-green-500 to-green-700', url: 'https://wa.me/6289522749532' },
    { platform: 'discord', icon: 'fa-discord', color: 'from-indigo-600 to-indigo-800', url: 'https://discord.gg/example' },
    { platform: 'github', icon: 'fa-github', color: 'from-gray-700 to-gray-900', url: 'https://github.com/rubim1' },
    { platform: 'youtube', icon: 'fa-youtube', color: 'from-red-600 to-red-800', url: 'https://www.youtube.com/@itsbym' }
  ];

  // Dev habits/likes with progress
  const devSkills = [
    { name: 'Malas-malasan', progress: 50 },
    { name: 'Nonton Anime', progress: 72 },
    { name: 'Baca Manga/Manwha/Manhua/Light Novel', progress: 84 },
    { name: 'Gaming', progress: 88 },
    { name: 'Tidur', progress: 40 },
    { name: 'Experiment', progress: 61 },
    { name: 'Belajar (kalo butuh)', progress: 85 },
    { name: 'Researching', progress: 79 },
    { name: 'Nonton/Scrolling YouTube/TikTok/Film/Instagram', progress: 80 }
  ];

  // Typing effect
  useEffect(() => {
    if (isTyping) {
      if (typedText.length < fullText.length) {
        const timeout = setTimeout(() => {
          setTypedText(fullText.slice(0, typedText.length + 1));
        }, 25);
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
        const timeout = setTimeout(() => {
          setIsTyping(true);
          setTypedText("");
        }, 5000);
        return () => clearTimeout(timeout);
      }
    }
  }, [typedText, isTyping]);

  // Three.js effect
  useEffect(() => {
    if (canvasRef.current && window.THREE) {
      const container = canvasRef.current;
      const scene = new THREE.Scene();
      
      const camera = new THREE.PerspectiveCamera(
        75, 
        container.clientWidth / container.clientHeight, 
        0.1, 
        1000
      );
      camera.position.z = 50;
      
      const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);
      
      // Create particles
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 2000;
      
      const posArray = new Float32Array(particlesCount * 3);
      
      for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 80;
      }
      
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      
      // Multiple particle groups with different colors
      const createParticleGroup = (color: number, size: number, opacity: number) => {
        const material = new THREE.PointsMaterial({
          size,
          color,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending
        });
        return new THREE.Points(particlesGeometry, material);
      };
      
      // Add different colored particle groups
      const particleGroups = [
        createParticleGroup(0x22d3ee, 0.2, 0.8), // Light blue
        createParticleGroup(0xffffff, 0.15, 0.5), // White
        createParticleGroup(0x3b82f6, 0.18, 0.6), // Blue
      ];
      
      particleGroups.forEach(group => scene.add(group));
      
      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        
        particleGroups[0].rotation.x += 0.0002;
        particleGroups[0].rotation.y += 0.0003;
        
        particleGroups[1].rotation.x -= 0.0003;
        particleGroups[1].rotation.z += 0.0002;
        
        particleGroups[2].rotation.y += 0.0004;
        particleGroups[2].rotation.z -= 0.0002;
        
        renderer.render(scene, camera);
      };
      
      animate();
      
      // Handle mouse movement for parallax effect
      const handleMouseMove = (event: MouseEvent) => {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        
        particleGroups.forEach((group, index) => {
          group.rotation.x += mouseY * 0.0003 * (index + 1);
          group.rotation.y += mouseX * 0.0003 * (index + 1);
        });
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      
      // Handle resize
      const handleResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      
      window.addEventListener('resize', handleResize);
      
      // Cleanup
      return () => {
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  // Impact frame effect
  const handleImpactClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    
    // Create shockwave effect
    const shockwave = document.createElement('div');
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    shockwave.style.position = 'absolute';
    shockwave.style.left = `${x}px`;
    shockwave.style.top = `${y}px`;
    shockwave.style.transform = 'translate(-50%, -50%)';
    shockwave.style.width = '10px';
    shockwave.style.height = '10px';
    shockwave.style.borderRadius = '50%';
    shockwave.style.backgroundColor = 'rgba(34, 211, 238, 0.2)';
    shockwave.style.boxShadow = '0 0 10px rgba(34, 211, 238, 0.5)';
    shockwave.style.zIndex = '10';
    shockwave.style.animation = 'ping 0.8s cubic-bezier(0, 0, 0.2, 1)';
    
    element.appendChild(shockwave);
    
    setTimeout(() => {
      element.removeChild(shockwave);
    }, 800);
  };

  return (
    <section id="developer" className="relative min-h-screen py-20 dev-cursor">
      {/* Background with cosmic effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,211,238,0.1)_0%,_rgba(0,0,0,0.7)_70%,_rgba(0,0,0,1)_100%)]"></div>
      </div>
      
      {/* Animated grid lines */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
      
      {/* 3D Particle Container */}
      <div ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block relative">
            <h2 className="text-5xl md:text-6xl font-orbitron font-bold seven-text pb-2">
              Developer Zone
            </h2>
            <div className="absolute -inset-1 bg-accent/10 blur-xl rounded-full z-0"></div>
          </div>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Enter the matrix where code transforms into digital experiences.
          </p>
        </motion.div>
        
        {/* Developer Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Profile Card */}
          <motion.div 
            className="lg:col-span-2 relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Main profile card */}
            <div className="relative bg-black/60 backdrop-blur-lg rounded-2xl border border-accent/20 overflow-hidden shadow-lg shadow-accent/5 h-full">
              {/* Glowing edges */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
                <div className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-transparent via-accent/50 to-transparent"></div>
                <div className="absolute top-0 right-0 h-full w-0.5 bg-gradient-to-b from-transparent via-accent/50 to-transparent"></div>
              </div>
              
              <div className="p-6 md:p-8 flex flex-col items-center">
                {/* Profile Image with Aura */}
                <div className="relative frame-impact mb-6" onClick={handleImpactClick}>
                  {/* Image auras */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] rounded-full bg-accent/10 animate-pulse-slow"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-white/5 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                  
                  {/* Actual image */}
                  <motion.div 
                    className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-accent/30 animate-float"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    <img 
                      src="https://rubim1.github.io/video/pfp.jpg" 
                      alt="Developer Profile" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </motion.div>
                </div>
                
                {/* Name and Title */}
                <motion.h3 
                  className="text-3xl font-orbitron font-bold text-white mb-2 text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className="relative">
                    Itsbymz
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent/50"></span>
                  </span>
                </motion.h3>
                
                <motion.p 
                  className="text-xl text-accent mb-6 text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Website Owner
                </motion.p>
                
                {/* Description with typing effect */}
                <div className="h-24 mb-6">
                  <motion.p 
                    className="text-gray-300 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {typedText}
                    <span className="inline-block w-1 h-4 bg-accent ml-1 animate-pulse"></span>
                  </motion.p>
                </div>
                
                {/* Social Media Links */}
                <motion.div 
                  className="flex justify-center gap-4 w-full mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  {socialLinks.map((link) => (
                    <motion.a 
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link frame-impact flex items-center justify-center w-12 h-12 rounded-full bg-black border border-white/10 text-white hover:border-accent/50 transition-all duration-300 group"
                      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(34, 211, 238, 0.5)" }}
                      whileTap={{ scale: 0.95 }}
                      style={{ position: 'relative', zIndex: 50 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(link.url, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <i className={`fab ${link.icon} text-xl group-hover:text-accent transition-colors`}></i>
                    </motion.a>
                  ))}
                </motion.div>
                
                {/* Resume Button */}
                <motion.a 
                  href="#"
                  className="w-full bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 rounded-lg py-3 px-6 text-center transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <i className="fas fa-file-alt mr-2"></i> Download Resume
                </motion.a>
              </div>
            </div>
          </motion.div>
          
          {/* Right Column - Skills and Projects */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Skills Section */}
            <div className="bg-black/60 backdrop-blur-lg rounded-2xl border border-accent/20 overflow-hidden shadow-lg shadow-accent/5 p-6 md:p-8 mb-8">
              <h3 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center">
                <i className="fas fa-heart text-accent mr-3"></i>
                <span>Kebiasaan/Kesukaan Dev</span>
              </h3>
              
              <div className="space-y-6">
                {devSkills.map((skill, index) => (
                  <motion.div 
                    key={skill.name}
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white">{skill.name}</span>
                      <span className="text-accent">{skill.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-accent/80 to-accent"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                      ></motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* 3D Canvas Animation Section */}
            <div className="bg-black/60 backdrop-blur-lg rounded-2xl border border-accent/20 overflow-hidden shadow-lg shadow-accent/5 p-6 md:p-8">
              <h3 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center">
                <i className="fas fa-cube text-accent mr-3"></i>
                <span>Interactive Space</span>
              </h3>
              
              <div className="aspect-video w-full bg-black/80 rounded-lg border border-accent/10 relative overflow-hidden frame-impact" onClick={handleImpactClick}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className="text-9xl text-accent font-orbitron seven-text"
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 0.95, 1]
                    }}
                    transition={{ 
                      duration: 8, 
                      repeat: Infinity,
                      ease: "linear" 
                    }}
                  >
                    7
                  </motion.div>
                </div>
                
                <div className="absolute inset-0">
                  {Array.from({ length: 20 }).map((_, index) => (
                    <motion.div
                      key={index}
                      className="absolute rounded-full bg-accent/20"
                      style={{
                        width: Math.random() * 40 + 10,
                        height: Math.random() * 40 + 10,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        x: [0, Math.random() * 100 - 50],
                        y: [0, Math.random() * 100 - 50],
                        opacity: [0, 0.7, 0]
                      }}
                      transition={{
                        duration: Math.random() * 8 + 5,
                        repeat: Infinity,
                        delay: Math.random() * 5
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <div className="inline-block text-center bg-black/40 px-6 py-3 rounded-lg border border-accent/10">
                  <p className="text-white">Hover and click around to interact with particles</p>
                  <p className="text-gray-400 text-sm mt-1">Experience the magic of interactive 3D space</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DeveloperSection;
