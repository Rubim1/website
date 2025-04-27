import { 
  users, type User, type InsertUser,
  aiChats, type AiChat, type InsertAiChat,
  aiMessages, type AiMessage, type InsertAiMessage,
  chatMessages, type ChatMessage, type InsertChatMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, sql } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Class Chat methods
  saveMessage(message: InsertChatMessage): Promise<ChatMessage>; 
  getAllMessages(limit?: number): Promise<ChatMessage[]>;
  getMessageById(externalId: string): Promise<ChatMessage | undefined>;
  
  // AI Chat methods
  createChat(chat: InsertAiChat): Promise<AiChat>;
  getChat(id: number): Promise<AiChat | undefined>;
  getAllChats(userId: number): Promise<AiChat[]>;
  updateChatTitle(id: number, title: string): Promise<AiChat | undefined>;
  deleteChat(id: number): Promise<boolean>;
  
  // AI Message methods
  createMessage(message: InsertAiMessage): Promise<AiMessage>;
  getMessages(chatId: number): Promise<AiMessage[]>;
  getLatestMessages(chatId: number, limit: number): Promise<AiMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chats: Map<number, AiChat>;
  private messages: Map<number, AiMessage>;
  private chatMessages: Map<number, ChatMessage>;
  
  userCurrentId: number;
  chatCurrentId: number;
  messageCurrentId: number;
  chatMessageCurrentId: number;

  constructor() {
    this.users = new Map();
    this.chats = new Map();
    this.messages = new Map();
    this.chatMessages = new Map();
    
    this.userCurrentId = 1;
    this.chatCurrentId = 1;
    this.messageCurrentId = 1;
    this.chatMessageCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // AI Chat methods
  async createChat(insertChat: InsertAiChat): Promise<AiChat> {
    const id = this.chatCurrentId++;
    const now = new Date();
    const chat: AiChat = { 
      ...insertChat, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.chats.set(id, chat);
    return chat;
  }
  
  async getChat(id: number): Promise<AiChat | undefined> {
    return this.chats.get(id);
  }
  
  async getAllChats(userId: number): Promise<AiChat[]> {
    return Array.from(this.chats.values())
      .filter(chat => chat.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
  
  async updateChatTitle(id: number, title: string): Promise<AiChat | undefined> {
    const chat = this.chats.get(id);
    if (!chat) return undefined;
    
    const updatedChat: AiChat = {
      ...chat,
      title,
      updatedAt: new Date()
    };
    
    this.chats.set(id, updatedChat);
    return updatedChat;
  }
  
  async deleteChat(id: number): Promise<boolean> {
    return this.chats.delete(id);
  }
  
  // AI Message methods
  async createMessage(insertMessage: InsertAiMessage): Promise<AiMessage> {
    const id = this.messageCurrentId++;
    const now = new Date();
    const message: AiMessage = {
      ...insertMessage,
      id,
      createdAt: now,
      // Ensure imageUrl is always string | null, not undefined
      imageUrl: insertMessage.imageUrl || null
    };
    
    this.messages.set(id, message);
    
    // Update the chat's updatedAt timestamp
    const chat = this.chats.get(message.chatId);
    if (chat) {
      this.chats.set(chat.id, {
        ...chat,
        updatedAt: now
      });
    }
    
    return message;
  }
  
  async getMessages(chatId: number): Promise<AiMessage[]> {
    return Array.from(this.messages.values())
      .filter(message => message.chatId === chatId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  async getLatestMessages(chatId: number, limit: number): Promise<AiMessage[]> {
    return Array.from(this.messages.values())
      .filter(message => message.chatId === chatId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(-limit);
  }
  
  // Class Chat methods
  async saveMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageCurrentId++;
    // Create a type-safe ChatMessage object from the InsertChatMessage
    // We need to handle optional fields carefully to ensure type correctness
    const chatMessage: ChatMessage = {
      id,
      externalId: message.externalId,
      name: message.name,
      photoUrl: message.photoUrl,
      text: message.text,
      imageData: message.imageData || null,
      isDeleted: message.isDeleted === undefined ? false : message.isDeleted,
      timestamp: message.timestamp || new Date()
    };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }
  
  async getAllMessages(limit?: number): Promise<ChatMessage[]> {
    const messages = Array.from(this.chatMessages.values())
      .filter(message => !message.isDeleted)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      
    if (limit) {
      return messages.slice(-limit);
    }
    return messages;
  }
  
  async getMessageById(externalId: string): Promise<ChatMessage | undefined> {
    return Array.from(this.chatMessages.values()).find(
      message => message.externalId === externalId
    );
  }
}

import { DatabaseStorage } from "./DatabaseStorage";

// Use DatabaseStorage instead of MemStorage to enable persistent storage
export const storage = new DatabaseStorage();
