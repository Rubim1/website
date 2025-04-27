import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, set, serverTimestamp } from "firebase/database";

// Firebase configuration - these will need to be replaced with your own Firebase project details
const firebaseConfig = {
  apiKey: "AIzaSyBeHOlOQXO9_XXBOYHk3nSEELv9iajk20Y",
  authDomain: "class-chat-app-3795a.firebaseapp.com",
  databaseURL: "https://class-chat-app-3795a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "class-chat-app-3795a",
  storageBucket: "class-chat-app-3795a.appspot.com",
  messagingSenderId: "823678097842",
  appId: "1:823678097842:web:f2c60456d9b3eff8fc2b9e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Reference to the messages collection
const messagesRef = ref(database, 'messages');

// Types
export interface FirebaseMessage {
  id: string;
  name: string;
  photoUrl: string;
  text: string;
  timestamp: number;
}

// Send a message to Firebase
export const sendMessage = (message: {
  name: string;
  photoUrl: string;
  text: string;
}) => {
  const newMessageRef = push(messagesRef);
  set(newMessageRef, {
    ...message,
    timestamp: serverTimestamp()
  });
  return newMessageRef.key;
};

// Listen for new messages
export const subscribeToMessages = (callback: (messages: FirebaseMessage[]) => void) => {
  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val() || {};
    const messageList: FirebaseMessage[] = Object.keys(data).map(key => ({
      id: key,
      ...data[key],
      timestamp: data[key].timestamp || Date.now()
    }));
    
    // Sort messages by timestamp
    messageList.sort((a, b) => a.timestamp - b.timestamp);
    
    callback(messageList);
  });
};