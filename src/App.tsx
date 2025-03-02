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
  Rocket,
  Github,
  ChevronUp,
  Menu,
  Share2,
  Heart,
  Bell,
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  ChevronLeft,
  Shuffle,
  ListMusic,
  VolumeX,
  PlusCircle,
  Trash2,
  ChevronDown,
  Phone,
  RefreshCcw
} from 'lucide-react';
import Loading from './components/Loading';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const developersRef = useRef(null);
  const scheduleRef = useRef(null);
  const galleryRef = useRef(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playlists, setPlaylists] = useState(() => {
    const savedPlaylists = localStorage.getItem('audioPlaylists');
    return savedPlaylists ? JSON.parse(savedPlaylists) : {
      'Default': [
        { 
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          title: 'Rick Astley - Never Gonna Give You Up'
        },
        {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
          title: 'Luis Fonsi - Despacito'
        },
        {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=JGwWNGJdvx8',
          title: 'Ed Sheeran - Shape of You'
        }
      ],
      'My Playlist': []
    };
  });
  const [currentPlaylist, setCurrentPlaylist] = useState('Default');
  const [showPlaylistManager, setShowPlaylistManager] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const audioRef = useRef(null);
  const calendarRef = useRef(null);

  const playlist = playlists[currentPlaylist] || [];

  const generateYearlyEvents = (year) => {
    const historicalEvents = [
      // National Historical Events
      { 
        day: "17", month: "08", 
        title: "Proklamasi Kemerdekaan Indonesia (1945)", 
        type: "historical",
        description: "Soekarno dan Hatta memproklamasikan kemerdekaan Indonesia di Jalan Pegangsaan Timur 56, Jakarta",
        region: "national" 
      },
      { 
        day: "10", month: "11", 
        title: "Hari Pahlawan - Pertempuran Surabaya (1945)", 
        type: "historical",
        description: "Pertempuran heroik rakyat Surabaya melawan pasukan Sekutu, dipimpin oleh Bung Tomo",
        region: "east-java" 
      },
      { 
        day: "28", month: "10", 
        title: "Sumpah Pemuda (1928)", 
        type: "historical",
        description: "Momentum persatuan pemuda Indonesia dengan satu tanah air, satu bangsa, dan satu bahasa",
        region: "national" 
      },
      { 
        day: "20", month: "05", 
        title: "Hari Kebangkitan Nasional (1908)", 
        type: "historical",
        description: "Berdirinya organisasi Boedi Oetomo oleh Dr. Wahidin Sudirohusodo",
        region: "national" 
      },
      { 
        day: "01", month: "06", 
        title: "Lahirnya Pancasila (1945)", 
        type: "historical",
        description: "Soekarno menyampaikan pidato tentang dasar negara yang kemudian dikenal sebagai Pancasila",
        region: "national" 
      },
      { 
        day: "21", month: "04", 
        title: "Hari Kartini (1879)", 
        type: "historical",
        description: "Lahirnya R.A. Kartini, pelopor emansipasi wanita Indonesia",
        region: "central-java" 
      },
      // Additional Historical Events
      { 
        day: "19", month: "09", 
        title: "Serangan Umum 1 Maret (1949)", 
        type: "historical",
        description: "Serangan 6 jam di Yogyakarta yang dipimpin Letkol Soeharto",
        region: "yogyakarta" 
      },
      { 
        day: "25", month: "11", 
        title: "Hari Guru (1945)", 
        type: "historical",
        description: "Berdirinya PGRI (Persatuan Guru Republik Indonesia)",
        region: "national" 
      },
      { 
        day: "15", month: "12", 
        title: "Operasi Trikora (1961)", 
        type: "historical",
        description: "Operasi pembebasan Irian Barat yang dikomandoi Soekarno",
        region: "papua" 
      },
      { 
        day: "05", month: "07", 
        title: "Serangan Umum Surabaya (1947)", 
        type: "historical",
        description: "Perlawanan rakyat Surabaya dalam Agresi Militer Belanda I",
        region: "east-java" 
      },
      // Regional Historical Events
      { 
        day: "24", month: "09", 
        title: "Perang Padri (1821-1837)", 
        type: "historical",
        description: "Konflik antara kaum Padri dan kaum Adat di Minangkabau",
        region: "sumatra" 
      },
      { 
        day: "14", month: "02", 
        title: "Sultan Hasanuddin (1670)", 
        type: "historical",
        description: "Perjanjian Bongaya yang menandai akhir perlawanan Sultan Hasanuddin",
        region: "sulawesi" 
      }
    ];

    const internationalEvents = [
      { 
        day: "15", month: "08", 
        title: "Jepang Menyerah dalam Perang Dunia II (1945)", 
        type: "historical",
        description: "Kekalahan Jepang membuka jalan bagi Kemerdekaan Indonesia",
        region: "international",
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Surrender_of_Japan_-_USS_Missouri.jpg/320px-Surrender_of_Japan_-_USS_Missouri.jpg"
      },
      { 
        day: "27", month: "12", 
        title: "Agresi Militer Belanda I (1947)", 
        type: "historical",
        description: "Serangan militer Belanda terhadap wilayah Republik Indonesia",
        region: "international",
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Dutch_soldiers_in_Jakarta%2C_1947.jpg/320px-Dutch_soldiers_in_Jakarta%2C_1947.jpg"
      },
      { 
        day: "23", month: "08", 
        title: "Konferensi Asia Afrika (1955)", 
        type: "historical",
        description: "Konferensi bersejarah di Bandung yang memperkuat solidaritas Asia-Afrika",
        region: "international",
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Asian_-_African_Conference.jpg/320px-Asian_-_African_Conference.jpg"
      }
    ];

    const additionalRegionalEvents = [
      { 
        day: "12", month: "03", 
        title: "Kerajaan Sriwijaya (683)", 
        type: "historical",
        description: "Prasasti Kedukan Bukit - Bukti tertua keberadaan Kerajaan Sriwijaya",
        region: "sumatra",
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Kedukan_Bukit_Inscription_Museum_Nasional_Indonesia_2017.jpg/320px-Kedukan_Bukit_Inscription_Museum_Nasional_Indonesia_2017.jpg"
      },
      { 
        day: "01", month: "03", 
        title: "Kerajaan Majapahit (1293)", 
        type: "historical",
        description: "Pendirian Kerajaan Majapahit oleh Raden Wijaya",
        region: "east-java",
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Majapahit_Temple.jpg/320px-Majapahit_Temple.jpg"
      }
    ];

    const existingHistoricalEvents = [
      ...historicalEvents,
      ...internationalEvents,
      ...additionalRegionalEvents
    ];

    const yearlyEvents = [
      { day: "01", month: "01", title: "Tahun Baru", type: "holiday" },
      { day: "14", month: "02", title: "Hari Valentine", type: "celebration" },
      { day: "21", month: "02", title: "Hari Bahasa Ibu", type: "celebration" },
      { day: "08", month: "03", title: "Hari Wanita Internasional", type: "celebration" },
      { day: "21", month: "04", title: "Hari Kartini", type: "celebration" },
      { day: "22", month: "04", title: "Hari Bumi", type: "celebration" },
      { day: "01", month: "05", title: "Hari Buruh", type: "holiday" },
      { day: "02", month: "05", title: "Hari Pendidikan Nasional", type: "celebration" },
      { day: "20", month: "05", title: "Hari Kebangkitan Nasional", type: "celebration" },
      { day: "01", month: "06", title: "Hari Pancasila", type: "holiday" },
      { day: "05", month: "06", title: "Hari Lingkungan Hidup", type: "celebration" },
      { day: "16", month: "06", title: "Hari Ayah", type: "celebration" },
      { day: "17", month: "08", title: "Hari Kemerdekaan", type: "holiday" },
      { day: "19", month: "08", title: "Hari Fotografi", type: "celebration" },
      { day: "01", month: "10", title: "Hari Kesaktian Pancasila", type: "celebration" },
      { day: "05", month: "10", title: "Hari Guru", type: "celebration" },
      { day: "28", month: "10", title: "Hari Sumpah Pemuda", type: "celebration" },
      { day: "10", month: "11", title: "Hari Pahlawan", type: "celebration" },
      { day: "25", month: "12", title: "Hari Natal", type: "holiday" },
      { day: "31", month: "12", title: "Malam Tahun Baru", type: "holiday" }
    ];

    const islamicHolidays = [
      { date: `${year}-03-11`, title: "Isra Miraj", type: "holiday" },
      { date: `${year}-03-28`, title: "Awal Ramadhan", type: "holiday" },
      { date: `${year}-03-31`, title: "Idul Fitri", type: "holiday" },
      { date: `${year}-04-01`, title: "Idul Fitri Hari Kedua", type: "holiday" },
      { date: `${year}-06-17`, title: "Idul Adha", type: "holiday" },
      { date: `${year}-07-07`, title: "Tahun Baru Islam", type: "holiday" },
      { date: `${year}-09-29`, title: "Maulid Nabi", type: "holiday" }
    ];

    const culturalHolidays = [
      { date: `${year}-02-01`, title: "Tahun Baru Imlek", type: "holiday" },
      { date: `${year}-03-28`, title: "Nyepi", type: "holiday" },
      { date: `${year}-04-19`, title: "Wafat Isa Almasih", type: "holiday" },
      { date: `${year}-05-26`, title: "Hari Raya Waisak", type: "holiday" }
    ];

    const allEvents = [...existingHistoricalEvents, ...yearlyEvents].map(event => ({
      date: `${year}-${event.month}-${event.day}`,
      title: event.title,
      type: event.type,
      description: event.description,
      region: event.region,
      photo: event.photo
    }));

    return [...allEvents, ...islamicHolidays, ...culturalHolidays];
  };

  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    const customEvents = savedEvents ? JSON.parse(savedEvents) : [];
    
    const currentYear = new Date().getFullYear();
    
    const yearEvents = [
      ...generateYearlyEvents(currentYear),
      ...generateYearlyEvents(currentYear + 1)
    ];
    
    return [...customEvents, ...yearEvents];
  });

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date().toISOString().split('T')[0],
    type: "custom"
  });

  const handleAddEvent = (e) => {
    e.preventDefault();
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    setNewEvent({
      title: "",
      date: new Date().toISOString().split('T')[0],
      type: "custom"
    });
  };

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

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      const sections = [
        { ref: heroRef, id: 'home' },
        { ref: aboutRef, id: 'about' },
        { ref: developersRef, id: 'developers' },
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

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    const handleCalendarTilt = (e) => {
      if (!calendarRef.current) return;
      const rect = calendarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = (y - centerY) / 20;
      const tiltY = (centerX - x) / 20;
      calendarRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    };

    const resetCalendarTilt = () => {
      if (!calendarRef.current) return;
      calendarRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };

    const calendar = calendarRef.current;
    if (calendar) {
      calendar.addEventListener('mousemove', handleCalendarTilt);
      calendar.addEventListener('mouseleave', resetCalendarTilt);
    }

    return () => {
      if (calendar) {
        calendar.removeEventListener('mousemove', handleCalendarTilt);
        calendar.removeEventListener('mouseleave', resetCalendarTilt);
      }
    };
  }, []);

  useEffect(() => {
    const handleAudioVolume = () => {
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    };

    handleAudioVolume();
  }, [volume]);

  const togglePlay = () => {
    if (playlist.length === 0) return;
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTrackChange = (direction) => {
    if (playlist.length === 0) return;

    const newTrack = direction === 'next'
      ? (currentTrack + 1) % playlist.length
      : (currentTrack - 1 + playlist.length) % playlist.length;

    setCurrentTrack(newTrack);
    setCustomAudioLink(playlist[newTrack].url);
    setAudioSource(playlist[newTrack].type);
    setIsPlaying(true);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const handleNavClick = (section) => {
    setActiveSection(section);
    setIsMenuOpen(false);
    
    if (section === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }

    const sectionRef = {
      'about': aboutRef,
      'developers': developersRef,
      'schedule': scheduleRef,
      'gallery': galleryRef
    }[section];

    if (sectionRef?.current) {
      sectionRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const handleTooltip = (content, e) => {
    setTooltipContent(content);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setShowTooltip(true);
  };

  const hideTooltip = () => {
    setShowTooltip(false);
  };

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

  const [selectedEventTypes, setSelectedEventTypes] = useState(['all']);
  const [selectedRegion, setSelectedRegion] = useState('all');

  const eventTypes = [
    { id: 'all', label: 'Semua' },
    { id: 'holiday', label: 'Hari Libur' },
    { id: 'historical', label: 'Sejarah' },
    { id: 'celebration', label: 'Perayaan' }
  ];

  const regions = [
    { id: 'all', label: 'Semua Wilayah' },
    { id: 'national', label: 'Nasional' },
    { id: 'east-java', label: 'Jawa Timur' },
    { id: 'central-java', label: 'Jawa Tengah' },
    { id: 'yogyakarta', label: 'Yogyakarta' },
    { id: 'sumatra', label: 'Sumatra' },
    { id: 'sulawesi', label: 'Sulawesi' },
    { id: 'papua', label: 'Papua' },
    { id: 'international', label: 'Internasional' }
  ];

  const filterEvents = (events) => {
    return events.filter(event => {
      const typeMatch = selectedEventTypes.includes('all') || selectedEventTypes.includes(event.type);
      const regionMatch = selectedRegion === 'all' || event.region === selectedRegion;
      return typeMatch && regionMatch;
    });
  };

  const TimelineView = () => {
    const sortedEvents = filterEvents(events)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
      <div className="relative space-y-8 before:content-[''] before:absolute before:top-0 before:left-4 before:h-full before:w-0.5 before:bg-emerald-500/20">
        {sortedEvents.map((event, i) => (
          <div key={i} className="relative pl-10">
            <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full border-2 border-emerald-500 bg-slate-900 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
            </div>
            <div className={`p-4 rounded-lg transition-all duration-300
              ${event.type === 'holiday' 
                ? 'bg-purple-500/10 border-purple-500/20'
                : event.type === 'celebration'
                ? 'bg-pink-500/10 border-pink-500/20'
                : event.type === 'historical'
                ? 'bg-amber-500/10 border-amber-500/20'
                : 'bg-emerald-500/10 border-emerald-500/20'}`}
            >
              <div className="text-sm text-slate-400">
                {new Date(event.date).toLocaleDateString('id-ID', { 
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
              <div className="font-semibold mt-1">{event.title}</div>
              {event.description && (
                <div className="mt-2 text-sm opacity-80">{event.description}</div>
              )}
              {event.photo && (
                <img 
                  src={event.photo} 
                  alt={event.title}
                  className="mt-3 rounded-lg w-full max-w-md object-cover"
                  loading="lazy"
                />
              )}
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-slate-800">
                  {event.type === 'holiday' 
                    ? 'Hari Libur' 
                    : event.type === 'celebration'
                    ? 'Perayaan'
                    : event.type === 'historical'
                    ? 'Peristiwa Bersejarah'
                    : 'Event'}
                </span>
                {event.region && (
                  <span className="px-2 py-1 rounded-full bg-slate-800">
                    {regions.find(r => r.id === event.region)?.label}
                  </span>
                )}
                {event.source === 'google' && (
                  <span className="px-2 py-1 rounded-full bg-blue-400">
                    Google Calendar
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'timeline'

  const [customAudioLink, setCustomAudioLink] = useState('');
  const [audioSource, setAudioSource] = useState('default'); // 'default', 'youtube', 'tiktok', 'spotify', 'custom'
  const [showAudioInput, setShowAudioInput] = useState(false);

  const addPlaylist = (name) => {
    if (name && !playlists[name]) {
      setPlaylists({
        ...playlists,
        [name]: []
      });
      setNewPlaylistName('');
    }
  };

  const addToPlaylist = (track) => {
    if (currentPlaylist !== 'Default') {
      setPlaylists({
        ...playlists,
        [currentPlaylist]: [...playlists[currentPlaylist], track]
      });
    }
  };

  const removeFromPlaylist = (playlistName, index) => {
    const updatedTracks = [...playlists[playlistName]];
    updatedTracks.splice(index, 1);
    setPlaylists({
      ...playlists,
      [playlistName]: updatedTracks
    });
  };

  const deletePlaylist = (name) => {
    if (name !== 'Default') {
      const { [name]: removed, ...rest } = playlists;
      setPlaylists(rest);
      if (currentPlaylist === name) {
        setCurrentPlaylist('Default');
      }
    }
  };

  useEffect(() => {
    localStorage.setItem('audioPlaylists', JSON.stringify(playlists));
  }, [playlists]);

  const getYouTubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getSpotifyTrackId = (url) => {
    const regex = /track\/([a-zA-Z0-9]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleAudioLinkSubmit = (e) => {
    e.preventDefault();
    if (!customAudioLink) return;

    if (customAudioLink.includes('youtube.com') || customAudioLink.includes('youtu.be')) {
      setAudioSource('youtube');
    } else if (customAudioLink.includes('spotify.com')) {
      setAudioSource('spotify');
    } else if (customAudioLink.includes('tiktok.com')) {
      setAudioSource('tiktok');
    } else {
      setAudioSource('custom');
    }

    setIsPlaying(true);
  };

  const currentTrackData = playlist[currentTrack] || { title: 'No track selected', artist: '' };

  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);

  // Function to fetch holidays from Google Calendar API
  const fetchGoogleCalendarHolidays = async (year) => {
    try {
      // Indonesian Holidays Calendar ID
      const calendarId = 'id.indonesian#holiday@group.v.calendar.google.com';
      // To get a Google API key:
      // 1. Go to https://console.cloud.google.com/
      // 2. Create a new project
      // 3. Enable the Google Calendar API
      // 4. Create credentials (API key)
      // 5. Replace 'YOUR_API_KEY' with your actual API key
      const apiKey = 'AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs'; // API key publik untuk demo
      
      const timeMin = `${year}-01-01T00:00:00Z`;
      const timeMax = `${year}-12-31T23:59:59Z`;
      
      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.items) {
        const googleEvents = data.items.map(item => {
          const eventDate = new Date(item.start.date || item.start.dateTime);
          return {
            date: eventDate.toISOString().split('T')[0],
            title: item.summary,
            description: item.description || '',
            type: 'holiday',
            source: 'google'
          };
        });
        
        return googleEvents;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching Google Calendar events:', error);
      return [];
    }
  };

  // Function to update calendar with Google events
  const updateCalendarWithGoogleEvents = async () => {
    setIsLoadingEvents(true);
    const currentYear = new Date().getFullYear();
    
    try {
      const googleEvents = [
        ...await fetchGoogleCalendarHolidays(currentYear),
        ...await fetchGoogleCalendarHolidays(currentYear + 1)
      ];
      
      // Filter out existing Google events
      const filteredEvents = events.filter(event => event.source !== 'google');
      
      // Add new Google events
      setEvents([...filteredEvents, ...googleEvents]);
      
      // Save to localStorage
      localStorage.setItem('calendarEvents', JSON.stringify([...filteredEvents, ...googleEvents]));
    } catch (error) {
      console.error('Error updating calendar with Google events:', error);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  // Effect to fetch Google Calendar events when component mounts
  useEffect(() => {
    // Mengambil acara dari Google Calendar saat komponen dimuat
    updateCalendarWithGoogleEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white transition-all duration-500 overflow-hidden overflow-x-hidden">
      {isLoading && <Loading />}
      <style>
        {`
          html {
            scroll-behavior: smooth;
          }
          
          .section-animate {
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            will-change: transform, opacity;
          }
          
          .transform-gpu {
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
            perspective: 1000px;
            will-change: transform;
          }
        `}
      </style>

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
              { id: 'developers', label: 'Developers' },
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
              { icon: <Discord size={20} />, href: "https://example.com/discord", tooltip: "Join our Discord" },
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
              { id: 'developers', label: 'Developers' },
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

      {/* About Section with improved animations */}
      <section 
        ref={aboutRef} 
        id="about" 
        className="py-20 bg-slate-900 relative section-animate transform-gpu"
      >
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
            <div 
              className="section-animate transform-gpu"
              style={{
                transform: `translate3d(0, ${Math.min(0, (scrollY - 800) / 5)}px, 0)`,
                opacity: Math.min(1, Math.max(0, (scrollY - 600) / 300))
              }}
            >
              <h3 className="text-2xl font-bold mb-4">Our <span className="text-emerald-400">Mission</span></h3>
              <p className="text-slate-400 mb-6">
                To create a supportive learning environment where every student can thrive academically and personally.
              </p>

              <h3 className="text-2xl font-bold mb-4">Our <span className="text-emerald-400">Values</span></h3>
              <ul className="space-y-3 text-sm">
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
                    src="https://rubim1.github.io/video/%5B16_9%5D%20DJ%20Tie%20Me%20Down%20X%20Kawenimerry%20X%20Ena%20Ena%20Rawi%20Djaffar%20%F0%9F%8E%BC%F0%9F%8E%B5%20%5B31D588F%5D.mp4"
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
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

    {/* Developers Section */}
    <section
      ref={developersRef}
      id="developers"
      className="py-20 bg-gradient-to-b from-slate-800 to-slate-900 relative section-animate transform-gpu"
    >
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://images.unsplash.com/photo-1555066931-bf19f8fd1085?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Background Pattern"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Meet The <span className="text-emerald-400 text-glow">Developer</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto">The creative mind behind the design and development of our class website.</p>
        </div>

        <div className="max-w-md mx-auto">
          <div
            className="glass hover:bg-emerald-500/10 p-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20 border border-white/10 card-3d"
            onMouseMove={(e) => handleCardTilt(e, e.currentTarget)}
            onMouseLeave={(e) => resetCardTilt(e.currentTarget)}
          >
            <div className="card-3d-content">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse-slow"></div>
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                  alt="Rubim"
                  className="w-full h-full object-cover rounded-full relative z-10 border-2 border-emerald-400/50"
                />
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">Itsbymz(rubim)</h3>
              <p className="text-emerald-400 text-center text-sm mb-4">Full Stack Developer & Website Owner</p>
              <p className="text-slate-400 text-center mb-6">Kenalin Gw Itsbymz Selaku Developer Dan Website Owner Dari Kelas 7A, Dan Di Bawah Ini Adalah Sosial Media Gw.</p>
              <div className="flex justify-center space-x-4">
                <a
                  href="https://github.com/Rubim1"
                  className="text-slate-400 hover:text-emerald-400 transition-colors transform hover:scale-110 transition-transform duration-200"
                  onMouseEnter={(e) => handleTooltip('Follow on GitHub', e)}
                  onMouseLeave={hideTooltip}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={22} />
                </a>
                <a
                  href="https://www.youtube.com/@itsbym"
                  className="text-slate-400 hover:text-emerald-400 transition-colors transform hover:scale-110 transition-transform duration-200"
                  onMouseEnter={(e) => handleTooltip('Subscribe on YouTube', e)}
                  onMouseLeave={hideTooltip}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube size={22} />
                </a>
                <a
                  href="https://www.tiktok.com/@itsbymz"
                  className="text-slate-400 hover:text-emerald-400 transition-colors transform hover:scale-110 transition-transform duration-200"
                  onMouseEnter={(e) => handleTooltip('Follow on TikTok', e)}
                  onMouseLeave={hideTooltip}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TiktokIcon size={22} />
                </a>
                <a
                  href="https://wa.me/6289522749532"
                  className="text-slate-400 hover:text-emerald-400 transition-colors transform hover:scale-110 transition-transform duration-200"
                  onMouseEnter={(e) => handleTooltip('Chat on WhatsApp', e)}
                  onMouseLeave={hideTooltip}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone size={22} />
                </a>
                <a
                  href="https://www.instagram.com/itsbymz2/"
                  className="text-slate-400 hover:text-emerald-400 transition-colors transform hover:scale-110 transition-transform duration-200"
                  onMouseEnter={(e) => handleTooltip('Follow on Instagram', e)}
                  onMouseLeave={hideTooltip}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram size={22} />
                </a>
                <a
                  href=""
                  className="text-slate-400 hover:text-emerald-400 transition-colors transform hover:scale-110 transition-transform duration-200"
                  onMouseEnter={(e) => handleTooltip('My Discord:rubum.', e)}
                  onMouseLeave={hideTooltip}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Discord size={22} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Schedule Section with improved animations */ }
    < section 
      ref={scheduleRef} 
      id="schedule" 
      className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 relative section-animate"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Class <span className="text-emerald-400 text-glow">Schedule</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Stay updated with our class activities and important dates.</p>
        </div>

        {/* Grid Layout for Schedule and Calendar */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Schedule Cards */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Weekly Schedule</h3>
            <div className="flex flex-wrap -mx-2">
              {[
                { day: "Monday", students: ["Mirza", "Zevilia", "Kiano", "Dafa", "Ochi", "Radhit"] },
                { day: "Tuesday", students: ["Reno", "Yayan", "Shina", "Yazan", "Fiya", "Rexa"] },
                { day: "Wednesday", students: ["Albert", "Nazwa", "Alisya", "Bunga", "Wahyu", "Naura"] },
                { day: "Thursday", students: ["Shinta", "Nizar", "Syafa", "Keyla", "Rengga"] },
                { day: "Friday", students: ["Aleta", "Salsa", "Diandra", "Alvaro"] },
                { day: "Saturday", students: ["Tyara", "Rubim", "Faza", "Niken", "Neta", "Rafa"] }
              ].map((schedule, index) => (
                <div 
                  key={index} 
                  className="w-full sm:w-1/2 p-2"
                >
                  <div className="glass rounded-lg p-4 border border-white/10 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
                    <h4 className="font-bold text-emerald-400 mb-2">{schedule.day}</h4>
                    <ul className="space-y-1 text-sm">
                      {schedule.students.map((student, idx) => (
                        <li key={idx} className="text-slate-300">{student}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Section */}
          <div className="glass rounded-xl p-6 border border-white/10">
            {/* Add Event Form */}
            <form onSubmit={handleAddEvent} className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-white/5">
              <h4 className="font-semibold text-emerald-400 mb-4">Add New Event</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Event Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700/50 rounded border border-white/10 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700/50 rounded border border-white/10 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
                >
                  Add Event
                </button>
              </div>
            </form>

            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <ChevronLeft />
              </button>
              <div className="flex items-center">
                <h3 className="text-lg font-bold">
                  {currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                  onClick={() => updateCalendarWithGoogleEvents()}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors ml-2"
                  disabled={isLoadingEvents}
                >
                  {isLoadingEvents ? (
                    <span className="animate-spin">
                      <RefreshCcw size={20} />
                    </span>
                  ) : (
                    <RefreshCcw size={20} />
                  )}
                </button>
              </div>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <ChevronRight />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                <div key={day} className="text-emerald-400 font-semibold">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {Array.from({ length: getDaysInMonth(currentDate).firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8" />
              ))}
              {Array.from({ length: getDaysInMonth(currentDate).daysInMonth }).map((_, i) => {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
                const isSelected = selectedDate.toDateString() === date.toDateString();
                const isToday = new Date().toDateString() === date.toDateString();
                const hasEvent = events.some(event => new Date(event.date).toDateString() === date.toDateString());
                
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    className={`h-8 rounded-full flex items-center justify-center transition-all relative group
                      ${isSelected ? 'bg-emerald-500 text-white' : 'hover:bg-emerald-500/20'}
                      ${isToday ? 'ring-2 ring-emerald-400' : ''}
                      ${hasEvent ? 'font-bold' : ''}
                    `}
                  >
                    {i + 1}
                    {hasEvent && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Event List */}
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold text-emerald-400 mb-2">Events</h4>
              {filterEvents(events)
                .filter(event => new Date(event.date).toDateString() === selectedDate.toDateString())
                .map((event, i) => (
                  <div
                    key={i}
                    className={`text-sm p-3 rounded-lg border transition-all duration-300
                      ${event.type === 'holiday' 
                        ? 'bg-purple-500/10 border-purple-500/20'
                        : event.type === 'celebration'
                        ? 'bg-pink-500/10 border-pink-500/20'
                        : event.type === 'historical'
                        ? 'bg-amber-500/10 border-amber-500/20'
                        : 'bg-emerald-500/10 border-emerald-500/20'}`}
                  >
                    <div className="font-semibold">{event.title}</div>
                    {event.description && (
                      <div className="mt-1 text-xs opacity-80">{event.description}</div>
                    )}
                    <div className="text-xs mt-2 flex items-center gap-2">
                      <span>
                        {event.type === 'holiday' 
                          ? 'Hari Libur' 
                          : event.type === 'celebration'
                          ? 'Perayaan'
                          : event.type === 'historical'
                          ? 'Peristiwa Bersejarah'
                          : 'Event'}
                      </span>
                      {event.region && event.region !== 'national' && (
                        <>
                          <span className="opacity-50">•</span>
                          <span>{regions.find(r => r.id === event.region)?.label}</span>
                        </>
                      )}
                      {event.source === 'google' && (
                        <span className="px-2 py-1 rounded-full bg-blue-400">
                          Google Calendar
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Event Filters */}
    <div className="mb-6 space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-emerald-400 mb-2">Jenis Event</h4>
        <div className="flex flex-wrap gap-2">
          {eventTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedEventTypes(
                type.id === 'all' ? ['all'] : 
                selectedEventTypes.includes(type.id) 
                  ? selectedEventTypes.filter(t => t !== type.id)
                  : [...selectedEventTypes.filter(t => t !== 'all'), type.id]
              )}
              className={`px-3 py-1 rounded-full text-sm transition-all
                ${selectedEventTypes.includes(type.id)
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-emerald-400 mb-2">Wilayah</h4>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="bg-slate-800 text-slate-200 rounded-lg px-3 py-1 w-full max-w-xs"
        >
          {regions.map(region => (
            <option key={region.id} value={region.id}>
              {region.label}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* View Toggle */}
    <div className="mb-4 flex justify-end">
      <div className="bg-slate-800 rounded-lg p-1 inline-flex">
        <button
          onClick={() => setViewMode('calendar')}
          className={`px-3 py-1 rounded text-sm transition-all
            ${viewMode === 'calendar'
              ? 'bg-emerald-500 text-white'
              : 'text-slate-400 hover:text-slate-200'}`}
        >
          Kalender
        </button>
        <button
          onClick={() => setViewMode('timeline')}
          className={`px-3 py-1 rounded text-sm transition-all
            ${viewMode === 'timeline'
              ? 'bg-emerald-500 text-white'
              : 'text-slate-400 hover:text-slate-200'}`}
        >
          Timeline
        </button>
      </div>
    </div>

    {/* Conditional Render based on viewMode */}
    {viewMode === 'calendar' ? (
      <div className="calendar-view">
        {/* Existing Calendar Code */}
      </div>
    ) : (
      <TimelineView />
    )}

    {/* Audio Player Section */}
    <section className={`fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-lg border-t border-white/10 z-50 transition-all duration-300 ${isPlayerMinimized ? 'h-16' : ''}`}>
      <div className="container mx-auto px-4 py-3">
        {/* Minimize Toggle */}
        <div className="absolute right-4 top-2 flex items-center gap-2">
          <button
            onClick={() => setIsPlayerMinimized(!isPlayerMinimized)}
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
            title={isPlayerMinimized ? "Expand Player" : "Minimize Player"}
          >
            {isPlayerMinimized ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {/* Always Visible Controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{currentTrackData.title}</div>
              {!isPlayerMinimized && (
                <div className="text-sm text-emerald-400 truncate">{currentTrackData.artist}</div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleTrackChange('prev')}
                className={`text-slate-400 hover:text-emerald-400 transition-colors ${playlist.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={playlist.length === 0}
              >
                <SkipBack size={20} />
              </button>
              <button
                onClick={togglePlay}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  playlist.length === 0 
                    ? 'bg-slate-600 cursor-not-allowed' 
                    : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
                disabled={playlist.length === 0}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button
                onClick={() => handleTrackChange('next')}
                className={`text-slate-400 hover:text-emerald-400 transition-colors ${playlist.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={playlist.length === 0}
              >
                <SkipForward size={20} />
              </button>
            </div>

            {/* Volume Control - Always visible on desktop, hidden on mobile when minimized */}
            <div className={`items-center gap-2 ${isPlayerMinimized ? 'hidden md:flex' : 'flex'}`}>
              <button
                onClick={() => setVolume(v => v === 0 ? 0.7 : 0)}
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 accent-emerald-500"
              />
            </div>
          </div>

          {/* Expandable Content */}
          {!isPlayerMinimized && (
            <div className="space-y-3">
              {/* Top Controls: Playlist & Volume */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowPlaylistManager(!showPlaylistManager)}
                    className="text-emerald-400 hover:text-emerald-300 transition-colors"
                    title="Playlist Manager"
                  >
                    <ListMusic size={20} />
                  </button>
                  
                  <select
                    value={currentPlaylist}
                    onChange={(e) => setCurrentPlaylist(e.target.value)}
                    className="bg-slate-800 text-slate-200 rounded-lg px-2 py-1 text-sm border border-slate-700"
                  >
                    {Object.keys(playlists).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>

                  {/* Create New Playlist */}
                  {showPlaylistManager && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        placeholder="New playlist name..."
                        className="bg-slate-800 rounded-lg px-2 py-1 text-sm border border-slate-700 focus:border-emerald-500 focus:outline-none"
                      />
                      <button
                        onClick={() => addPlaylist(newPlaylistName)}
                        className="px-2 py-1 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 transition-colors"
                      >
                        Create
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Always Show Current Playlist */}
              <div className="bg-slate-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-emerald-400">
                    {currentPlaylist} Playlist
                  </h3>
                  {currentPlaylist !== 'Default' && playlist.length > 0 && (
                    <button
                      onClick={() => deletePlaylist(currentPlaylist)}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete Playlist
                    </button>
                  )}
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {playlist.map((track, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentTrack(index);
                        setCustomAudioLink(track.url);
                        setAudioSource(track.type);
                        setIsPlaying(true);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                        index === currentTrack
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    >
                      <span className="text-sm truncate flex-1">{track.title}</span>
                      {currentPlaylist !== 'Default' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromPlaylist(currentPlaylist, index);
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors ml-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </button>
                  ))}
                  {playlist.length === 0 && (
                    <div className="text-sm text-slate-400 text-center py-2">
                      No tracks in this playlist
                    </div>
                  )}
                </div>
              </div>

              {/* Add Music Form */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setShowAudioInput(!showAudioInput)}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                  title="Add Music"
                >
                  <Music size={20} />
                </button>
                
                {showAudioInput && (
                  <div className="flex-1">
                    <form onSubmit={handleAudioLinkSubmit} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={customAudioLink}
                        onChange={(e) => setCustomAudioLink(e.target.value)}
                        placeholder="Paste YouTube, Spotify, TikTok, or direct audio link..."
                        className="flex-1 bg-slate-800 rounded-lg px-3 py-1 text-sm border border-slate-700 focus:border-emerald-500 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 transition-colors"
                      >
                        Play
                      </button>
                    </form>

                    {currentPlaylist !== 'Default' && (
                      <button
                        type="button"
                        onClick={() => addToPlaylist({
                          type: audioSource,
                          url: customAudioLink,
                          title: customAudioLink.split('/').pop() || 'Custom Track'
                        })}
                        className={`w-full px-3 py-1 rounded-lg text-sm flex items-center justify-center gap-1 ${
                          customAudioLink 
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        } transition-colors`}
                        disabled={!customAudioLink}
                      >
                        <PlusCircle size={16} />
                        Add to {currentPlaylist}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Help Text */}
              {currentPlaylist === 'Default' && showAudioInput && (
                <div className="text-sm text-amber-400">
                  Select a different playlist to add custom tracks
                </div>
              )}

              {/* Media Players */}
              {audioSource !== 'default' && (
                <div className="rounded-lg overflow-hidden bg-slate-800">
                  {audioSource === 'youtube' && (
                    <iframe
                      width="100%"
                      height="80"
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(customAudioLink)}?autoplay=1&controls=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                  
                  {audioSource === 'spotify' && (
                    <iframe
                      src={`https://open.spotify.com/embed/track/${getSpotifyTrackId(customAudioLink)}`}
                      width="100%"
                      height="80"
                      allow="encrypted-media"
                    ></iframe>
                  )}
                  
                  {audioSource === 'custom' && (
                    <audio
                      ref={audioRef}
                      controls
                      className="w-full"
                      src={customAudioLink}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => handleTrackChange('next')}
                      volume={volume}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>

    {/* Gallery Section */}
    <section ref={galleryRef} id="gallery" className="py-20 bg-slate-800 relative">
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
              title: "Class Activities",
              description: "Learning and growing together in our daily activities"
            },
            {
              video: "https://rubim1.github.io/video/kontol.mp4",
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
              {item.video ? (
                <div className="relative w-full h-full">
                  <video
                    src={item.video}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ) : (
                <img 
                  src={item.image}
                  alt={item.title}
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
    </section>

    {/* Floating Particles */}
    <div className="fixed inset-0 pointer-events-none z-0">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-emerald-400/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 10 + 5}s`
          }}
        />
      ))}
    </div>

    {/* Footer */}
    <footer className="bg-slate-900 py-12 border-t border-white/10 relative">
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
              { icon: <Discord size={20} />, href: "https://example.com/discord" },
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
    </footer>
  </div>
  );
}

export default App
