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
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser
} from "firebase/auth";

// Firebase configuration with direct values
const firebaseConfig = {
  apiKey: "AIzaSyD9VHCLkIOhPBWM_PJ1eIlZesFB_d-0jJo",
  authDomain: "chat-77e24.firebaseapp.com",
  databaseURL: "https://chat-77e24-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-77e24",
  storageBucket: "chat-77e24.appspot.com",
  appId: "1:989714979824:web:472950afb6a0744b13db35"
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

// Login anonymously with a display name
export const loginAnonymously = async (displayName: string, photoURL: string) => {
  try {
    // Sign in anonymously to Firebase
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
    
    // Save user in the Realtime Database
    const userRef = ref(db, `users/${currentUser.uid}`);
    await set(userRef, userProfile);
    
    // When the user disconnects, update their status
    const statusRef = ref(db, `users/${currentUser.uid}/online`);
    const lastActiveRef = ref(db, `users/${currentUser.uid}/lastActive`);
    
    onDisconnect(statusRef).set(false);
    onDisconnect(lastActiveRef).set(serverTimestamp());
    
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

// Send a message
export const sendMessage = async (message: { text: string }) => {
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
      text: message.text,
      timestamp: serverTimestamp(),
      isDeleted: false
    };
    
    // Save the message to the database
    await set(newMessageRef, messageData);
    
    // Stop typing indicator when sending a message
    await setTypingStatus(false);
    
    return newMessageRef.key;
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

// Subscribe to messages
export const subscribeToMessages = (callback: (messages: FirebaseMessage[]) => void, limit = 50) => {
  // Create a query for the most recent messages
  const messagesQuery = query(
    messagesRef,
    orderByChild('timestamp'),
    limitToLast(limit)
  );
  
  // Listen for changes in the messages
  return onValue(messagesQuery, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    
    const data = snapshot.val();
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
  });
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

// Set typing status
export const setTypingStatus = async (isTyping: boolean) => {
  if (!currentUser || !currentUserProfile) return;
  
  try {
    const typingUserRef = ref(db, `typing/${currentUser.uid}`);
    
    if (isTyping) {
      // Set typing status
      await set(typingUserRef, {
        uid: currentUser.uid, 
        name: currentUserProfile.displayName,
        photoUrl: currentUserProfile.photoURL,
        timestamp: serverTimestamp()
      });
      
      // Auto-remove typing status on disconnect
      onDisconnect(typingUserRef).remove();
    } else {
      // Clear typing status
      await remove(typingUserRef);
    }
  } catch (error) {
    console.error('Error setting typing status:', error);
  }
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