import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, set, serverTimestamp } from "firebase/database";

// Firebase configuration with your provided credentials
const firebaseConfig = {
  apiKey: "AIzaSyD9VHCLkIOhPBWM_PJ1eIlZesFB_d-0jJo",
  authDomain: "chat-77e24.firebaseapp.com",
  databaseURL: "https://chat-77e24-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-77e24",
  storageBucket: "chat-77e24.appspot.com",
  messagingSenderId: "989714979824",
  appId: "1:989714979824:web:472950afb6a0744b13db35"
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