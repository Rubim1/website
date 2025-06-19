import { initializeApp } from "firebase/app";
import { 
  getDatabase, 
  ref, 
  onValue, 
  push, 
  set, 
  serverTimestamp, 
  remove,
  update,
  get,
  query,
  orderByChild,
  limitToLast,
  onDisconnect
} from "firebase/database";
import { 
  getAuth, 
  signInAnonymously, 
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser
} from "firebase/auth";

// Firebase configuration using environment variables for better security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD9VHCLkIOhPBWM_PJ1eIlZesFB_d-0jJo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "chat-77e24.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://chat-77e24-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "chat-77e24",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "chat-77e24.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "989714979824",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:989714979824:web:de6ff0facab526b313db35",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-KS5CY801WP"
};

console.log('Firebase config initialized:', {
  databaseURL: firebaseConfig.databaseURL,
  apiKey: firebaseConfig.apiKey ? 'Present' : 'Missing',
  authDomain: firebaseConfig.authDomain
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Message and user interfaces
export interface FirebaseMessage {
  id: string;
  uid: string;
  name: string;
  photoUrl: string;
  text: string;
  timestamp: number;
  isDeleted?: boolean;
  isImage?: boolean;
  imageUrl?: string;
}

export interface UserInfo {
  uid: string;
  displayName: string;
  photoURL: string;
  online: boolean;
  lastActive?: number;
}

// Track current user
let currentUser: FirebaseUser | null = null;

// Cache user profile
let currentUserProfile: UserInfo | null = null;

// Database references
const messagesRef = ref(db, 'messages');
const usersRef = ref(db, 'users');
const typingRef = ref(db, 'typing');

// Login anonymously with a display name
export const loginAnonymously = async (displayName: string, photoURL: string) => {
  try {
    console.log('Starting Firebase anonymous authentication...');
    const result = await signInAnonymously(auth);
    currentUser = result.user;
    
    if (!currentUser) throw new Error('Failed to authenticate');
    
    // Create user profile
    const userProfile: UserInfo = {
      uid: currentUser.uid,
      displayName: displayName,
      photoURL: photoURL,
      online: true,
      lastActive: Date.now()
    };
    
    // Cache user profile
    currentUserProfile = userProfile;
    
    console.log('Firebase authentication successful:', {
      uid: currentUser.uid,
      displayName: displayName
    });
    
    return userProfile;
    
  } catch (error) {
    console.error('Firebase authentication failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown authentication error';
    throw new Error(`Authentication failed: ${errorMessage}`);
  }
};

// Logout from Firebase
export const logout = async () => {
  if (!currentUser) return;
  
  try {
    // Update user status
    const userRef = ref(db, `users/${currentUser.uid}`);
    await update(userRef, {
      online: false,
      lastActive: serverTimestamp()
    });
    
    // Cancel all onDisconnect operations
    const statusRef = ref(db, `users/${currentUser.uid}/online`);
    await onDisconnect(statusRef).cancel();
    
    // Sign out
    await signOut(auth);
    currentUser = null;
    currentUserProfile = null;
    
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Listen for auth state changes
export const onAuthChanged = (callback: (user: UserInfo | null) => void) => {
  return onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    
    if (user) {
      // Fetch user profile
      const userRef = ref(db, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          currentUserProfile = snapshot.val() as UserInfo;
          callback(currentUserProfile);
        } else {
          // User exists in auth but not in database
          callback(null);
        }
      });
    } else {
      // User is signed out
      currentUserProfile = null;
      callback(null);
    }
  });
};

// Local message storage for offline functionality
let localMessages: any[] = [];
let messageListeners: ((messages: any[]) => void)[] = [];

// Broadcast local messages to all listeners
const broadcastLocalMessages = () => {
  messageListeners.forEach(callback => callback([...localMessages]));
};

// Send a message - with local storage fallback
export const sendMessage = async (message: { text: string }) => {
  try {
    console.log('Attempting to send message:', message.text);
    
    // Ensure user is authenticated
    if (!currentUser || !currentUserProfile) {
      console.log('User not authenticated, attempting login...');
      
      // Get saved profile data from cookies
      const savedName = document.cookie.split(';').find(row => row.trim().startsWith('chat_name='))?.split('=')[1];
      const savedPhoto = document.cookie.split(';').find(row => row.trim().startsWith('chat_photo='))?.split('=')[1];
      
      if (savedName && savedPhoto) {
        await loginAnonymously(decodeURIComponent(savedName), decodeURIComponent(savedPhoto));
      } else {
        throw new Error('No user profile available');
      }
    }
    
    // Create message data
    const messageData = {
      uid: currentUser?.uid || 'anonymous',
      name: currentUserProfile?.displayName || 'Anonymous',
      photoUrl: currentUserProfile?.photoURL || '/default-avatar.png',
      text: message.text.trim(),
      timestamp: Date.now(),
      isDeleted: false
    };
    
    console.log('Sending message data:', messageData);
    
    // Try Firebase first
    try {
      const response = await fetch(`${firebaseConfig.databaseURL}/messages.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Message sent successfully to Firebase with ID:', result.name);
        return result.name;
      } else {
        throw new Error(`Firebase write failed: ${response.status}`);
      }
    } catch (firebaseError) {
      console.warn('Firebase write failed, using local storage:', firebaseError);
      
      // Store message locally
      const localMessageId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const localMessage = {
        id: localMessageId,
        ...messageData
      };
      
      localMessages.push(localMessage);
      
      // Save to localStorage for persistence
      try {
        localStorage.setItem('chat_local_messages', JSON.stringify(localMessages));
      } catch (storageError) {
        console.warn('localStorage save failed:', storageError);
      }
      
      // Broadcast to all listeners
      broadcastLocalMessages();
      
      console.log('Message stored locally with ID:', localMessageId);
      return localMessageId;
    }
    
  } catch (error: any) {
    console.error('Failed to send message:', error);
    const errorMessage = error?.message || String(error) || 'Unknown error occurred';
    throw new Error(`Message send failed: ${errorMessage}`);
  }
};

// Delete a message (mark as deleted)
export const deleteMessage = async (messageId: string) => {
  if (!currentUser) throw new Error('User not authenticated');
  
  const messageRef = ref(db, `messages/${messageId}`);
  
  // Check if message exists and belongs to user
  const snapshot = await get(messageRef);
  if (!snapshot.exists()) {
    throw new Error('Message not found');
  }
  
  const messageData = snapshot.val();
  if (messageData.uid !== currentUser.uid) {
    throw new Error('You can only delete your own messages');
  }
  
  // Mark as deleted instead of completely removing
  await update(messageRef, {
    isDeleted: true,
    text: 'This message was deleted'
  });
  
  return true;
};

// Send an image message
export const sendImageMessage = async (imageUrl: string, caption: string = '') => {
  if (!currentUser || !currentUserProfile) {
    throw new Error('User not authenticated');
  }
  
  try {
    // Create a message reference with a unique key
    const newMessageRef = push(messagesRef);
    
    // Create message data
    const messageData = {
      uid: currentUser.uid,
      name: currentUserProfile.displayName,
      photoUrl: currentUserProfile.photoURL,
      text: caption || 'Sent an image',
      imageUrl: imageUrl,
      isImage: true,
      timestamp: serverTimestamp(),
      isDeleted: false
    };
    
    // Save the message to the database
    await set(newMessageRef, messageData);
    
    return newMessageRef.key;
  } catch (error) {
    console.error('Error sending image message:', error);
    throw error;
  }
};

// Subscribe to messages - with local storage integration
export const subscribeToMessages = (callback: (messages: FirebaseMessage[]) => void, limit = 50) => {
  // Load local messages from localStorage on startup
  try {
    const savedLocalMessages = localStorage.getItem('chat_local_messages');
    if (savedLocalMessages) {
      localMessages = JSON.parse(savedLocalMessages);
      console.log(`Loaded ${localMessages.length} local messages from storage`);
    }
  } catch (error) {
    console.warn('Failed to load local messages:', error);
    localMessages = [];
  }

  // Add this callback to local message listeners
  messageListeners.push(callback);

  // Function to combine Firebase and local messages
  const combineAndSortMessages = (firebaseMessages: FirebaseMessage[], localMsgs: any[]) => {
    const allMessages = [...firebaseMessages];
    
    // Add local messages that aren't duplicates
    localMsgs.forEach(localMsg => {
      if (!allMessages.find(msg => msg.id === localMsg.id)) {
        allMessages.push({
          id: localMsg.id,
          uid: localMsg.uid || 'anonymous',
          name: localMsg.name || 'Anonymous',
          photoUrl: localMsg.photoUrl || '/default-avatar.png',
          text: localMsg.text || '',
          timestamp: localMsg.timestamp || Date.now(),
          isDeleted: localMsg.isDeleted || false,
          isImage: localMsg.isImage || false,
          imageUrl: localMsg.imageUrl || ''
        });
      }
    });
    
    // Sort by timestamp
    allMessages.sort((a, b) => a.timestamp - b.timestamp);
    return allMessages;
  };

  // Fallback function using REST API
  const fetchMessagesViaREST = async () => {
    try {
      const response = await fetch(`${firebaseConfig.databaseURL}/messages.json?orderBy="timestamp"&limitToLast=${limit}`);
      
      let firebaseMessages: FirebaseMessage[] = [];
      
      if (response.ok) {
        const data = await response.json();
        
        if (data) {
          Object.keys(data).forEach(key => {
            const message = data[key];
            if (message && !message.isDeleted) {
              firebaseMessages.push({
                id: key,
                uid: message.uid || 'anonymous',
                name: message.name || 'Anonymous',
                photoUrl: message.photoUrl || '/default-avatar.png',
                text: message.text || '',
                timestamp: message.timestamp || Date.now(),
                isDeleted: message.isDeleted || false,
                isImage: message.isImage || false,
                imageUrl: message.imageUrl || ''
              });
            }
          });
        }
      } else {
        console.warn('Failed to fetch messages via REST API:', response.status);
      }
      
      const combinedMessages = combineAndSortMessages(firebaseMessages, localMessages);
      console.log(`Loaded ${firebaseMessages.length} Firebase + ${localMessages.length} local = ${combinedMessages.length} total messages`);
      callback(combinedMessages);
      
    } catch (error) {
      console.warn('REST API fetch failed, showing local messages only:', error);
      const localOnly = combineAndSortMessages([], localMessages);
      callback(localOnly);
    }
  };

  // Try Firebase real-time subscription first
  try {
    const messagesQuery = query(
      messagesRef,
      orderByChild('timestamp'),
      limitToLast(limit)
    );
    
    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      try {
        const data = snapshot.val();
        const firebaseMessages: FirebaseMessage[] = [];
        
        if (data) {
          Object.keys(data).forEach(key => {
            const message = data[key];
            if (message && !message.isDeleted) {
              firebaseMessages.push({
                id: key,
                uid: message.uid || 'anonymous',
                name: message.name || 'Anonymous',
                photoUrl: message.photoUrl || '/default-avatar.png',
                text: message.text || '',
                timestamp: message.timestamp || Date.now(),
                isDeleted: message.isDeleted || false,
                isImage: message.isImage || false,
                imageUrl: message.imageUrl || ''
              });
            }
          });
        }
        
        const combinedMessages = combineAndSortMessages(firebaseMessages, localMessages);
        console.log(`Real-time: ${firebaseMessages.length} Firebase + ${localMessages.length} local = ${combinedMessages.length} total messages`);
        callback(combinedMessages);
        
      } catch (error) {
        console.error('Error processing real-time messages:', error);
        fetchMessagesViaREST();
      }
    }, (error) => {
      console.error('Firebase subscription error:', error);
      console.log('Falling back to REST API polling...');
      fetchMessagesViaREST();
      
      // Set up polling every 5 seconds as fallback
      const pollInterval = setInterval(fetchMessagesViaREST, 5000);
      
      return () => {
        clearInterval(pollInterval);
        // Remove from listeners
        const index = messageListeners.indexOf(callback);
        if (index > -1) {
          messageListeners.splice(index, 1);
        }
      };
    });
    
    // Return cleanup function
    return () => {
      if (unsubscribe) unsubscribe();
      // Remove from listeners
      const index = messageListeners.indexOf(callback);
      if (index > -1) {
        messageListeners.splice(index, 1);
      }
    };
    
  } catch (error) {
    console.error('Error setting up Firebase subscription:', error);
    // Fall back to REST API polling
    fetchMessagesViaREST();
    const pollInterval = setInterval(fetchMessagesViaREST, 5000);
    
    return () => {
      clearInterval(pollInterval);
      const index = messageListeners.indexOf(callback);
      if (index > -1) {
        messageListeners.splice(index, 1);
      }
    };
  }
};

// Subscribe to online users
export const subscribeToOnlineUsers = (callback: (users: Record<string, UserInfo>) => void) => {
  return onValue(usersRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback({});
      return;
    }
    
    callback(snapshot.val());
  });
};

// Set typing status - disabled to avoid permission errors
export const setTypingStatus = async (isTyping: boolean) => {
  // Disabled to avoid Firebase permission issues
  return;
};

// Subscribe to typing users
export const subscribeToTypingUsers = (callback: (typingUsers: Record<string, any>) => void) => {
  return onValue(typingRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback({});
      return;
    }
    
    const typingData = snapshot.val();
    
    // Filter out stale typing indicators (older than 5 seconds)
    const now = Date.now();
    const activeTypers = Object.keys(typingData).reduce((result, uid) => {
      const typingUser = typingData[uid];
      const timestamp = typingUser.timestamp || 0;
      
      // Only keep recent typing indicators
      if (now - timestamp < 5000) {
        result[uid] = typingUser;
      }
      
      return result;
    }, {} as Record<string, any>);
    
    callback(activeTypers);
  });
};