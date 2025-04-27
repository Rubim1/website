import { 
  users, type User, type InsertUser,
  aiChats, type AiChat, type InsertAiChat,
  aiMessages, type AiMessage, type InsertAiMessage,
  chatMessages, type ChatMessage, type InsertChatMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, sql } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Class Chat methods
  async saveMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [savedMessage] = await db.insert(chatMessages).values(message).returning();
    return savedMessage;
  }

  async getAllMessages(limit?: number): Promise<ChatMessage[]> {
    if (limit) {
      return await db.select()
        .from(chatMessages)
        .where(eq(chatMessages.isDeleted, false))
        .orderBy(asc(chatMessages.timestamp))
        .limit(limit);
    } else {
      return await db.select()
        .from(chatMessages)
        .where(eq(chatMessages.isDeleted, false))
        .orderBy(asc(chatMessages.timestamp));
    }
  }

  async getMessageById(externalId: string): Promise<ChatMessage | undefined> {
    const [message] = await db.select()
      .from(chatMessages)
      .where(eq(chatMessages.externalId, externalId));
    return message;
  }

  // AI Chat methods
  async createChat(chat: InsertAiChat): Promise<AiChat> {
    const [newChat] = await db.insert(aiChats).values(chat).returning();
    return newChat;
  }

  async getChat(id: number): Promise<AiChat | undefined> {
    const [chat] = await db.select().from(aiChats).where(eq(aiChats.id, id));
    return chat;
  }

  async getAllChats(userId: number): Promise<AiChat[]> {
    return await db.select()
      .from(aiChats)
      .where(eq(aiChats.userId, userId))
      .orderBy(desc(aiChats.updatedAt));
  }

  async updateChatTitle(id: number, title: string): Promise<AiChat | undefined> {
    const [updatedChat] = await db.update(aiChats)
      .set({ 
        title, 
        updatedAt: new Date() 
      })
      .where(eq(aiChats.id, id))
      .returning();
    return updatedChat;
  }

  async deleteChat(id: number): Promise<boolean> {
    const result = await db.delete(aiChats).where(eq(aiChats.id, id));
    return true; // If no error was thrown, consider it successful
  }

  // AI Message methods
  async createMessage(message: InsertAiMessage): Promise<AiMessage> {
    const [newMessage] = await db.insert(aiMessages).values(message).returning();
    
    // Update the chat's updatedAt timestamp
    await db.update(aiChats)
      .set({ updatedAt: new Date() })
      .where(eq(aiChats.id, message.chatId));
    
    return newMessage;
  }

  async getMessages(chatId: number): Promise<AiMessage[]> {
    return await db.select()
      .from(aiMessages)
      .where(eq(aiMessages.chatId, chatId))
      .orderBy(asc(aiMessages.createdAt));
  }

  async getLatestMessages(chatId: number, limit: number): Promise<AiMessage[]> {
    return await db.select()
      .from(aiMessages)
      .where(eq(aiMessages.chatId, chatId))
      .orderBy(asc(aiMessages.createdAt))
      .limit(limit);
  }
}