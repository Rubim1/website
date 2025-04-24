import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createRipple, magneticEffect } from '@/lib/microInteractions';

// Helper functions to extract IDs from URLs
const getYoutubeID = (url: string) => {
  // Handle different YouTube URL formats
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : url;
};

const getSpotifyID = (url: string) => {
  // Handle Spotify URLs
  const regExp = /^.*((open.spotify.com\/track\/)|(embed\/track\/))\??\/??([^#&?]*).*/;
  const match = url.match(regExp);
  return match ? match[4] : url;
};

const getTikTokID = (url: string) => {
  // Handle TikTok URLs
  const regExp = /^.*((tiktok.com\/@[^\/]+\/video\/)|(vm.tiktok.com\/))\??\/??([^#&?]*).*/;
  const match = url.match(regExp);
  return match ? match[4] : url;
};

interface Song {
  id: number;
  title: string;
  artist: string;
  source: string;
  type: 'local' | 'youtube' | 'spotify' | 'tiktok';
}

const defaultSongs: Song[] = [
  { 
    id: 1, 
    title: 'Lofi Study', 
    artist: 'Chill Beats', 
    source: 'https://storage.googleapis.com/media-session/sintel/snow-fight.mp3', 
    type: 'local' 
  },
  { 
    id: 2, 
    title: 'Piano Melody', 
    artist: 'Classical Mix', 
    source: 'https://storage.googleapis.com/media-session/big-buck-bunny/prelude.mp3', 
    type: 'local' 
  }
];

const MusicPlayer: React.FC = () => {
  const [minimized, setMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [songs, setSongs] = useState<Song[]>(defaultSongs);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');

  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load the first song by default
  useEffect(() => {
    if (songs.length > 0 && !currentSong) {
      setCurrentSong(songs[0]);
    }
  }, [songs, currentSong]);

  // Handle song change
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.source;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSong]);

  // Format time from seconds to MM:SS
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Update progress bar
  const updateProgress = () => {
    if (audioRef.current && currentSong?.type === 'local') {
      const { currentTime, duration } = audioRef.current;
      const progressValue = (currentTime / duration) * 100;
      setProgress(isNaN(progressValue) ? 0 : progressValue);
      setCurrentTime(formatTime(currentTime));
      setDuration(formatTime(duration));
    }
  };

  // Setup progress timer
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(updateProgress, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  // Handle play/pause
  const togglePlay = () => {
    if (currentSong?.type === 'local' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (currentSong?.type === 'youtube' || currentSong?.type === 'spotify' || currentSong?.type === 'tiktok') {
      // For external sources, we just toggle the playing state visually
      // The actual control would be handled by the embedded player
      setIsPlaying(!isPlaying);
    }
  };

  // Handle song ended
  const handleEnded = () => {
    if (currentSong && songs.length > 0) {
      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
      const nextIndex = (currentIndex + 1) % songs.length;
      setCurrentSong(songs[nextIndex]);
    }
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const volumeValue = value[0];
    setVolume(volumeValue);
    if (audioRef.current) {
      audioRef.current.volume = volumeValue / 100;
    }
  };

  // Handle progress bar click
  const handleProgressChange = (value: number[]) => {
    const seekValue = value[0];
    setProgress(seekValue);
    if (audioRef.current) {
      audioRef.current.currentTime = (seekValue / 100) * audioRef.current.duration;
    }
  };

  // Extract YouTube title from URL if possible
  const extractYouTubeTitle = (url: string): string => {
    const urlObj = new URL(url);
    if (urlObj.searchParams.has('v')) {
      const title = urlObj.searchParams.get('title');
      return title ? decodeURIComponent(title) : 'YouTube Video';
    }
    return 'YouTube Video';
  };

  // Add YouTube video
  const addYoutubeVideo = () => {
    if (youtubeUrl) {
      try {
        // Create a direct embed URL for YouTube
        let embedUrl = youtubeUrl;
        if (!embedUrl.includes('embed')) {
          const videoId = getYoutubeID(youtubeUrl);
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
        
        // Try to extract title from URL or use generic title
        let title = 'YouTube Video';
        try {
          title = extractYouTubeTitle(youtubeUrl);
        } catch (e) {
          console.log('Could not extract title from YouTube URL');
        }
        
        const newSong: Song = {
          id: Date.now(),
          title,
          artist: 'YouTube',
          source: embedUrl,
          type: 'youtube'
        };
        setSongs([...songs, newSong]);
        setYoutubeUrl('');
      } catch (e) {
        console.error('Error adding YouTube URL:', e);
        alert('Please enter a valid YouTube URL');
      }
    }
  };

  // Add Spotify track
  const addSpotifyTrack = () => {
    if (spotifyUrl) {
      try {
        // Create a direct embed URL for Spotify
        let embedUrl = spotifyUrl;
        if (!embedUrl.includes('embed')) {
          const trackId = getSpotifyID(spotifyUrl);
          embedUrl = `https://open.spotify.com/embed/track/${trackId}`;
        }
        
        const newSong: Song = {
          id: Date.now(),
          title: 'Spotify Track',
          artist: 'Spotify',
          source: embedUrl,
          type: 'spotify'
        };
        setSongs([...songs, newSong]);
        setSpotifyUrl('');
      } catch (e) {
        console.error('Error adding Spotify URL:', e);
        alert('Please enter a valid Spotify URL');
      }
    }
  };

  // Add TikTok audio
  const addTikTokAudio = () => {
    if (tiktokUrl) {
      try {
        // Create a direct embed URL for TikTok
        let embedUrl = tiktokUrl;
        if (!embedUrl.includes('embed')) {
          const videoId = getTikTokID(tiktokUrl);
          embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`;
        }
        
        const newSong: Song = {
          id: Date.now(),
          title: 'TikTok Audio',
          artist: 'TikTok',
          source: embedUrl,
          type: 'tiktok'
        };
        setSongs([...songs, newSong]);
        setTiktokUrl('');
      } catch (e) {
        console.error('Error adding TikTok URL:', e);
        alert('Please enter a valid TikTok URL');
      }
    }
  };

  return (
    <div className={`audio-player ${minimized ? 'minimized' : ''}`}>
      <button 
        className="audio-player-toggle relative overflow-hidden" 
        onClick={(e) => {
          createRipple(e);
          setMinimized(!minimized);
        }}
      >
        <i className={`fas ${minimized ? 'fa-expand' : 'fa-compress'} text-blue-300`}></i>
      </button>

      {minimized ? (
        <div 
          className="flex items-center justify-center h-full cursor-pointer" 
          onClick={() => setMinimized(false)}
        >
          <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-2xl text-blue-300`}></i>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white truncate">
              {currentSong?.title || 'No song selected'}
            </h3>
            <p className="text-sm text-gray-400 truncate">{currentSong?.artist || 'Unknown artist'}</p>
          </div>

          {/* Media player element */}
          {currentSong?.type === 'local' ? (
            <audio 
              ref={audioRef} 
              onEnded={handleEnded}
              onLoadedMetadata={updateProgress}
            >
              <source src={currentSong?.source} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          ) : currentSong?.type === 'youtube' && currentSong?.source ? (
            <div className="w-full aspect-video mb-4 rounded-lg overflow-hidden">
              <iframe 
                width="100%" 
                height="100%" 
                src={currentSong.source.includes('embed') ? 
                  currentSong.source : 
                  `https://www.youtube.com/embed/${getYoutubeID(currentSong.source)}?autoplay=${isPlaying ? '1' : '0'}`
                }
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
          ) : currentSong?.type === 'spotify' && currentSong?.source ? (
            <div className="w-full aspect-video mb-4 rounded-lg overflow-hidden">
              <iframe 
                src={currentSong.source.includes('embed') ? 
                  currentSong.source : 
                  `https://open.spotify.com/embed/track/${getSpotifyID(currentSong.source)}`
                }
                width="100%" 
                height="100%" 
                frameBorder="0" 
                allow="encrypted-media"
                className="rounded-lg"
              ></iframe>
            </div>
          ) : currentSong?.type === 'tiktok' && currentSong?.source ? (
            <div className="w-full aspect-video mb-4 rounded-lg overflow-hidden">
              <iframe 
                src={currentSong.source.includes('embed') ? 
                  currentSong.source : 
                  `https://www.tiktok.com/embed/v2/${getTikTokID(currentSong.source)}`
                }
                width="100%" 
                height="100%" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                className="rounded-lg"
              ></iframe>
            </div>
          ) : null}

          {/* Controls for local audio only */}
          {currentSong?.type === 'local' && (
            <>
              {/* Progress bar */}
              <div className="mb-4">
                <Slider 
                  value={[progress]} 
                  onValueChange={handleProgressChange}
                  max={100} 
                  step={0.1}
                  className="my-2"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{currentTime}</span>
                  <span>{duration}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4 mb-4">
                <Button
                  variant="ghost" 
                  size="icon"
                  className="relative overflow-hidden hover:bg-blue-900/20 hover:text-blue-300 transition-all"
                  onClick={(e) => {
                    createRipple(e);
                    if (currentSong && songs.length > 0) {
                      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
                      const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
                      setCurrentSong(songs[prevIndex]);
                    }
                  }}
                >
                  <i className="fas fa-backward text-blue-300"></i>
                </Button>
                <Button
                  variant="ghost" 
                  size="icon"
                  className="relative overflow-hidden hover:bg-blue-900/20 hover:text-blue-300 transition-all"
                  onClick={(e) => {
                    createRipple(e);
                    togglePlay();
                  }}
                >
                  <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-blue-300 text-xl`}></i>
                </Button>
                <Button
                  variant="ghost" 
                  size="icon"
                  className="relative overflow-hidden hover:bg-blue-900/20 hover:text-blue-300 transition-all"
                  onClick={(e) => {
                    createRipple(e);
                    if (currentSong && songs.length > 0) {
                      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
                      const nextIndex = (currentIndex + 1) % songs.length;
                      setCurrentSong(songs[nextIndex]);
                    }
                  }}
                >
                  <i className="fas fa-forward text-blue-300"></i>
                </Button>
              </div>

              {/* Volume control */}
              <div className="flex items-center gap-2 mb-4">
                <i className="fas fa-volume-down text-white text-sm"></i>
                <Slider 
                  value={[volume]} 
                  onValueChange={handleVolumeChange}
                  max={100} 
                  step={1}
                  className="flex-1"
                />
                <i className="fas fa-volume-up text-white text-sm"></i>
              </div>
            </>
          )}
          
          {/* Simple navigation for external sources */}
          {(currentSong?.type === 'youtube' || currentSong?.type === 'spotify' || currentSong?.type === 'tiktok') && (
            <div className="flex justify-center gap-4 mb-4">
              <Button
                variant="ghost" 
                size="icon"
                onClick={() => {
                  if (currentSong && songs.length > 0) {
                    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
                    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
                    setCurrentSong(songs[prevIndex]);
                  }
                }}
              >
                <i className="fas fa-backward text-white"></i>
              </Button>
              <Button
                variant="ghost" 
                size="icon"
                onClick={() => {
                  if (currentSong && songs.length > 0) {
                    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
                    const nextIndex = (currentIndex + 1) % songs.length;
                    setCurrentSong(songs[nextIndex]);
                  }
                }}
              >
                <i className="fas fa-forward text-white"></i>
              </Button>
            </div>
          )}

          {/* Song list */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-white mb-2">Songs:</h4>
            <div className="max-h-32 overflow-y-auto custom-scrollbar">
              {songs.map(song => (
                <div 
                  key={song.id}
                  className={`p-2 rounded cursor-pointer relative overflow-hidden hover:bg-blue-900/20 transition-all duration-200 flex items-center ${currentSong?.id === song.id ? 'bg-blue-900/30 border-l-2 border-blue-400' : ''}`}
                  onClick={(e) => {
                    createRipple(e);
                    setCurrentSong(song);
                  }}
                >
                  <i className={`fas fa-${song.type === 'local' ? 'music' : song.type} text-blue-300 mr-2`}></i>
                  <div className="overflow-hidden">
                    <div className="text-sm text-white truncate">{song.title}</div>
                    <div className="text-xs text-blue-300/70 truncate">{song.artist}</div>
                  </div>
                  {currentSong?.id === song.id && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <i className="fas fa-volume-up text-blue-300 text-xs animate-pulse"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add external sources */}
          <Tabs defaultValue="youtube" className="mt-4">
            <TabsList className="grid grid-cols-3 mb-2">
              <TabsTrigger value="youtube">YouTube</TabsTrigger>
              <TabsTrigger value="spotify">Spotify</TabsTrigger>
              <TabsTrigger value="tiktok">TikTok</TabsTrigger>
            </TabsList>
            <TabsContent value="youtube" className="space-y-2">
              <div className="flex gap-2">
                <Input 
                  placeholder="YouTube URL"
                  value={youtubeUrl} 
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="text-white bg-gray-800 border-gray-700"
                />
                <Button onClick={addYoutubeVideo} size="sm" className="whitespace-nowrap">
                  <i className="fab fa-youtube mr-1"></i> Add
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="spotify" className="space-y-2">
              <div className="flex gap-2">
                <Input 
                  placeholder="Spotify URL"
                  value={spotifyUrl} 
                  onChange={(e) => setSpotifyUrl(e.target.value)}
                  className="text-white bg-gray-800 border-gray-700"
                />
                <Button onClick={addSpotifyTrack} size="sm" className="whitespace-nowrap">
                  <i className="fab fa-spotify mr-1"></i> Add
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="tiktok" className="space-y-2">
              <div className="flex gap-2">
                <Input 
                  placeholder="TikTok URL"
                  value={tiktokUrl} 
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  className="text-white bg-gray-800 border-gray-700"
                />
                <Button onClick={addTikTokAudio} size="sm" className="whitespace-nowrap">
                  <i className="fab fa-tiktok mr-1"></i> Add
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default MusicPlayer;