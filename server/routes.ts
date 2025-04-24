import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { log } from "./vite";

interface ChatMessage {
  id: string;
  name: string;
  photoUrl: string;
  text: string;
  timestamp: Date;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);
  
  // Create WebSocket server on a specific path to not conflict with Vite HMR
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Connected clients
  const clients: WebSocket[] = [];
  
  // Handle WebSocket connections
  wss.on('connection', (ws: WebSocket) => {
    log('New WebSocket client connected', 'websocket');
    
    // Add client to the list
    clients.push(ws);
    
    // Handle messages from clients
    ws.on('message', (messageData: string) => {
      try {
        const message: ChatMessage = JSON.parse(messageData);
        log(`Received message: ${message.text} from ${message.name}`, 'websocket');
        
        // Broadcast the message to all connected clients
        broadcastMessage(messageData, ws);
      } catch (error) {
        log(`Error parsing message: ${error}`, 'websocket');
      }
    });
    
    // Handle client disconnection
    ws.on('close', () => {
      const index = clients.indexOf(ws);
      if (index !== -1) {
        clients.splice(index, 1);
      }
      log('WebSocket client disconnected', 'websocket');
    });
    
    // Send a welcome message to the new client
    const welcomeMessage = {
      id: generateId(),
      name: 'System',
      photoUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzAwYjhmZiIgZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPjxwYXRoIGZpbGw9IiMwMGI4ZmYiIGQ9Ik0xMiA2Yy0zLjMxIDAtNiAyLjY5LTYgNnMyLjY5IDYgNiA2IDYtMi42OSA2LTYtMi42OS02LTYtNnptMCAxMGMtMi4yMSAwLTQtMS43OS00LTRzMS43OS00IDQtNCA0IDEuNzkgNCA0LTEuNzkgNC00IDR6Ii8+PC9zdmc+',
      text: 'Selamat datang di chat kelas! 👋',
      timestamp: new Date()
    };
    
    ws.send(JSON.stringify(welcomeMessage));
  });
  
  // Function to broadcast message to all clients except the sender
  function broadcastMessage(message: string, sender: WebSocket) {
    clients.forEach(client => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
  
  // Generate random ID for messages
  function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  return httpServer;
}
