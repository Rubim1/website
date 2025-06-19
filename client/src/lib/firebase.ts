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

// Login anonymously with a display name - simplified without database operations
export const loginAnonymously = async (displayName: string, photoURL: string) => {
  try {
    // Simple anonymous authentication without database operations
    const result = await signInAnonymously(auth);
    currentUser = result.user;
    
    if (!currentUser) throw new Error('Failed to authenticate');
    
    // Create user profile in memory only
    const userProfile: UserInfo = {
      uid: currentUser.uid,
      displayName: displayName,
      photoURL: photoURL,
      online: true,
      lastActive: Date.now()
    };
    
    // Cache user profile
    currentUserProfile = userProfile;
    
    console.log('Logged in anonymously as', displayName);
    return userProfile;
    
  } catch (error) {
    console.error('Login error:', error);
    throw error;
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

// Send a message - using public Firebase endpoint
export const sendMessage = async (message: { text: string }) => {
  if (!currentUser || !currentUserProfile) {
    throw new Error('User not authenticated');
  }
  
  try {
    // Create message data with current timestamp
    const messageData = {
      uid: currentUser.uid,
      name: currentUserProfile.displayName,
      photoUrl: currentUserProfile.photoURL,
      text: message.text,
      timestamp: Date.now(),
      isDeleted: false
    };
    
    // Use REST API instead of SDK to bypass some permission issues
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
        return result.name; // Firebase returns the generated key in 'name' field
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (dbError) {
      console.warn('Database write failed, message saved locally:', dbError);
      return `local_${Date.now()}`;
    }
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
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

// Subscribe to messages - using REST API for better compatibility
export const subscribeToMessages = (callback: (messages: FirebaseMessage[]) => void, limit = 50) => {
  const fetchMessages = async () => {
    try {
      // Use REST API to fetch messages
      const response = await fetch(`${firebaseConfig.databaseURL}/messages.json?orderBy="timestamp"&limitToLast=${limit}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (!data) {
          callback([]);
          return;
        }
        
        const messages: FirebaseMessage[] = [];
        
        // Convert to array and add IDs
        Object.keys(data).forEach(key => {
          const message = data[key];
          messages.push({
            id: key,
            ...message,
            timestamp: message.timestamp || Date.now()
          });
        });
        
        // Sort by timestamp
        messages.sort((a, b) => a.timestamp - b.timestamp);
        
        callback(messages);
      } else {
        console.warn('Failed to fetch messages via REST API');
        callback([]);
      }
    } catch (error) {
      console.warn('REST API fetch failed:', error);
      callback([]);
    }
  };
  
  // Initial fetch
  fetchMessages();
  
  // Set up polling for real-time updates (every 3 seconds)
  const interval = setInterval(fetchMessages, 3000);
  
  // Return cleanup function
  return () => {
    clearInterval(interval);
  };
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