import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar } from './ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useToast } from "@/hooks/use-toast";
import { 
  sendMessage, 
  subscribeToMessages, 
  FirebaseMessage, 
  UserInfo,
  loginAnonymously,
  logout,
  setTypingStatus,
  subscribeToTypingUsers,
  subscribeToOnlineUsers,
  deleteMessage,
  onAuthChanged
} from '@/lib/firebase';

interface ChatMessage {
  id: string;
  name: string;
  photoUrl: string;
  text: string;
  timestamp: Date;
  // Add a new field to mark messages for deletion
  isDeleted?: boolean;
  // Add new field for typing indicator
  isTyping?: boolean;
}

interface UserProfile {
  name: string;
  photoUrl: string;
}

// Users currently typing
interface TypingUser {
  name: string;
  photoUrl: string;
  timestamp: Date;
}

const ChatSection: React.FC = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: '', photoUrl: '' });
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [showChatSection, setShowChatSection] = useState(false); // Kontrol visibility chat section dan chat login
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isGitHubPages, setIsGitHubPages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check if we're running on GitHub Pages, Cloudflare Pages, or in a static environment
  useEffect(() => {
    // Check for static deployment environments
    const isOnStaticHost = 
      // GitHub Pages indicators
      window.location.hostname.includes('github.io') || 
      window.location.pathname.includes('/website/') ||
      window.location.href.includes('github.io') ||
      // Cloudflare Pages indicators
      window.location.hostname.includes('pages.dev') ||
      // Environment variable
      (typeof window.__IS_CLOUDFLARE_DEPLOYMENT__ !== 'undefined' && window.__IS_CLOUDFLARE_DEPLOYMENT__ === true);
    
    console.log('Checking for static deployment:', {
      hostname: window.location.hostname,
      pathname: window.location.pathname,
      isOnStaticHost
    });
    
    setIsGitHubPages(isOnStaticHost); // We're reusing the same state variable for all static environments
    
    if (isOnStaticHost) {
      toast({
        title: "Firebase Realtime Mode",
        description: "Running with Firebase Realtime Database for chat synchronization.",
        duration: 5000,
      });
      
      // Force WebSocket connected state to true for GitHub Pages
      setIsWebSocketConnected(true);
    }
  }, []);

  // Function to fetch messages from the database
  const fetchMessagesFromDatabase = async () => {
    // If we're on GitHub Pages, use Firebase Realtime Database for real-time chat
    if (isGitHubPages) {
      console.log('Running on GitHub Pages - Using Firebase for real-time chat');
      
      // Subscribe to Firebase messages
      subscribeToMessages((firebaseMessages) => {
        // Convert Firebase messages to our app's message format
        const convertedMessages = firebaseMessages.map(msg => ({
          id: msg.id,
          name: msg.name,
          photoUrl: msg.photoUrl,
          text: msg.text,
          timestamp: new Date(msg.timestamp)
        }));
        
        console.log(`Loaded ${convertedMessages.length} messages from Firebase`);
        setMessages(convertedMessages);
      });
      
      return;
    }
    
    // Regular API fetch for non-GitHub Pages environments
    try {
      const response = await fetch('/api/chat/messages');
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }
      
      const data = await response.json();
      // Ensure dates are properly converted to Date objects
      const messagesWithDateObjects = data.map((msg: any) => ({
        ...msg,
        id: msg.externalId, // Map database externalId to id used in the UI
        timestamp: new Date(msg.timestamp)
      }));
      
      // Sort messages by timestamp
      const sortedMessages = messagesWithDateObjects.sort(
        (a: ChatMessage, b: ChatMessage) => a.timestamp.getTime() - b.timestamp.getTime()
      );
      
      console.log(`Loaded ${sortedMessages.length} messages from database`);
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error fetching messages from database:', error);
      
      // Fallback to local storage if database fetch fails
      const savedMessages = localStorage.getItem('chat_messages');
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          // Ensure dates are properly converted back to Date objects
          const messagesWithDateObjects = parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          // Only keep the last 50 messages to prevent performance issues
          setMessages(messagesWithDateObjects.slice(-50));
        } catch (error) {
          console.error('Error parsing saved messages:', error);
        }
      }
    }
  };

  // Setup Firebase authentication and listeners
  useEffect(() => {
    const savedName = getCookie('chat_name');
    const savedPhoto = getCookie('chat_photo');
    
    // Load saved profile information for the login form
    if (savedName) setProfileName(savedName);
    if (savedPhoto) setPhotoBase64(savedPhoto);
    
    // Setup all chat is now handled through Firebase for all environments
    setIsGitHubPages(true);
    setIsWebSocketConnected(true);
    
    // Initialize Firebase authentication
    const initializeChat = async () => {
      try {
        if (savedName && savedPhoto) {
          console.log('Initializing chat with saved credentials');
          setUserProfile({
            name: savedName,
            photoUrl: savedPhoto
          });
          setShowChatSection(true);
          
          // Authenticate with Firebase in background
          try {
            await loginAnonymously(savedName, savedPhoto);
            console.log('Firebase authentication successful');
          } catch (authError) {
            console.warn('Firebase authentication failed, continuing with local profile:', authError);
          }
        } else {
          // Show the profile modal to get user info
          setProfileModalOpen(true);
        }
        
        // Set up message listener
        const unsubMessages = subscribeToMessages((messages) => {
          const convertedMessages = messages.map(msg => ({
            id: msg.id,
            name: msg.name,
            photoUrl: msg.photoUrl,
            text: msg.text,
            timestamp: new Date(msg.timestamp || Date.now()),
            isDeleted: msg.isDeleted || false,
            isImage: msg.isImage || false,
            imageUrl: msg.imageUrl || ''
          }));
          console.log(`Loaded ${convertedMessages.length} messages from Firebase`);
          setMessages(convertedMessages);
        });
        
        // Set up typing indicator listener
        const unsubscribeTyping = subscribeToTypingUsers((typingData) => {
          const typingArray: TypingUser[] = Object.values(typingData).map((user: any) => ({
            name: user.name,
            photoUrl: user.photoUrl,
            timestamp: new Date(user.timestamp || Date.now())
          }));
          setTypingUsers(typingArray);
        });
        
        // Store cleanup functions
        return () => {
          unsubMessages();
          unsubscribeTyping();
        };
        
      } catch (error) {
        console.error('Chat initialization error:', error);
        setIsWebSocketConnected(false);
        
        // Show error toast
        toast({
          title: "Chat initialization failed",
          description: "Please check your connection and try again",
          variant: "destructive"
        });
      }
    };
    
    // Initialize chat
    const cleanup = initializeChat();
    
    // Return cleanup function
    return () => {
      if (cleanup instanceof Promise) {
        cleanup.then(cleanupFn => cleanupFn?.());
      }
    };
  }, []);

  // Scroll to bottom when messages change and save to localStorage
  useEffect(() => {
    scrollToBottom();
    
    try {
      // Save only last 20 messages to localStorage to prevent "QuotaExceededError"
      const lastMessages = messages.slice(-20);
      localStorage.setItem('chat_messages', JSON.stringify(lastMessages));
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
      // If we encounter a quota error, clear localStorage and try again with fewer messages
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        localStorage.clear();
        try {
          // Try with just 5 messages as a fallback
          const lastFewMessages = messages.slice(-5);
          localStorage.setItem('chat_messages', JSON.stringify(lastFewMessages));
        } catch (e) {
          console.error('Failed to save even with reduced message count:', e);
        }
      }
    }
  }, [messages]);

  // Firebase function for handling login
  const handleFirebaseLogin = async (name: string, photo: string) => {
    try {
      // Show loading state
      setIsWebSocketConnected(false);
      
      // Attempt to login via Firebase
      await loginAnonymously(name, photo);
      
      // Save to cookies for future sessions
      setCookie('chat_name', name, 30);
      setCookie('chat_photo', photo, 30);
      
      // Close the profile modal
      setProfileModalOpen(false);
      
      // Update local state
      setUserProfile({ name, photoUrl: photo });
      setShowChatSection(true);
      setIsWebSocketConnected(true);
      
      // Success toast
      toast({
        title: "Login berhasil",
        description: `Selamat datang, ${name}!`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Firebase login error:', error);
      toast({
        title: "Login gagal",
        description: "Terjadi kesalahan saat login. Silakan coba lagi.",
        variant: "destructive",
      });
      setIsWebSocketConnected(true); // Reset connection state
    }
  };
  
  // No longer need WebSocket connections - using Firebase Realtime DB for all environments
  useEffect(() => {
    if (userProfile.name) {
      // Just make sure we're connected to Firebase
      connectWebSocket();
    }
  }, [userProfile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const connectWebSocket = () => {
    // If we're on GitHub Pages, use Firebase instead of WebSocket
    if (isGitHubPages) {
      console.log('Running on GitHub Pages - Using Firebase Realtime Database for chat');
      // Set a connected state so the UI doesn't show "Connecting..."
      setIsWebSocketConnected(true);
      
      // Add a welcome message for Firebase mode
      const welcomeMessage = {
        id: `github-pages-welcome-${Date.now()}`,
        name: "System",
        photoUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmYTUwMCIgZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPjxwYXRoIGZpbGw9IiNmZmE1MDAiIGQ9Ik0xMiA2Yy0zLjMxIDAtNiAyLjY5LTYgNnMyLjY5IDYgNiA2IDYtMi42OSA2LTYtMi42OS02LTYtNnptMCAxMGMtMi4yMSAwLTQtMS43OS00LTRzMS43OS00IDQtNCA0IDEuNzkgNCA0LTEuNzkgNC00IDR6Ii8+PC9zdmc+",
        text: "GitHub Pages mode active with Firebase. You can chat in real-time across all users viewing this page!",
        timestamp: new Date()
      };
      
      // Only add if we don't have it already
      if (!messages.some(msg => msg.text.includes("GitHub Pages mode active with Firebase"))) {
        setMessages(prev => [...prev, welcomeMessage]);
      }
      
      return;
    }
    
    // Normal WebSocket connection for non-GitHub Pages environments
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
        const data = JSON.parse(event.data);
        console.log('Received WebSocket message:', data);
        
        // Handle different message types
        if (data.type === 'typing') {
          // Handle typing indicator
          const typingUser = {
            name: data.name,
            photoUrl: data.photoUrl,
            timestamp: new Date(data.timestamp)
          };
          
          // Add to typing users if not already there
          setTypingUsers(prevUsers => {
            const existingUserIndex = prevUsers.findIndex(user => user.name === typingUser.name);
            if (existingUserIndex >= 0) {
              // Update existing user's timestamp
              const newUsers = [...prevUsers];
              newUsers[existingUserIndex] = typingUser;
              return newUsers;
            } else {
              // Add new typing user
              return [...prevUsers, typingUser];
            }
          });
          
          // Remove typing indicator after a delay (3 seconds)
          setTimeout(() => {
            setTypingUsers(prevUsers => prevUsers.filter(user => user.name !== typingUser.name));
          }, 3000);
          
        } else if (data.type === 'stopTyping') {
          // Remove user from typing list immediately
          setTypingUsers(prevUsers => prevUsers.filter(user => user.name !== data.name));
          
        } else {
          // Regular chat message
          const messageData = {
            id: data.id, 
            name: data.name, 
            photoUrl: data.photoUrl, 
            text: data.text, 
            timestamp: new Date(data.timestamp)
          };
          
          // Check if we already have this message (by ID) to prevent duplicates
          if (!messages.some(msg => msg.id === data.id)) {
            console.log('Adding received message:', data.text, 'from', data.name);
            
            // Special handling for System messages
            if (data.name === 'System') {
              setMessages(prev => [...prev, messageData]);
            }
            // Handle messages from other users
            else if (data.name !== userProfile.name) {
              setMessages(prev => [...prev, messageData]);
            } 
            // Handle confirmation of our own messages (optional)
            else {
              console.log('Received confirmation of own message:', data.text);
              // We don't need to add our own messages again as we've already added them optimistically
            }
          } else {
            console.log('Duplicate message detected, ignoring:', data.id);
          }
        }
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

  const handleSendMessage = async () => {
    // Validate message and user profile
    if (!newMessage.trim() || !userProfile.name) {
      toast({
        title: "Pesan kosong",
        description: "Silakan masukkan pesan terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      // Clear typing status first
      try {
        await setTypingStatus(false);
      } catch (typingError) {
        console.warn('Could not clear typing status:', typingError);
      }
      
      // Send message to Firebase
      console.log('Attempting to send message to Firebase:', messageText);
      console.log('Current user profile:', userProfile);
      
      const messageId = await sendMessage({ text: messageText });
      
      console.log('Message sent successfully with ID:', messageId);
      
      // Show success toast
      toast({
        title: "Pesan terkirim",
        description: "Pesan berhasil dikirim ke chat",
      });

    } catch (error: any) {
      console.error('Failed to send message:', error);
      
      // Show detailed error information
      const errorMessage = error?.message || String(error) || 'Terjadi kesalahan tidak diketahui';
      
      toast({
        title: "Gagal mengirim pesan",
        description: `Error: ${errorMessage}`,
        variant: "destructive"
      });
      
      // Restore the message text so user can try again
      setNewMessage(messageText);
    }

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  // Last time typing indicator was sent
  const lastTypingSentRef = useRef<number>(0);

  // Handle typing indicator with throttling
  const sendTypingIndicator = async () => {
    if (!userProfile.name || !isWebSocketConnected) return;
    
    const now = Date.now();
    
    // Clear any existing typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Only send typing indicator every 1000ms to prevent flooding
    if (now - lastTypingSentRef.current > 1000) {
      try {
        await setTypingStatus(true);
        lastTypingSentRef.current = now;
      } catch (error) {
        console.error('Error sending typing indicator:', error);
      }
    }
    
    // Set timeout to send stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(async () => {
      try {
        await setTypingStatus(false);
      } catch (error) {
        console.error('Error clearing typing indicator:', error);
      }
    }, 2000);
  };
  
  // Handle input changes including typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);
    
    // Only send typing indicator if there's actual content
    if (value.trim().length > 0) {
      sendTypingIndicator();
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else {
      // This is a safeguard to ensure typing indicator is sent
      // even if onChange wasn't triggered for some reason
      sendTypingIndicator();
    }
  };
  
  // Add emoji to the message
  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleProfileSubmit = async () => {
    if (!profileName.trim() || !photoBase64) return;

    try {
      // Use Firebase login function instead of local state
      await handleFirebaseLogin(profileName, photoBase64);
      
      // No need to set anything else since handleFirebaseLogin takes care of it
    } catch (error) {
      console.error('Error setting up profile:', error);
      toast({
        title: "Error",
        description: "Failed to set up profile. Please try again.",
        variant: "destructive",
      });
    }
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
    // Format as HH:MM AM/PM, consistent with the design
    return new Date(date).toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }).toLowerCase();
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
              className={`glass-card neon-border rounded-2xl overflow-hidden shadow-xl mb-6 relative ${!darkMode ? 'light-mode' : ''}`}
            >
              {/* Chat Header */}
              <div className="bg-accent/10 p-4 border-b border-accent/20 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-accent animate-pulse mr-2"></div>
                  <h3 className="text-white font-medium">
                    Chat Kelas {isGitHubPages ? 'Firebase Realtime' : (isWebSocketConnected ? 'Online' : 'Menghubungkan...')}
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
              <div className="p-4 h-[450px] overflow-y-auto bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-md scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <i className="fas fa-comments text-5xl mb-4 text-accent/40"></i>
                    <p>Belum ada pesan. Mulai percakapan!</p>
                    <p className="text-sm text-gray-500 mt-2">Pesan yang dikirim akan terlihat oleh semua orang di chat</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.name === userProfile.name ? 'justify-end' : 'justify-start'} group`}
                      >
                        {msg.name !== userProfile.name && (
                          <div className="flex-shrink-0">
                            <Avatar className="h-10 w-10 mr-2 mt-1 border-2 border-accent/20 rounded-full overflow-hidden shadow-lg glow-sm">
                              <img src={msg.photoUrl} alt={msg.name} className="object-cover" />
                            </Avatar>
                          </div>
                        )}
                        
                        <div 
                          className={`
                            relative max-w-[85%] md:max-w-[75%] p-3 rounded-2xl backdrop-blur-sm shadow-md
                            ${msg.name === userProfile.name 
                              ? 'bg-gradient-to-br from-accent/30 to-accent/10 text-white rounded-tr-none border border-accent/10' 
                              : 'bg-gradient-to-br from-gray-800/70 to-gray-800/40 text-white rounded-tl-none border border-gray-700/20'
                            }
                          `}
                        >
                          {msg.name !== userProfile.name && (
                            <div className="text-accent/90 text-sm font-medium mb-1">{msg.name}</div>
                          )}
                          
                          <p className="text-white break-words">{msg.text}</p>
                          
                          {/* Timestamp */}
                          <div className={`text-gray-400 text-xs mt-1 ${msg.name === userProfile.name ? 'text-right' : 'text-left'} opacity-70`}>
                            {formatTime(msg.timestamp)}
                          </div>
                          
                          {/* Message status for own messages */}
                          {msg.name === userProfile.name && (
                            <div className="absolute -bottom-4 right-2 text-accent/80 text-xs flex items-center">
                              <i className="fas fa-check-double mr-1 text-[10px]"></i>
                              <span className="text-[10px]">Terkirim</span>
                            </div>
                          )}
                          
                          {/* Delete button - only for own messages */}
                          {msg.name === userProfile.name && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    onClick={() => handleDeleteMessage(msg.id)}
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-600/80 hover:bg-red-500 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
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
                          <div className="flex-shrink-0">
                            <Avatar className="h-10 w-10 ml-2 mt-1 border-2 border-accent/20 rounded-full overflow-hidden shadow-lg glow-sm">
                              <img src={msg.photoUrl} alt={msg.name} className="object-cover" />
                            </Avatar>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {/* This div is used to scroll into view when new messages arrive */}
                <div ref={messagesEndRef} className="h-1" />
              </div>
              
              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <div className="px-4 py-2 bg-black/20 border-t border-accent/10">
                  <div className="flex items-center text-gray-400 text-sm">
                    <div className="flex -space-x-2 mr-2">
                      {typingUsers.slice(0, 3).map((user, index) => (
                        <Avatar key={user.name} className="h-6 w-6 border border-accent/20">
                          <img src={user.photoUrl} alt={user.name} className="object-cover" />
                        </Avatar>
                      ))}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">
                        {typingUsers.length === 1 
                          ? typingUsers[0].name 
                          : `${typingUsers.length} orang`} sedang mengetik
                      </span>
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-pulse"></div>
                        <div className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-pulse delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Input Area */}
              <div className="p-4 border-t border-accent/20 bg-black/60 backdrop-blur-md">
                {userProfile.name ? (
                  <div className="relative">
                    {/* Message Input with Emoji Button */}
                    <div className="flex space-x-2">
                      <div className="flex items-center flex-1 bg-black/40 rounded-md border border-accent/30 focus-within:border-accent/60 overflow-hidden">
                        <div className="relative flex-1 flex items-center">
                          <Input
                            placeholder="Ketik pesan..."
                            value={newMessage}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                            className="flex-1 border-0 bg-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                          <div className="flex items-center mr-2">
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="sm"
                              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-transparent"
                            >
                              <i className="fas fa-smile text-lg"></i>
                            </Button>
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="sm"
                              onClick={() => setDarkMode(!darkMode)}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-transparent"
                            >
                              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
                            </Button>
                          </div>
                        </div>
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={handleSendMessage}
                          disabled={(isGitHubPages ? false : !isWebSocketConnected) || !newMessage.trim()}
                          className="bg-accent hover:bg-accent/80 text-white px-4"
                        >
                          <i className="fas fa-paper-plane"></i>
                        </Button>
                      </motion.div>
                    </div>
                    
                    {/* Emoji Picker Popup */}
                    {showEmojiPicker && (
                      <div className="absolute bottom-full right-0 mb-2 p-3 bg-gray-900/95 backdrop-blur-md rounded-lg border border-accent/20 shadow-xl z-10">
                        <div className="grid grid-cols-8 gap-2 max-h-60 overflow-y-auto">
                          {['😀', '😂', '😊', '😍', '🥰', '😘', '😎', '🤔', 
                            '😢', '😭', '😡', '🥺', '😴', '🤑', '🤩', '😇',
                            '👍', '👎', '🎉', '❤️', '🔥', '⭐', '🌟', '✨',
                            '💯', '🙏', '👀', '🤗', '🤝', '🤫', '🤐', '😱'].map(emoji => (
                            <Button
                              key={emoji}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-accent/10"
                              onClick={() => handleEmojiSelect(emoji)}
                            >
                              {emoji}
                            </Button>
                          ))}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full mt-2 text-xs text-gray-400 hover:text-white"
                          onClick={() => setShowEmojiPicker(false)}
                        >
                          Tutup
                        </Button>
                      </div>
                    )}
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