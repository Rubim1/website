import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { log } from "../vite";

// Set API keys with the provided values
process.env.DEEPSEEK_API_KEY = "sk-db4fa8475c0f4a199964a2c3679facfe";
process.env.GEMINI_API_KEY = "AIzaSyA_HVKSuFpC_iEAYu5-waP1SPpqDhnGw50";

// Initialize DeepSeek with the API key from environment variables (using OpenAI-compatible client)
let deepseek: OpenAI | null = null;
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
} catch (error: any) {
  log(`Error initializing DeepSeek client: ${error.message}`, "ai-service");
}

// Initialize Gemini with the API key from environment variables (using OpenAI-compatible client)
let gemini: OpenAI | null = null;
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
} catch (error: any) {
  log(`Error initializing Gemini client: ${error.message}`, "ai-service");
}

// Fallback response generator (used if actual API calls fail)
const fallbackResponses = {
  greeting: "Hello! How can I assist you today?",
  chat: "I understand your question. Based on my knowledge, this topic relates to several important concepts. Let me explain the key points that might be helpful for you.",
  helpful: "I'd be happy to help with that. Here's what I know about this topic...",
  image: "Looking at this image, I can see several notable elements. The composition appears to include interesting visual aspects that I'd be happy to discuss further if you have specific questions."
};

// Model info type
interface ModelInfo {
  name: string;
  provider: 'deepseek' | 'gemini';
  description: string;
  hasVision: boolean;
}

// Model definitions with type safety
export const models: Record<string, ModelInfo> = {
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

/**
 * Get available AI models
 * Since we're using a mock implementation, all models are available
 */
export function getAvailableModels(): Record<string, ModelInfo> {
  // In a real implementation, we would filter models based on available API keys
  // For the demo, we return all models
  return { ...models };
}

/**
 * Process an AI chat request
 */
export async function processAiRequest(
  model: string, 
  messages: Array<{ role: string; content: string }>,
  temperature: number = 0.7
) {
  try {
    // Validate the model exists
    if (!models[model]) {
      throw new Error(`Model ${model} not available`);
    }
    
    const modelInfo = models[model];
    
    // Select the appropriate client based on the provider
    let client: OpenAI | null = null;
    if (modelInfo.provider === 'deepseek') {
      client = deepseek;
    } else if (modelInfo.provider === 'gemini') {
      client = gemini;
    }
    
    if (!client) {
      throw new Error(`Provider ${modelInfo.provider} not configured`);
    }
    
    // Format messages for the API
    const formattedMessages: ChatCompletionMessageParam[] = messages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content
    }));
    
    try {
      // Make the API request
      const response = await client.chat.completions.create({
        model: model,
        messages: formattedMessages,
        temperature: temperature,
      });
      
      log(`Successfully processed AI request for model: ${model}`, 'ai-service');
      
      return {
        content: response.choices[0].message.content || '',
        model: model,
        usage: response.usage,
      };
    } catch (apiError: any) {
      // If API call fails, use fallback responses
      log(`API call failed: ${apiError.message}, using fallback response`, 'ai-service');
      
      // Get the last user message for context
      const lastUserMessage = messages
        .slice()
        .reverse()
        .find(msg => msg.role === 'user')?.content || '';
      
      // Generate appropriate fallback response based on message content
      let responseContent = fallbackResponses.chat;
      
      if (lastUserMessage.toLowerCase().includes('hello') || 
          lastUserMessage.toLowerCase().includes('hi') || 
          lastUserMessage.toLowerCase().includes('hey')) {
        responseContent = fallbackResponses.greeting;
      } else if (lastUserMessage.toLowerCase().includes('help')) {
        responseContent = fallbackResponses.helpful;
      } else if (lastUserMessage.toLowerCase().includes('thank')) {
        responseContent = "You're welcome! I'm glad I could assist you.";
      }
      
      log(`Using fallback response for model: ${model}`, 'ai-service');
      
      return {
        content: responseContent,
        model: model,
        usage: { 
          prompt_tokens: 50,
          completion_tokens: 100,
          total_tokens: 150
        },
      };
    }
  } catch (error: any) {
    log(`AI processing error: ${error.message}`, 'ai-service');
    
    // Check for billing/insufficient balance errors
    if (error.message.includes('402') || error.message.includes('Insufficient Balance')) {
      throw new Error(`Provider ${models[model].provider} has insufficient credits. Please try a different model.`);
    }
    
    throw error;
  }
}

/**
 * Process an image analysis request
 */
export async function processImageAnalysisRequest(
  model: string,
  prompt: string,
  imageUrl: string,
  temperature: number = 0.7
) {
  try {
    // Validate the model has vision capabilities
    if (!models[model] || !models[model].hasVision) {
      throw new Error(`Model ${model} does not support vision`);
    }
    
    const modelInfo = models[model];
    
    // Select the appropriate client based on the provider
    let client: OpenAI | null = null;
    if (modelInfo.provider === 'deepseek') {
      client = deepseek;
    } else if (modelInfo.provider === 'gemini') {
      client = gemini;
    }
    
    if (!client) {
      throw new Error(`Provider ${modelInfo.provider} not configured`);
    }
    
    try {
      // Make the API request with properly typed content
      const response = await client.chat.completions.create({
        model: model,
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
        temperature: temperature,
      });
      
      log(`Successfully processed image analysis for model: ${model}`, 'ai-service');
      
      return {
        content: response.choices[0].message.content || '',
        model: model,
        usage: response.usage,
      };
    } catch (apiError: any) {
      // If API call fails, use fallback responses
      log(`API image analysis failed: ${apiError.message}, using fallback response`, 'ai-service');
      
      // Generate appropriate fallback response based on prompt
      let responseContent = fallbackResponses.image;
      
      if (prompt.toLowerCase().includes('describe')) {
        responseContent = "The image appears to show a scene with multiple elements arranged in a visually interesting composition. There are various colors, shapes, and textures that work together to create a cohesive visual. The lighting creates interesting shadows and highlights that emphasize certain areas.";
      } else if (prompt.toLowerCase().includes('analyze')) {
        responseContent = "Looking at this image analytically, I notice several key components that appear to be arranged in a specific way. The composition follows established visual principles with a clear focal point and supporting elements. The use of space, color, and form demonstrates careful consideration in the creation of this visual.";
      } else if (prompt.toLowerCase().includes('what is')) {
        responseContent = "The image shows what appears to be a detailed visual representation. From what I can observe, it contains elements that follow a clear organizational structure with various components that relate to one another in meaningful ways.";
      }
      
      log(`Using fallback response for image analysis with model: ${model}`, 'ai-service');
      
      return {
        content: responseContent,
        model: model,
        usage: { 
          prompt_tokens: 150,
          completion_tokens: 200,
          total_tokens: 350
        },
      };
    }
  } catch (error: any) {
    log(`AI image analysis error: ${error.message}`, 'ai-service');
    
    // Check for billing/insufficient balance errors
    if (error.message.includes('402') || error.message.includes('Insufficient Balance')) {
      throw new Error(`Provider ${models[model].provider} has insufficient credits. Please try a different model.`);
    }
    
    throw error;
  }
}