import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar } from './ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ChatMessage {
  id: string;
  name: string;
  photoUrl: string;
  text: string;
  timestamp: Date;
  // Add a new field to mark messages for deletion
  isDeleted?: boolean;
}

interface UserProfile {
  name: string;
  photoUrl: string;
}

const ChatSection: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: '', photoUrl: '' });
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [showChatSection, setShowChatSection] = useState(false); // Kontrol visibility chat section dan chat login
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Load user profile from cookies and message from local storage on mount
  useEffect(() => {
    const savedName = getCookie('chat_name');
    const savedPhoto = getCookie('chat_photo');
    const savedMessages = localStorage.getItem('chat_messages');
    
    // Load saved messages if any
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Ensure dates are properly converted back to Date objects
        const messagesWithDateObjects = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDateObjects);
      } catch (error) {
        console.error('Error parsing saved messages:', error);
      }
    }
    
    if (savedName) setProfileName(savedName);
    if (savedPhoto) setPhotoBase64(savedPhoto);
    
    if (savedName && savedPhoto) {
      setUserProfile({ name: savedName, photoUrl: savedPhoto });
    }
    // Don't automatically show profile modal - user needs to click the button now
  }, []);

  // Scroll to bottom when messages change and save to localStorage
  useEffect(() => {
    scrollToBottom();
    
    // Save messages to localStorage for persistence
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  // Handle WebSocket connection
  useEffect(() => {
    if (!wsRef.current && userProfile.name) {
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [userProfile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const connectWebSocket = () => {
    // Determine the correct protocol (ws or wss) based on whether the page is loaded over HTTP or HTTPS
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.addEventListener('open', () => {
      console.log('WebSocket connected');
      setIsWebSocketConnected(true);
    });

    socket.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data);
        setMessages(prev => [...prev, {
          id: message.id, 
          name: message.name, 
          photoUrl: message.photoUrl, 
          text: message.text, 
          timestamp: new Date(message.timestamp)
        }]);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    socket.addEventListener('close', () => {
      console.log('WebSocket disconnected');
      setIsWebSocketConnected(false);
      // Attempt to reconnect after a delay
      setTimeout(() => {
        if (userProfile.name) connectWebSocket();
      }, 3000);
    });

    socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      setIsWebSocketConnected(false);
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !userProfile.name || !isWebSocketConnected) return;

    const message = {
      id: generateId(),
      name: userProfile.name,
      photoUrl: userProfile.photoUrl,
      text: newMessage,
      timestamp: new Date()
    };

    // Send message through WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }

    // Add message to local state (optimistic update)
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleProfileSubmit = () => {
    if (!profileName.trim() || !photoBase64) return;

    // Save profile
    const newProfile = { name: profileName, photoUrl: photoBase64 };
    setUserProfile(newProfile);
    setProfileModalOpen(false);

    // Set cookies to remember user
    setCookie('chat_name', profileName, 30); // 30 days expiration
    setCookie('chat_photo', photoBase64, 30);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoBase64(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  // Function to handle message deletion
  const handleDeleteMessage = (idToDelete: string) => {
    // Remove from local state and local storage
    setMessages(prev => prev.filter(msg => msg.id !== idToDelete));
    // Update is automatically saved to localStorage because of the useEffect
  };

  // Helper functions
  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const setCookie = (name: string, value: string, days: number) => {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
  };

  const getCookie = (name: string) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  };

  return (
    <section id="chat" className="min-h-screen py-24 relative overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-[#000922] z-0">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgc3Ryb2tlPSIjMDBiOGZmIiBzdHJva2Utb3BhY2l0eT0iLjIiIGN4PSIxMDAiIGN5PSIxMDAiIHI9Ijk5Ii8+PC9nPjwvc3ZnPg==')] bg-repeat opacity-10"></div>
        </div>
      </div>
      
      {/* Content Container */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Ruang Obrolan Kelas</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Mulai mengobrol dengan teman sekelas! Jadilah respektful dan berikan dukungan positif kepada sesama.
          </p>
          
          {/* Show chat button if chat section is hidden */}
          {!showChatSection && (
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button
                onClick={() => setShowChatSection(true)}
                className="bg-accent hover:bg-accent/80 text-white px-6 py-3 text-lg rounded-xl shadow-lg shadow-accent/20"
              >
                <i className="fas fa-comments mr-2"></i>
                Buka Chat Kelas
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Chat Area - only shown when showChatSection is true */}
        {showChatSection && (
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card neon-border rounded-2xl overflow-hidden shadow-xl mb-6 relative"
            >
              {/* Chat Header */}
              <div className="bg-accent/10 p-4 border-b border-accent/20 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-accent animate-pulse mr-2"></div>
                  <h3 className="text-white font-medium">
                    Chat Kelas {isWebSocketConnected ? 'Online' : 'Menghubungkan...'}
                  </h3>
                </div>
                <div className="flex items-center space-x-4">
                  {userProfile.name && (
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => setProfileModalOpen(true)}
                    >
                      <motion.div whileHover={{ scale: 1.1 }}>
                        <Avatar className="h-8 w-8 border-2 border-accent/30">
                          <img src={userProfile.photoUrl} alt={userProfile.name} />
                        </Avatar>
                      </motion.div>
                      <span className="ml-2 text-white text-sm">{userProfile.name}</span>
                    </div>
                  )}
                  <Button 
                    onClick={() => setShowChatSection(false)} 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </div>
              </div>
              
              {/* Messages Container */}
              <div className="p-4 h-96 overflow-y-auto bg-black/40 backdrop-blur-md">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <i className="fas fa-comments text-5xl mb-4 text-accent/40"></i>
                    <p>Belum ada pesan. Mulai percakapan!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex mb-4 ${msg.name === userProfile.name ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.name !== userProfile.name && (
                        <Avatar className="h-8 w-8 mr-2 mt-1 border border-accent/20">
                          <img src={msg.photoUrl} alt={msg.name} />
                        </Avatar>
                      )}
                      <div className={`max-w-[75%] ${msg.name === userProfile.name ? 'bg-accent/20' : 'bg-gray-800/60'} rounded-xl p-3 backdrop-blur-sm relative group`}>
                        {msg.name !== userProfile.name && (
                          <div className="text-accent/90 text-xs font-medium mb-1">{msg.name}</div>
                        )}
                        
                        <p className="text-white break-words">{msg.text}</p>
                        
                        <div className={`text-gray-400 text-xs mt-1 ${msg.name === userProfile.name ? 'text-right' : 'text-left'}`}>
                          {formatTime(msg.timestamp)}
                        </div>
                        
                        {/* Delete button - only for own messages */}
                        {msg.name === userProfile.name && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-600/80 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  variant="destructive"
                                  size="sm"
                                >
                                  <i className="fas fa-times text-xs"></i>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Hapus pesan</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      
                      {msg.name === userProfile.name && (
                        <Avatar className="h-8 w-8 ml-2 mt-1 border border-accent/20">
                          <img src={msg.photoUrl} alt={msg.name} />
                        </Avatar>
                      )}
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input Area */}
              <div className="p-4 border-t border-accent/20 bg-black/60 backdrop-blur-md">
                {userProfile.name ? (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ketik pesan..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-1 bg-black/40 border-accent/30 focus:border-accent/60 text-white"
                    />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!isWebSocketConnected}
                        className="bg-accent hover:bg-accent/80 text-white"
                      >
                        <i className="fas fa-paper-plane mr-2"></i>
                        Kirim
                      </Button>
                    </motion.div>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <Button
                      onClick={() => setProfileModalOpen(true)}
                      className="bg-accent hover:bg-accent/80 text-white"
                    >
                      <i className="fas fa-user mr-2"></i>
                      Buat Profil untuk Chat
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card neon-border rounded-xl max-w-md w-full p-6"
          >
            <h3 className="text-2xl font-bold mb-6 text-white text-center">
              Profil Chat <span className="text-accent">Kamu</span>
            </h3>
            
            <div className="mb-6 flex flex-col items-center">
              <div 
                onClick={triggerFileInput}
                className="w-24 h-24 rounded-full bg-accent/10 border-2 border-dashed border-accent/40 flex items-center justify-center cursor-pointer mb-2 overflow-hidden relative hover:border-accent/70 transition-all duration-300"
              >
                {photoBase64 ? (
                  <img src={photoBase64} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <i className="fas fa-camera text-accent/60 text-xl"></i>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <p className="text-gray-400 text-sm">Klik untuk memilih foto profil</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 text-sm font-medium">
                Nama Tampilan
              </label>
              <Input
                placeholder="Masukkan nama..."
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="bg-black/40 border-accent/30 focus:border-accent/60 text-white"
              />
            </div>
            
            <div className="flex justify-between">
              <Button
                onClick={() => setProfileModalOpen(false)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Batal
              </Button>
              <Button
                onClick={handleProfileSubmit}
                disabled={!profileName || !photoBase64}
                className="bg-accent hover:bg-accent/80 text-white"
              >
                <i className="fas fa-check mr-2"></i>
                Simpan Profil
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default ChatSection;