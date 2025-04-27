import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { log } from "./vite";
import { aiRequestSchema, insertAiChatSchema, insertAiMessageSchema } from "../shared/schema";
import { processAiRequest, processImageAnalysisRequest, getAvailableModels } from "./services/ai";

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

  // Check if a secret exists
  app.get('/api/check-secrets', (req: Request, res: Response) => {
    const key = req.query.key as string;
    
    if (!key) {
      return res.status(400).json({ error: 'No key provided' });
    }
    
    const exists = process.env[key] !== undefined;
    res.json({ exists });
  });
  
  // Endpoint to get chat messages - supports retrieving chat history
  app.get('/api/chat/messages', async (req: Request, res: Response) => {
    try {
      // Get the limit from query params, default to 100 if not provided
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      
      // Get messages from database
      const messages = await storage.getAllMessages(limit);
      
      res.json(messages);
    } catch (error: any) {
      log(`Error fetching chat messages: ${error.message}`, 'api');
      res.status(500).json({ error: 'Failed to fetch chat messages' });
    }
  });

  // AI model-related routes
  
  // Get available AI models
  app.get('/api/ai/models', (req: Request, res: Response) => {
    try {
      const availableModels = getAvailableModels();
      res.json(availableModels);
    } catch (error: any) {
      log(`Error getting models: ${error.message}`, 'api');
      res.status(500).json({ error: 'Failed to get available models' });
    }
  });
  
  // Process AI chat request
  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const validatedData = aiRequestSchema.parse(req.body);
      const { message, model, chatId, imageUrl } = validatedData;
      
      // Mock userId for demo
      const userId = 1; // In a real app, get this from the authenticated user
      
      // Create a new chat if chatId is not provided
      let currentChatId = chatId;
      if (!currentChatId) {
        const title = message 
          ? message.substring(0, 50) + (message.length > 50 ? '...' : '')
          : 'Image Analysis';
          
        const newChat = await storage.createChat({
          title,
          userId
        });
        currentChatId = newChat.id;
      }
      
      // Create a user message
      await storage.createMessage({
        chatId: currentChatId,
        role: 'user',
        content: message || 'Analyze this image',
        model,
        imageUrl: imageUrl || null
      });
      
      // Get previous messages for context (limit to last 10)
      const previousMessages = await storage.getLatestMessages(currentChatId, 10);
      
      // Format messages for the AI API
      const formattedMessages = previousMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add the current message if not already included (might be if it's a new chat)
      if (formattedMessages.length === 0 || formattedMessages[formattedMessages.length - 1].content !== message) {
        formattedMessages.push({
          role: 'user',
          content: message || 'Analyze this image'
        });
      }
      
      // Handle image analysis if imageUrl is provided
      let response;
      try {
        if (imageUrl) {
          log(`Processing image analysis with model: ${model}`, 'api');
          response = await processImageAnalysisRequest(
            model,
            message || "Analyze this image",
            imageUrl
          );
        } else {
          // Process the AI request
          response = await processAiRequest(model, formattedMessages);
        }
      } catch (aiError: any) {
        // If the original model failed, try a fallback
        log(`AI model error: ${aiError.message}. Using fallback model.`, 'api');
        
        // Choose an appropriate fallback based on image capability
        const needsVision = !!imageUrl;
        const fallbackModel = needsVision ? 'gemini-pro-vision' : 'gemini-pro';
        
        if (imageUrl) {
          response = await processImageAnalysisRequest(
            fallbackModel,
            message || "Analyze this image",
            imageUrl
          );
        } else {
          response = await processAiRequest(fallbackModel, formattedMessages);
        }
      }
      
      // Save the AI response to the database
      const aiMessage = await storage.createMessage({
        chatId: currentChatId,
        role: 'assistant',
        content: response.content,
        model: response.model || model, // Use the model that actually generated the response
        imageUrl: null
      });
      
      // Return the response along with the chat ID and message ID
      res.json({
        chatId: currentChatId,
        message: aiMessage,
        usage: response.usage
      });
      
    } catch (error: any) {
      log(`Error in AI chat: ${error.message}`, 'api');
      res.status(500).json({ error: 'Failed to process AI request', details: error.message });
    }
  });
  
  // Get all chats for a user
  app.get('/api/ai/chats', async (req: Request, res: Response) => {
    try {
      // Mock userId for demo
      const userId = 1; // In a real app, get this from the authenticated user
      
      const chats = await storage.getAllChats(userId);
      res.json(chats);
    } catch (error: any) {
      log(`Error getting chats: ${error.message}`, 'api');
      res.status(500).json({ error: 'Failed to get chats' });
    }
  });
  
  // Get messages for a specific chat
  app.get('/api/ai/chats/:chatId/messages', async (req: Request, res: Response) => {
    try {
      const chatId = parseInt(req.params.chatId);
      
      if (isNaN(chatId)) {
        return res.status(400).json({ error: 'Invalid chat ID' });
      }
      
      const messages = await storage.getMessages(chatId);
      res.json(messages);
    } catch (error: any) {
      log(`Error getting messages: ${error.message}`, 'api');
      res.status(500).json({ error: 'Failed to get messages' });
    }
  });
  
  // Update chat title
  app.patch('/api/ai/chats/:chatId', async (req: Request, res: Response) => {
    try {
      const chatId = parseInt(req.params.chatId);
      const { title } = req.body;
      
      if (isNaN(chatId)) {
        return res.status(400).json({ error: 'Invalid chat ID' });
      }
      
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'Title is required' });
      }
      
      const updatedChat = await storage.updateChatTitle(chatId, title);
      
      if (!updatedChat) {
        return res.status(404).json({ error: 'Chat not found' });
      }
      
      res.json(updatedChat);
    } catch (error: any) {
      log(`Error updating chat: ${error.message}`, 'api');
      res.status(500).json({ error: 'Failed to update chat' });
    }
  });
  
  // Delete a chat
  app.delete('/api/ai/chats/:chatId', async (req: Request, res: Response) => {
    try {
      const chatId = parseInt(req.params.chatId);
      
      if (isNaN(chatId)) {
        return res.status(400).json({ error: 'Invalid chat ID' });
      }
      
      const deleted = await storage.deleteChat(chatId);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Chat not found' });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      log(`Error deleting chat: ${error.message}`, 'api');
      res.status(500).json({ error: 'Failed to delete chat' });
    }
  });
  
  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);
  
  // Create WebSocket server on a specific path to not conflict with Vite HMR
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Connected clients
  const clients: WebSocket[] = [];
  
  // Handle WebSocket connections
  wss.on('connection', async (ws: WebSocket) => {
    log('New WebSocket client connected', 'websocket');
    log(`Total connected clients: ${clients.length + 1}`, 'websocket');
    
    // Add client to the list
    clients.push(ws);
    
    // Handle messages from clients
    ws.on('message', async (messageData: string) => {
      try {
        const data = JSON.parse(messageData);
        
        // Handle different message types
        if (data.type === 'typing' || data.type === 'stopTyping') {
          // Handle typing indicators
          log(`${data.type === 'typing' ? 'Typing' : 'Stopped typing'} indicator from ${data.name}`, 'websocket');
          // Broadcast typing status to all clients
          broadcastMessage(messageData, ws);
        } else {
          // Regular chat message
          log(`Received message: ${data.text} from ${data.name}`, 'websocket');
          
          // Add required fields if not present
          if (!data.type) {
            data.type = 'message';
          }
          if (!data.id) {
            data.id = generateId();
          }
          if (!data.timestamp) {
            data.timestamp = new Date();
          }
          
          // Save message to database for persistence
          try {
            // Only save actual messages, not typing indicators
            await storage.saveMessage({
              externalId: data.id,
              name: data.name,
              photoUrl: data.photoUrl,
              text: data.text,
              imageData: data.imageData || null,
              isDeleted: false,
              timestamp: new Date(data.timestamp)
            });
            log(`Message saved to database: ${data.id}`, 'websocket');
          } catch (dbError) {
            log(`Error saving message to database: ${dbError}`, 'websocket');
            // Continue with broadcasting even if database save fails
          }
          
          // Re-stringify with any added fields
          const finalMessageData = JSON.stringify(data);
          
          // Broadcast the message to all connected clients
          broadcastMessage(finalMessageData, ws);
        }
      } catch (error) {
        log(`Error parsing message: ${error}`, 'websocket');
      }
    });
    
    // Handle client disconnection
    ws.on('close', () => {
      const index = clients.indexOf(ws);
      if (index !== -1) {
        clients.splice(index, 1);
        log(`Client disconnected, remaining clients: ${clients.length}`, 'websocket');
      } else {
        log('Unknown client disconnected', 'websocket');
      }
    });
    
    // Handle errors
    ws.on('error', (error) => {
      log(`WebSocket error: ${error}`, 'websocket');
      const index = clients.indexOf(ws);
      if (index !== -1) {
        clients.splice(index, 1);
      }
    });
    
    // Send a welcome message to the new client
    const welcomeMessage = {
      id: generateId(),
      type: 'message',
      name: 'System',
      photoUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzAwYjhmZiIgZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPjxwYXRoIGZpbGw9IiMwMGI4ZmYiIGQ9Ik0xMiA2Yy0zLjMxIDAtNiAyLjY5LTYgNnMyLjY5IDYgNiA2IDYtMi42OSA2LTYtMi42OS02LTYtNnptMCAxMGMtMi4yMSAwLTQtMS43OS00LTRzMS43OS00IDQtNCA0IDEuNzkgNCA0LTEuNzkgNC00IDR6Ii8+PC9zdmc+',
      text: 'Selamat datang di chat kelas! 👋',
      timestamp: new Date()
    };
    
    try {
      log('Sending welcome message to new client', 'websocket');
      
      // Check if we've already sent a welcome message in the last minute
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      const recentMessages = await storage.getAllMessages(5); // Get last 5 messages
      
      const hasSentWelcomeRecently = recentMessages.some(msg => 
        msg.name === 'System' && 
        msg.text === welcomeMessage.text &&
        new Date(msg.timestamp) > oneMinuteAgo
      );
      
      // Only save the welcome message if we haven't sent one recently
      if (!hasSentWelcomeRecently) {
        // Save welcome message to database
        await storage.saveMessage({
          externalId: welcomeMessage.id,
          name: welcomeMessage.name,
          photoUrl: welcomeMessage.photoUrl,
          text: welcomeMessage.text,
          imageData: null,
          isDeleted: false,
          timestamp: welcomeMessage.timestamp
        });
        log('Welcome message saved to database', 'websocket');
      } else {
        log('Skipped saving duplicate welcome message', 'websocket');
      }
      
      // Always send the welcome message to the client
      ws.send(JSON.stringify(welcomeMessage));
    } catch (error) {
      log(`Error sending welcome message: ${error}`, 'websocket');
    }
  });
  
  // Function to broadcast message to ALL clients
  function broadcastMessage(message: string, sender: WebSocket) {
    try {
      const data = JSON.parse(message);
      log(`Broadcasting message type: ${data.type || 'message'} ${data.text ? `"${data.text}"` : ''} from ${data.name}`, 'websocket');
      
      // IMPORTANT: Broadcast to ALL clients including sender (for confirmation)
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    } catch (error) {
      log(`Error broadcasting message: ${error}`, 'websocket');
    }
  }
  
  // Generate random ID for messages
  function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  return httpServer;
}
