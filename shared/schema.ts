import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Chat messages for class chat
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  externalId: text("external_id").notNull(), // Client-generated ID (messageId)
  name: text("name").notNull(),
  photoUrl: text("photo_url").notNull(),
  text: text("text").notNull(),
  imageData: text("image_data"), // Optional image attachment
  isDeleted: boolean("is_deleted").default(false),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  externalId: true,
  name: true,
  photoUrl: true,
  text: true,
  imageData: true,
  isDeleted: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// AI Chat schemas
export const aiChats = pgTable("ai_chats", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aiMessages = pgTable("ai_messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").notNull(),
  role: text("role").notNull(), // 'user', 'assistant', 'system'
  content: text("content").notNull(),
  model: text("model").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schema for creating a new chat
export const insertAiChatSchema = createInsertSchema(aiChats).pick({
  title: true,
  userId: true,
});

// Schema for creating a new message
export const insertAiMessageSchema = createInsertSchema(aiMessages).pick({
  chatId: true,
  role: true,
  content: true,
  model: true,
  imageUrl: true,
});

// Schema for making an AI request
export const aiRequestSchema = z.object({
  message: z.string().min(1, "Message is required"),
  model: z.string().min(1, "Model is required"),
  chatId: z.number().optional(),
  imageUrl: z.string().nullable().optional(),
});

export type InsertAiChat = z.infer<typeof insertAiChatSchema>;
export type InsertAiMessage = z.infer<typeof insertAiMessageSchema>;
export type AiChat = typeof aiChats.$inferSelect;
export type AiMessage = typeof aiMessages.$inferSelect;
export type AiRequest = z.infer<typeof aiRequestSchema>;
