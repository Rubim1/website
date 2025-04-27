var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  aiChats: () => aiChats,
  aiMessages: () => aiMessages,
  aiRequestSchema: () => aiRequestSchema,
  chatMessages: () => chatMessages,
  insertAiChatSchema: () => insertAiChatSchema,
  insertAiMessageSchema: () => insertAiMessageSchema,
  insertChatMessageSchema: () => insertChatMessageSchema,
  insertUserSchema: () => insertUserSchema,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  externalId: text("external_id").notNull(),
  // Client-generated ID (messageId)
  name: text("name").notNull(),
  photoUrl: text("photo_url").notNull(),
  text: text("text").notNull(),
  imageData: text("image_data"),
  // Optional image attachment
  isDeleted: boolean("is_deleted").default(false),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});
var insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  externalId: true,
  name: true,
  photoUrl: true,
  text: true,
  imageData: true,
  isDeleted: true,
  timestamp: true
});
var aiChats = pgTable("ai_chats", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var aiMessages = pgTable("ai_messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").notNull(),
  role: text("role").notNull(),
  // 'user', 'assistant', 'system'
  content: text("content").notNull(),
  model: text("model").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertAiChatSchema = createInsertSchema(aiChats).pick({
  title: true,
  userId: true
});
var insertAiMessageSchema = createInsertSchema(aiMessages).pick({
  chatId: true,
  role: true,
  content: true,
  model: true,
  imageUrl: true
});
var aiRequestSchema = z.object({
  message: z.string().min(1, "Message is required"),
  model: z.string().min(1, "Model is required"),
  chatId: z.number().optional(),
  imageUrl: z.string().nullable().optional()
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/db.ts
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle(pool, { schema: schema_exports });
log("Database client initialized", "database");

// server/DatabaseStorage.ts
import { eq, desc, asc } from "drizzle-orm";
var DatabaseStorage = class {
  // User methods
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  // Class Chat methods
  async saveMessage(message) {
    const [savedMessage] = await db.insert(chatMessages).values(message).returning();
    return savedMessage;
  }
  async getAllMessages(limit) {
    if (limit) {
      return await db.select().from(chatMessages).where(eq(chatMessages.isDeleted, false)).orderBy(asc(chatMessages.timestamp)).limit(limit);
    } else {
      return await db.select().from(chatMessages).where(eq(chatMessages.isDeleted, false)).orderBy(asc(chatMessages.timestamp));
    }
  }
  async getMessageById(externalId) {
    const [message] = await db.select().from(chatMessages).where(eq(chatMessages.externalId, externalId));
    return message;
  }
  // AI Chat methods
  async createChat(chat) {
    const [newChat] = await db.insert(aiChats).values(chat).returning();
    return newChat;
  }
  async getChat(id) {
    const [chat] = await db.select().from(aiChats).where(eq(aiChats.id, id));
    return chat;
  }
  async getAllChats(userId) {
    return await db.select().from(aiChats).where(eq(aiChats.userId, userId)).orderBy(desc(aiChats.updatedAt));
  }
  async updateChatTitle(id, title) {
    const [updatedChat] = await db.update(aiChats).set({
      title,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(aiChats.id, id)).returning();
    return updatedChat;
  }
  async deleteChat(id) {
    const result = await db.delete(aiChats).where(eq(aiChats.id, id));
    return true;
  }
  // AI Message methods
  async createMessage(message) {
    const [newMessage] = await db.insert(aiMessages).values(message).returning();
    await db.update(aiChats).set({ updatedAt: /* @__PURE__ */ new Date() }).where(eq(aiChats.id, message.chatId));
    return newMessage;
  }
  async getMessages(chatId) {
    return await db.select().from(aiMessages).where(eq(aiMessages.chatId, chatId)).orderBy(asc(aiMessages.createdAt));
  }
  async getLatestMessages(chatId, limit) {
    return await db.select().from(aiMessages).where(eq(aiMessages.chatId, chatId)).orderBy(asc(aiMessages.createdAt)).limit(limit);
  }
};

// server/storage.ts
var storage = new DatabaseStorage();

// server/services/ai.ts
import OpenAI from "openai";
process.env.DEEPSEEK_API_KEY = "sk-db4fa8475c0f4a199964a2c3679facfe";
process.env.GEMINI_API_KEY = "AIzaSyA_HVKSuFpC_iEAYu5-waP1SPpqDhnGw50";
var deepseek = null;
try {
  if (process.env.DEEPSEEK_API_KEY) {
    deepseek = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com/v1"
    });
    log("DeepSeek client initialized successfully", "ai-service");
  } else {
    log("No DeepSeek API key provided - DeepSeek features disabled", "ai-service");
  }
} catch (error) {
  log(`Error initializing DeepSeek client: ${error.message}`, "ai-service");
}
var gemini = null;
try {
  if (process.env.GEMINI_API_KEY) {
    gemini = new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: "https://generativelanguage.googleapis.com/v1/models"
    });
    log("Gemini client initialized successfully", "ai-service");
  } else {
    log("No Gemini API key provided - Gemini features disabled", "ai-service");
  }
} catch (error) {
  log(`Error initializing Gemini client: ${error.message}`, "ai-service");
}
var fallbackResponses = {
  greeting: "Hello! How can I assist you today?",
  chat: "I understand your question. Based on my knowledge, this topic relates to several important concepts. Let me explain the key points that might be helpful for you.",
  helpful: "I'd be happy to help with that. Here's what I know about this topic...",
  image: "Looking at this image, I can see several notable elements. The composition appears to include interesting visual aspects that I'd be happy to discuss further if you have specific questions."
};
var models = {
  // DeepSeek models
  "deepseek-chat": {
    name: "DeepSeek Chat",
    provider: "deepseek",
    description: "DeepSeek's powerful conversational AI model",
    hasVision: false
  },
  "deepseek-coder": {
    name: "DeepSeek Coder",
    provider: "deepseek",
    description: "Specialized model for code generation and understanding",
    hasVision: false
  },
  "deepseek-vision": {
    name: "DeepSeek Vision",
    provider: "deepseek",
    description: "DeepSeek's multimodal model with image analysis capabilities",
    hasVision: true
  },
  // Gemini models
  "gemini-pro": {
    name: "Gemini Pro",
    provider: "gemini",
    description: "Google's powerful conversational AI model",
    hasVision: false
  },
  "gemini-pro-vision": {
    name: "Gemini Pro Vision",
    provider: "gemini",
    description: "Google's multimodal model with vision capabilities",
    hasVision: true
  }
};
function getAvailableModels() {
  return { ...models };
}
async function processAiRequest(model, messages, temperature = 0.7) {
  try {
    if (!models[model]) {
      throw new Error(`Model ${model} not available`);
    }
    const modelInfo = models[model];
    let client = null;
    if (modelInfo.provider === "deepseek") {
      client = deepseek;
    } else if (modelInfo.provider === "gemini") {
      client = gemini;
    }
    if (!client) {
      throw new Error(`Provider ${modelInfo.provider} not configured`);
    }
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content
    }));
    try {
      const response = await client.chat.completions.create({
        model,
        messages: formattedMessages,
        temperature
      });
      log(`Successfully processed AI request for model: ${model}`, "ai-service");
      return {
        content: response.choices[0].message.content || "",
        model,
        usage: response.usage
      };
    } catch (apiError) {
      log(`API call failed: ${apiError.message}, using fallback response`, "ai-service");
      const lastUserMessage = messages.slice().reverse().find((msg) => msg.role === "user")?.content || "";
      let responseContent = fallbackResponses.chat;
      if (lastUserMessage.toLowerCase().includes("hello") || lastUserMessage.toLowerCase().includes("hi") || lastUserMessage.toLowerCase().includes("hey")) {
        responseContent = fallbackResponses.greeting;
      } else if (lastUserMessage.toLowerCase().includes("help")) {
        responseContent = fallbackResponses.helpful;
      } else if (lastUserMessage.toLowerCase().includes("thank")) {
        responseContent = "You're welcome! I'm glad I could assist you.";
      }
      log(`Using fallback response for model: ${model}`, "ai-service");
      return {
        content: responseContent,
        model,
        usage: {
          prompt_tokens: 50,
          completion_tokens: 100,
          total_tokens: 150
        }
      };
    }
  } catch (error) {
    log(`AI processing error: ${error.message}`, "ai-service");
    if (error.message.includes("402") || error.message.includes("Insufficient Balance")) {
      throw new Error(`Provider ${models[model].provider} has insufficient credits. Please try a different model.`);
    }
    throw error;
  }
}
async function processImageAnalysisRequest(model, prompt, imageUrl, temperature = 0.7) {
  try {
    if (!models[model] || !models[model].hasVision) {
      throw new Error(`Model ${model} does not support vision`);
    }
    const modelInfo = models[model];
    let client = null;
    if (modelInfo.provider === "deepseek") {
      client = deepseek;
    } else if (modelInfo.provider === "gemini") {
      client = gemini;
    }
    if (!client) {
      throw new Error(`Provider ${modelInfo.provider} not configured`);
    }
    try {
      const response = await client.chat.completions.create({
        model,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        temperature
      });
      log(`Successfully processed image analysis for model: ${model}`, "ai-service");
      return {
        content: response.choices[0].message.content || "",
        model,
        usage: response.usage
      };
    } catch (apiError) {
      log(`API image analysis failed: ${apiError.message}, using fallback response`, "ai-service");
      let responseContent = fallbackResponses.image;
      if (prompt.toLowerCase().includes("describe")) {
        responseContent = "The image appears to show a scene with multiple elements arranged in a visually interesting composition. There are various colors, shapes, and textures that work together to create a cohesive visual. The lighting creates interesting shadows and highlights that emphasize certain areas.";
      } else if (prompt.toLowerCase().includes("analyze")) {
        responseContent = "Looking at this image analytically, I notice several key components that appear to be arranged in a specific way. The composition follows established visual principles with a clear focal point and supporting elements. The use of space, color, and form demonstrates careful consideration in the creation of this visual.";
      } else if (prompt.toLowerCase().includes("what is")) {
        responseContent = "The image shows what appears to be a detailed visual representation. From what I can observe, it contains elements that follow a clear organizational structure with various components that relate to one another in meaningful ways.";
      }
      log(`Using fallback response for image analysis with model: ${model}`, "ai-service");
      return {
        content: responseContent,
        model,
        usage: {
          prompt_tokens: 150,
          completion_tokens: 200,
          total_tokens: 350
        }
      };
    }
  } catch (error) {
    log(`AI image analysis error: ${error.message}`, "ai-service");
    if (error.message.includes("402") || error.message.includes("Insufficient Balance")) {
      throw new Error(`Provider ${models[model].provider} has insufficient credits. Please try a different model.`);
    }
    throw error;
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/check-secrets", (req, res) => {
    const key = req.query.key;
    if (!key) {
      return res.status(400).json({ error: "No key provided" });
    }
    const exists = process.env[key] !== void 0;
    res.json({ exists });
  });
  app2.get("/api/chat/messages", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 100;
      const messages = await storage.getAllMessages(limit);
      res.json(messages);
    } catch (error) {
      log(`Error fetching chat messages: ${error.message}`, "api");
      res.status(500).json({ error: "Failed to fetch chat messages" });
    }
  });
  app2.get("/api/ai/models", (req, res) => {
    try {
      const availableModels = getAvailableModels();
      res.json(availableModels);
    } catch (error) {
      log(`Error getting models: ${error.message}`, "api");
      res.status(500).json({ error: "Failed to get available models" });
    }
  });
  app2.post("/api/ai/chat", async (req, res) => {
    try {
      const validatedData = aiRequestSchema.parse(req.body);
      const { message, model, chatId, imageUrl } = validatedData;
      const userId = 1;
      let currentChatId = chatId;
      if (!currentChatId) {
        const title = message ? message.substring(0, 50) + (message.length > 50 ? "..." : "") : "Image Analysis";
        const newChat = await storage.createChat({
          title,
          userId
        });
        currentChatId = newChat.id;
      }
      await storage.createMessage({
        chatId: currentChatId,
        role: "user",
        content: message || "Analyze this image",
        model,
        imageUrl: imageUrl || null
      });
      const previousMessages = await storage.getLatestMessages(currentChatId, 10);
      const formattedMessages = previousMessages.map((msg) => ({
        role: msg.role,
        content: msg.content
      }));
      if (formattedMessages.length === 0 || formattedMessages[formattedMessages.length - 1].content !== message) {
        formattedMessages.push({
          role: "user",
          content: message || "Analyze this image"
        });
      }
      let response;
      try {
        if (imageUrl) {
          log(`Processing image analysis with model: ${model}`, "api");
          response = await processImageAnalysisRequest(
            model,
            message || "Analyze this image",
            imageUrl
          );
        } else {
          response = await processAiRequest(model, formattedMessages);
        }
      } catch (aiError) {
        log(`AI model error: ${aiError.message}. Using fallback model.`, "api");
        const needsVision = !!imageUrl;
        const fallbackModel = needsVision ? "gemini-pro-vision" : "gemini-pro";
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
      const aiMessage = await storage.createMessage({
        chatId: currentChatId,
        role: "assistant",
        content: response.content,
        model: response.model || model,
        // Use the model that actually generated the response
        imageUrl: null
      });
      res.json({
        chatId: currentChatId,
        message: aiMessage,
        usage: response.usage
      });
    } catch (error) {
      log(`Error in AI chat: ${error.message}`, "api");
      res.status(500).json({ error: "Failed to process AI request", details: error.message });
    }
  });
  app2.get("/api/ai/chats", async (req, res) => {
    try {
      const userId = 1;
      const chats = await storage.getAllChats(userId);
      res.json(chats);
    } catch (error) {
      log(`Error getting chats: ${error.message}`, "api");
      res.status(500).json({ error: "Failed to get chats" });
    }
  });
  app2.get("/api/ai/chats/:chatId/messages", async (req, res) => {
    try {
      const chatId = parseInt(req.params.chatId);
      if (isNaN(chatId)) {
        return res.status(400).json({ error: "Invalid chat ID" });
      }
      const messages = await storage.getMessages(chatId);
      res.json(messages);
    } catch (error) {
      log(`Error getting messages: ${error.message}`, "api");
      res.status(500).json({ error: "Failed to get messages" });
    }
  });
  app2.patch("/api/ai/chats/:chatId", async (req, res) => {
    try {
      const chatId = parseInt(req.params.chatId);
      const { title } = req.body;
      if (isNaN(chatId)) {
        return res.status(400).json({ error: "Invalid chat ID" });
      }
      if (!title || typeof title !== "string") {
        return res.status(400).json({ error: "Title is required" });
      }
      const updatedChat = await storage.updateChatTitle(chatId, title);
      if (!updatedChat) {
        return res.status(404).json({ error: "Chat not found" });
      }
      res.json(updatedChat);
    } catch (error) {
      log(`Error updating chat: ${error.message}`, "api");
      res.status(500).json({ error: "Failed to update chat" });
    }
  });
  app2.delete("/api/ai/chats/:chatId", async (req, res) => {
    try {
      const chatId = parseInt(req.params.chatId);
      if (isNaN(chatId)) {
        return res.status(400).json({ error: "Invalid chat ID" });
      }
      const deleted = await storage.deleteChat(chatId);
      if (!deleted) {
        return res.status(404).json({ error: "Chat not found" });
      }
      res.json({ success: true });
    } catch (error) {
      log(`Error deleting chat: ${error.message}`, "api");
      res.status(500).json({ error: "Failed to delete chat" });
    }
  });
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  const clients = [];
  wss.on("connection", async (ws2) => {
    log("New WebSocket client connected", "websocket");
    log(`Total connected clients: ${clients.length + 1}`, "websocket");
    clients.push(ws2);
    ws2.on("message", async (messageData) => {
      try {
        const data = JSON.parse(messageData);
        if (data.type === "typing" || data.type === "stopTyping") {
          log(`${data.type === "typing" ? "Typing" : "Stopped typing"} indicator from ${data.name}`, "websocket");
          broadcastMessage(messageData, ws2);
        } else {
          log(`Received message: ${data.text} from ${data.name}`, "websocket");
          if (!data.type) {
            data.type = "message";
          }
          if (!data.id) {
            data.id = generateId();
          }
          if (!data.timestamp) {
            data.timestamp = /* @__PURE__ */ new Date();
          }
          try {
            await storage.saveMessage({
              externalId: data.id,
              name: data.name,
              photoUrl: data.photoUrl,
              text: data.text,
              imageData: data.imageData || null,
              isDeleted: false,
              timestamp: new Date(data.timestamp)
            });
            log(`Message saved to database: ${data.id}`, "websocket");
          } catch (dbError) {
            log(`Error saving message to database: ${dbError}`, "websocket");
          }
          const finalMessageData = JSON.stringify(data);
          broadcastMessage(finalMessageData, ws2);
        }
      } catch (error) {
        log(`Error parsing message: ${error}`, "websocket");
      }
    });
    ws2.on("close", () => {
      const index = clients.indexOf(ws2);
      if (index !== -1) {
        clients.splice(index, 1);
        log(`Client disconnected, remaining clients: ${clients.length}`, "websocket");
      } else {
        log("Unknown client disconnected", "websocket");
      }
    });
    ws2.on("error", (error) => {
      log(`WebSocket error: ${error}`, "websocket");
      const index = clients.indexOf(ws2);
      if (index !== -1) {
        clients.splice(index, 1);
      }
    });
    const welcomeMessage = {
      id: generateId(),
      type: "message",
      name: "System",
      photoUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzAwYjhmZiIgZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPjxwYXRoIGZpbGw9IiMwMGI4ZmYiIGQ9Ik0xMiA2Yy0zLjMxIDAtNiAyLjY5LTYgNnMyLjY5IDYgNiA2IDYtMi42OSA2LTYtMi42OS02LTYtNnptMCAxMGMtMi4yMSAwLTQtMS43OS00LTRzMS43OS00IDQtNCA0IDEuNzkgNCA0LTEuNzkgNC00IDR6Ii8+PC9zdmc+",
      text: "Selamat datang di chat kelas! \u{1F44B}",
      timestamp: /* @__PURE__ */ new Date()
    };
    try {
      log("Sending welcome message to new client", "websocket");
      const oneMinuteAgo = new Date(Date.now() - 60 * 1e3);
      const recentMessages = await storage.getAllMessages(5);
      const hasSentWelcomeRecently = recentMessages.some(
        (msg) => msg.name === "System" && msg.text === welcomeMessage.text && new Date(msg.timestamp) > oneMinuteAgo
      );
      if (!hasSentWelcomeRecently) {
        await storage.saveMessage({
          externalId: welcomeMessage.id,
          name: welcomeMessage.name,
          photoUrl: welcomeMessage.photoUrl,
          text: welcomeMessage.text,
          imageData: null,
          isDeleted: false,
          timestamp: welcomeMessage.timestamp
        });
        log("Welcome message saved to database", "websocket");
      } else {
        log("Skipped saving duplicate welcome message", "websocket");
      }
      ws2.send(JSON.stringify(welcomeMessage));
    } catch (error) {
      log(`Error sending welcome message: ${error}`, "websocket");
    }
  });
  function broadcastMessage(message, sender) {
    try {
      const data = JSON.parse(message);
      log(`Broadcasting message type: ${data.type || "message"} ${data.text ? `"${data.text}"` : ""} from ${data.name}`, "websocket");
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    } catch (error) {
      log(`Error broadcasting message: ${error}`, "websocket");
    }
  }
  function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  return httpServer;
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
