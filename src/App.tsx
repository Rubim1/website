import React, { useState, useEffect, useRef } from 'react';
import {
  Instagram,
  Twitter,
  Youtube,
  BookIcon as TiktokIcon,
  Disc as Discord,
  ChevronRight,
  Users,
  Calendar,
  Trophy,
  BookOpen,
  FileText,
  ArrowRight,
  Star,
  Sparkles,
  Lightbulb,
  Award,
  Rocket
} from 'lucide-react';

function App() {
  const [currentText, setCurrentText] = useState('We Are');
  const [isVisible, setIsVisible] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [particles, setParticles] = useState([]);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const scheduleRef = useRef(null);
  const galleryRef = useRef(null);

  // Handle text animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentText(prev => prev === 'We Are' ? 'The Amazing Class' : 'We Are');
        setIsVisible(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Update active section based on scroll position
      const sections = [
        { ref: heroRef, id: 'home' },
        { ref: aboutRef, id: 'about' },
        { ref: scheduleRef, id: 'schedule' },
        { ref: galleryRef, id: 'gallery' }
      ];

      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mouse move for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 5 + 1,
          speed: Math.random() * 0.5 + 0.1
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Animation for particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => ({
          ...particle,
          y: (particle.y + particle.speed) % 100
        }))
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  // Page load animation
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);

  const handleNavClick = (section) => {
    setActiveSection(section);
    setIsMenuOpen(false);
  };

  const handleTooltip = (content, e) => {
    setTooltipContent(content);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setShowTooltip(true);
  };

  const hideTooltip = () => {
    setShowTooltip(false);
  };

  // 3D tilt effect for cards
  const handleCardTilt = (e, cardElement) => {
    if (!cardElement) return;

    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = (y - centerY) / 10;
    const tiltY = (centerX - x) / 10;

    cardElement.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  };

  const resetCardTilt = (cardElement) => {
    if (!cardElement) return;
    cardElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Particle Background */}
      <div className="particles fixed inset-0 pointer-events-none z-0">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.size / 10
            }}
          />
        ))}
      </div>

      {/* Custom Cursor Follower */}
      <div
        className="fixed w-8 h-8 rounded-full border-2 border-emerald-400 pointer-events-none z-50 mix-blend-difference transition-transform duration-100"
        style={{
          transform: `translate(${cursorPosition.x - 16}px, ${cursorPosition.y - 16}px)`,
          opacity: 0.6
        }}
      />

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="fixed glass-dark p-2 rounded-md text-xs z-50 pointer-events-none"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y + 10,
            maxWidth: '200px'
          }}
        >
          {tooltipContent}
        </div>
      )}

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 glass transition-all duration-500 ${scrollY > 50 ? 'py-2' : 'py-3 md:py-4'}`}>
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="text-lg md:text-xl font-bold tracking-wider">
            <span className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600 animate-pulse-slow">
              7
            </span>
            <span className="relative">AMAZING</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About' },
              { id: 'schedule', label: 'Schedule' },
              { id: 'gallery', label: 'Gallery' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative group transition-all hover:text-emerald-400 ${activeSection === item.id ? 'text-emerald-400' : ''}`}
                onMouseEnter={(e) => handleTooltip(`View ${item.label} section`, e)}
                onMouseLeave={hideTooltip}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-400 transform origin-left transition-transform duration-300 ${activeSection === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </button>
            ))}
          </nav>

          <div className="flex space-x-4 text-sm">
            {[
              { icon: <Discord size={20} />, href: "#", tooltip: "Join our Discord" },
              { icon: <Youtube size={20} />, href: "#", tooltip: "Watch our YouTube channel" },
              { icon: <TiktokIcon size={20} />, href: "#", tooltip: "Follow us on TikTok" },
              { icon: <Instagram size={20} />, href: "https://www.instagram.com/seven__.amazing/?igsh=OHJwd3ZnMGs0dDcx", tooltip: "Follow us on Instagram" },
              { icon: <Twitter size={20} />, href: "#", tooltip: "Follow us on Twitter" }
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="hover:text-emerald-400 transition-colors transform hover:scale-110 transition-transform duration-200"
                onMouseEnter={(e) => handleTooltip(social.tooltip, e)}
                onMouseLeave={hideTooltip}
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all ${isMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-current transition-all ${isMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`}></div>
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden glass-dark absolute w-full transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 py-2 space-y-2">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About' },
              { id: 'schedule', label: 'Schedule' },
              { id: 'gallery', label: 'Gallery' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left py-2 px-4 rounded-md transition-all ${activeSection === item.id ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-white/5'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <p className="text-emerald-400 mb-2 animate-fade-in">Introducing</p>
          <h1 className="text-6xl md:text-8xl font-extrabold mb-4 animate-bounce-in">
            <span className="relative inline-block animate-float">
              <span className="relative z-10 text-glow">7</span>
              <span className="absolute -inset-1 text-black -z-10 opacity-20">7</span>
            </span>{" "}
            <span className="relative inline-block text-emerald-400 animate-float" style={{ animationDelay: '0.2s' }}>
              <span className="relative z-10 text-glow">AMAZING</span>
              <span className="absolute -inset-1 text-black -z-10 opacity-20">AMAZING</span>
            </span>
          </h1>

          <div
            className={`text-3xl md:text-4xl font-bold mb-8 h-12 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            {currentText}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto stagger-children">
            {[
              {
                icon: <Users className="text-emerald-400 group-hover:text-white transition-colors" size={28} />,
                title: "About Our Class",
                description: "Learn about our amazing class and its members",
                href: "#about"
              },
              {
                icon: <FileText className="text-emerald-400 group-hover:text-white transition-colors" size={28} />,
                title: "E-Presensi Kelas",
                description: "Access our class attendance records",
                href: "https://docs.google.com/spreadsheets/d/1DOFuQjICT47k1L5rqpxp3ety3M7JjkD5ncvNKM5T9JI/edit?gid=1424646149#gid=1424646149",
                external: true
              },
              {
                icon: <Calendar className="text-emerald-400 group-hover:text-white transition-colors" size={28} />,
                title: "Jadwal Piket",
                description: "View our class duty schedule",
                href: "#schedule"
              },
              {
                icon: <Trophy className="text-emerald-400 group-hover:text-white transition-colors" size={28} />,
                title: "The Champions",
                description: "Celebrate our class achievements",
                href: "https://sites.google.com/guru.smp.belajar.id/webkelas7a/menu/champions",
                external: true
              },
              {
                icon: <BookOpen className="text-emerald-400 group-hover:text-white transition-colors" size={28} />,
                title: "E-Jurnal Kelas 7A",
                description: "Access our class journal",
                href: "https://docs.google.com/spreadsheets/d/1Anuhn4Xv2syaUC1X8_0G9zeZ9N3Sg7wTrXaxwQS72TM/edit?gid=2005592952#gid=2005592952",
                external: true
              },
              {
                icon: <FileText className="text-emerald-400 group-hover:text-white transition-colors" size={28} />,
                title: "Likabum",
                description: "Access our class resources",
                href: "https://drive.google.com/drive/folders/1XZLEYd9cy4NaqGzrAThdZCb3ImEukDao",
                external: true
              }
            ].map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="group glass hover:bg-emerald-500 text-white p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20 border border-white/10 card-3d"
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onMouseMove={(e) => handleCardTilt(e, e.currentTarget)}
                onMouseLeave={(e) => resetCardTilt(e.currentTarget)}
              >
                <div className="card-3d-content">
                  <div className="flex items-center justify-between">
                    {item.icon}
                    <ChevronRight className="text-white opacity-0 group-hover:opacity-100 transition-all transform translate-x-0 group-hover:translate-x-1" size={20} />
                  </div>
                  <h3 className="text-xl font-bold mt-4">{item.title}</h3>
                  <p className="mt-2 text-white/70 group-hover:text-white/90">{item.description}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-12">
            <a
              href="#gallery"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Our Gallery <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 animate-shimmer"></span>
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} id="about" className="py-20 bg-slate-900 relative">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1522661067900-ab829854a57f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Background Pattern"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">About <span className="text-emerald-400 text-glow">Our Class</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto">We are 7 Amazing, a class of talented and dedicated students striving for excellence in everything we do.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="transform transition-all duration-700" style={{
              transform: `translateY(${Math.min(0, (scrollY - 800) / 5)}px)`,
              opacity: Math.min(1, Math.max(0, (scrollY - 600) / 300))
            }}>
              <h3 className="text-2xl font-bold mb-4">Our <span className="text-emerald-400">Mission</span></h3>
              <p className="text-slate-400 mb-6">
                To create a supportive learning environment where every student can thrive academically and personally.
              </p>

              <h3 className="text-2xl font-bold mb-4">Our <span className="text-emerald-400">Values</span></h3>
              <ul className="space-y-3 text-slate-400">
                {[
                  { icon: <Star size={16} />, text: "Excellence in everything we do" },
                  { icon: <Users size={16} />, text: "Respect for each other and our teachers" },
                  { icon: <Sparkles size={16} />, text: "Collaboration and teamwork" },
                  { icon: <Lightbulb size={16} />, text: "Creativity and innovation" },
                  { icon: <Award size={16} />, text: "Perseverance and determination" }
                ].map((value, index) => (
                  <li key={index} className="flex items-start group">
                    <span className="text-emerald-400 mr-2 transform group-hover:scale-110 transition-transform">{value.icon}</span>
                    <span className="group-hover:text-white transition-colors">{value.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative transform transition-all duration-700" style={{
              transform: `translateY(${Math.min(0, (scrollY - 800) / 3)}px)`,
              opacity: Math.min(1, Math.max(0, (scrollY - 600) / 300))
            }}>
              <div className="absolute -inset-4 bg-emerald-500/20 rounded-xl blur-xl animate-pulse-slow"></div>
              <div className="relative glass-dark p-6 rounded-xl border border-emerald-500/20 card-3d"
                onMouseMove={(e) => handleCardTilt(e, e.currentTarget)}
                onMouseLeave={(e) => resetCardTilt(e.currentTarget)}
              >
                <div className="card-3d-content">
                  <video
                    src="video\[16_9] DJ Tie Me Down X Kawenimerry X Ena Ena Rawi Djaffar 🎼🎵 [31D588F].mp4"
                    className="w-full aspect-video rounded-lg shadow-lg"
                    title="Class Students"
                    loading="lazy"
                    autoPlay={true}
                    loop={true}
                    muted={true} // Add this to prevent auto-playing video from playing sound
                    playsInline={true} // Add this to make the video play inline on mobile devices
                  ></video>
                <div className="mt-6">
                  <h4 className="text-xl font-bold mb-2 flex items-center">
                    <Rocket size={20} className="text-emerald-400 mr-2" />
                    Class Students
                  </h4>
                  <p className="text-slate-400">
                    Siswa Siswi Kelas 7A 😎🤪🔥
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
      </section >

    {/* Schedule Section */ }
    < section ref = { scheduleRef } id = "schedule" className = "py-20 bg-gradient-to-b from-slate-900 to-slate-800 relative" >
        <div className="absolute inset-0 opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80" 
            alt="Background Pattern" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Class <span className="text-emerald-400 text-glow">Schedule</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Our weekly schedule and duty roster to keep our class organized and running smoothly.</p>
          </div>
          
          <div className="glass-dark rounded-xl p-6 border border-white/5 shadow-xl max-w-4xl mx-auto transform transition-all duration-700" style={{ 
            transform: `translateY(${Math.min(0, (scrollY - 1400) / 5)}px)`,
            opacity: Math.min(1, Math.max(0, (scrollY - 1200) / 300))
          }}>
            <h3 className="text-2xl font-bold mb-6 text-center">Jadwal Piket</h3>
            
            <div className="flex items-center justify-center">
              {[
                { day: "Monday", students: ["Mirza", "Zevilia", "Kiano", "Dafa", "Ochi", "Radhit"] },
                { day: "Tuesday", students: ["Reno", "Yayan", "Shina", "Yazan", "Fiya", "Rexa"] },
                { day: "Wednesday", students: ["Albert", "Nazwa", "Alisya", "Bunga", "Wahyu", "Naura"] },
                { day: "Thursday", students: ["Shinta", "Nizar", "Syafa", "Keyla", "Rengga"] },
                { day: "Friday", students: ["Aleta", "Salsa", "Diandra", "Alvaro"] },
                { day: "Saturday", students: ["Tyara", "Rubim", "Faza", "Niken" ,"Neta" ,"Rafa"] }
              ].map((schedule, index) => (
                <div 
                  key={index} 
                  className="glass rounded-lg p-4 w-1/6 mx-2 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 group"
                >
                  <h4 className="font-bold text-emerald-400 mb-2 group-hover:text-glow transition-all text-center">{schedule.day}</h4>
                  <ul className="space-y-1 text-sm">
                    {schedule.students.map((student, idx) => (
                      <li key={idx} className="group-hover:text-white text-white/80 transition-colors text-center">{student}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section >
    {/* Gallery Section */ }
    < section ref = { galleryRef } id = "gallery" className = "py-20 bg-slate-800 relative" >
        <div className="absolute inset-0 opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Background Pattern" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our <span className="text-emerald-400 text-glow">Gallery</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Capturing moments and memories from our amazing class journey.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-0">
            {[
              {
                image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
                title: "Class Activity",
                description: "Learning together in our classroom"
              },
              {
                video: "video/kontol.mp4",
                title: "Togetherness",
                description: "A description of the togetherness/solidarity/camaraderie between students and their homeroom teacher.",
                autoPlay: true
              },
              {
                image: "https://images.unsplash.com/photo-1540151812223-c30b3fab58e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                title: "Field Trip",
                description: "Exploring and learning outside the classroom"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-xl aspect-square transform transition-all duration-700 animate-rotate-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <video 
                    src={item.video} 
                    autoPlay={item.autoPlay} 
                    loop 
                    muted 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-sm text-slate-300">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

    {/* Footer */ }
    < footer className = "bg-slate-900 py-12 border-t border-white/10 relative" >
        <div className="absolute inset-0 opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Background Pattern" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold tracking-wider">
                <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600 animate-pulse-slow">7</span> AMAZING
              </div>
              <p className="text-slate-400 mt-2">The Amazing Class of 2025</p>
            </div>
            
            <div className="flex space-x-6">
              {[
                { icon: <Discord size={20} />, href: "#" },
                { icon: <Youtube size={20} />, href: "#" },
                { icon: <TiktokIcon size={20} />, href: "#" },
                { icon: <Instagram size={20} />, href: "https://www.instagram.com/seven__.amazing/?igsh=OHJwd3ZnMGs0dDcx" },
                { icon: <Twitter size={20} />, href: "#" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className="text-slate-400 hover:text-emerald-400 transition-colors transform hover:scale-110 transition-transform duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-slate-500 text-sm">
            <p>&copy; 2025 7 Amazing Class. All rights reserved.</p>
          </div>
        </div>
      </footer >
    </div >
  );
}

export default App;
