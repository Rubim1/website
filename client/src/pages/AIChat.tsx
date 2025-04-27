import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Send, Image, X, Trash2, Edit, MessageSquare, PlusCircle, Search, BotIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { check_secrets } from '@/lib/apiUtils';

// AI Chat types
interface AIMessage {
  id: number;
  chatId: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model: string;
  imageUrl: string | null;
  createdAt: Date;
}

interface AIChat {
  id: number;
  title: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface AIModel {
  name: string;
  provider: string;
  description: string;
  hasVision: boolean;
}

// Image upload component
const ImageUploader = ({ 
  imageUrl, 
  setImageUrl, 
  isUploading, 
  setIsUploading 
}: { 
  imageUrl: string | null; 
  setImageUrl: (url: string | null) => void;
  isUploading: boolean;
  setIsUploading: (status: boolean) => void;
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Convert to base64 for easy display and API transmission
    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
        setIsUploading(false);
      };
      reader.onerror = () => {
        toast({
          title: "Error reading file",
          description: "Failed to process the image",
          variant: "destructive"
        });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error processing image",
        description: "Failed to process the image",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      {imageUrl ? (
        <div className="relative mt-2 rounded-md overflow-hidden">
          <img 
            src={imageUrl} 
            alt="Uploaded" 
            className="max-h-48 w-auto rounded-md border border-accent/30"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={() => setImageUrl(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Image className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload an image for analysis</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

// AI Chat main component
const AIChat: React.FC = () => {
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-pro-vision');
  const [inputMessage, setInputMessage] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Check for API keys
  const [hasDeepSeekKey, setHasDeepSeekKey] = useState<boolean>(false);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if API keys are present
    const checkKeys = async () => {
      const deepseekKey = await check_secrets('DEEPSEEK_API_KEY');
      const geminiKey = await check_secrets('GEMINI_API_KEY');
      setHasDeepSeekKey(deepseekKey);
      setHasGeminiKey(geminiKey);
    };
    
    checkKeys();
  }, []);

  // Fetch AI models
  const { 
    data: models,
    isLoading: isLoadingModels,
    error: modelsError
  } = useQuery({
    queryKey: ['/api/ai/models'],
    queryFn: async () => {
      const response = await fetch('/api/ai/models');
      if (!response.ok) throw new Error('Failed to fetch models');
      return response.json();
    },
  });

  // Fetch chats
  const { 
    data: chats,
    isLoading: isLoadingChats,
    error: chatsError
  } = useQuery({
    queryKey: ['/api/ai/chats'],
    queryFn: async () => {
      const response = await fetch('/api/ai/chats');
      if (!response.ok) throw new Error('Failed to fetch chats');
      
      const data = await response.json();
      // If there are chats and no current chat is selected, select the first one
      if (data.length > 0 && !currentChatId) {
        setCurrentChatId(data[0].id);
      }
      return data;
    },
  });

  // Fetch messages for the current chat
  const { 
    data: messages,
    isLoading: isLoadingMessages,
    error: messagesError
  } = useQuery({
    queryKey: ['/api/ai/chats', currentChatId, 'messages'],
    queryFn: async () => {
      if (!currentChatId) return [];
      
      const response = await fetch(`/api/ai/chats/${currentChatId}/messages`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
    enabled: !!currentChatId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { message: string; model: string; chatId?: number; imageUrl?: string | null }) => {
      return apiRequest('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      // Clear the input and image after sending
      setInputMessage('');
      setImageUrl(null);
      
      // Update the current chat ID if it's a new chat
      if (!currentChatId) {
        setCurrentChatId(data.chatId);
      }
      
      // Invalidate the relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/ai/chats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/chats', data.chatId, 'messages'] });
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message || "Failed to send message",
        variant: "destructive"
      });
    }
  });

  // Create a new chat mutation
  const createChatMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: "Start a new conversation",
          model: selectedModel,
        }),
      });
    },
    onSuccess: (data) => {
      setCurrentChatId(data.chatId);
      queryClient.invalidateQueries({ queryKey: ['/api/ai/chats'] });
    },
    onError: (error) => {
      toast({
        title: "Error creating chat",
        description: error.message || "Failed to create new chat",
        variant: "destructive"
      });
    }
  });

  // Delete chat mutation
  const deleteChatMutation = useMutation({
    mutationFn: async (chatId: number) => {
      return apiRequest(`/api/ai/chats/${chatId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/chats'] });
      // If there are other chats, select the first one, otherwise set to null
      if (chats && chats.length > 1) {
        const newChatId = chats.find((chat: AIChat) => chat.id !== currentChatId)?.id || null;
        setCurrentChatId(newChatId);
      } else {
        setCurrentChatId(null);
      }
    },
    onError: (error) => {
      toast({
        title: "Error deleting chat",
        description: error.message || "Failed to delete chat",
        variant: "destructive"
      });
    }
  });

  // Update chat title mutation
  const updateChatTitleMutation = useMutation({
    mutationFn: async ({ chatId, title }: { chatId: number; title: string }) => {
      return apiRequest(`/api/ai/chats/${chatId}`, {
        method: 'PATCH',
        body: JSON.stringify({ title }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/chats'] });
    },
    onError: (error) => {
      toast({
        title: "Error updating chat title",
        description: error.message || "Failed to update chat title",
        variant: "destructive"
      });
    }
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() && !imageUrl) {
      toast({
        title: "Empty message",
        description: "Please enter a message or upload an image",
        variant: "destructive"
      });
      return;
    }
    
    if (sendMessageMutation.isPending) return;
    
    sendMessageMutation.mutate({
      message: inputMessage,
      model: selectedModel,
      chatId: currentChatId || undefined,
      imageUrl: imageUrl
    });
  };

  // Create a new chat
  const handleNewChat = () => {
    setCurrentChatId(null);
    setInputMessage('');
    setImageUrl(null);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('default', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Filter chats by search query
  const filteredChats = chats?.filter((chat: AIChat) => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function to get model display name
  const getModelDisplayName = (modelId: string) => {
    return models?.[modelId]?.name || modelId;
  };

  // Render chat list item
  const renderChatItem = (chat: AIChat) => (
    <div 
      key={chat.id}
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
        currentChatId === chat.id 
          ? 'bg-primary/20 text-white' 
          : 'hover:bg-accent/10 text-gray-300'
      }`}
      onClick={() => setCurrentChatId(chat.id)}
    >
      <div className="flex items-center space-x-2 overflow-hidden">
        <MessageSquare className="flex-shrink-0 h-5 w-5" />
        <div className="flex-1 truncate">
          <p className="truncate">{chat.title}</p>
          <p className="text-xs text-gray-400">{formatDate(chat.updatedAt.toString())}</p>
        </div>
      </div>
      
      {currentChatId === chat.id && (
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Are you sure you want to delete this chat?')) {
                deleteChatMutation.mutate(chat.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              const newTitle = window.prompt('Enter new title:', chat.title);
              if (newTitle && newTitle !== chat.title) {
                updateChatTitleMutation.mutate({ chatId: chat.id, title: newTitle });
              }
            }}
          >
            <Edit className="h-4 w-4 text-gray-400 hover:text-primary" />
          </Button>
        </div>
      )}
    </div>
  );

  // Render an API key warning if keys are missing
  const renderApiKeyWarning = () => {
    if (!hasDeepSeekKey && !hasGeminiKey) {
      return (
        <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4 mb-4">
          <h3 className="text-yellow-500 font-medium">API Keys Required</h3>
          <p className="text-gray-300 text-sm mt-1">
            No AI provider API keys have been configured. Please add at least one API key for DeepSeek or Gemini to use this feature.
          </p>
        </div>
      );
    }
    
    const missingProviders = [];
    if (!hasDeepSeekKey) missingProviders.push("DeepSeek");
    if (!hasGeminiKey) missingProviders.push("Gemini");
    
    if (missingProviders.length > 0) {
      return (
        <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4 mb-4">
          <h3 className="text-blue-500 font-medium">Some Models Unavailable</h3>
          <p className="text-gray-300 text-sm mt-1">
            {missingProviders.join(", ")} API key(s) not configured. Only models from configured providers are available.
          </p>
        </div>
      );
    }
    
    // Add a warning for DeepSeek insufficient balance
    return (
      <div className="bg-amber-900/30 border border-amber-600/50 rounded-lg p-4 mb-4">
        <h3 className="text-amber-500 font-medium">DeepSeek Models Temporarily Unavailable</h3>
        <p className="text-gray-300 text-sm mt-1">
          DeepSeek models are currently unavailable due to insufficient API credits. Please use Gemini models instead.
        </p>
      </div>
    );
  };

  return (
    <section className="min-h-screen py-20 md:py-24 relative">
      {/* Dynamic background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-900 -z-10">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgc3Ryb2tlPSIjMjA5MGVhIiBzdHJva2Utb3BhY2l0eT0iLjIiIGN4PSIxMDAiIGN5PSIxMDAiIHI9Ijk5Ii8+PC9nPjwvc3ZnPg==')] bg-repeat opacity-10"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              AI Assistant
            </h1>
            <p className="text-gray-300 mt-4 max-w-xl mx-auto">
              Chat with multiple AI models, analyze images, and get answers to your questions
            </p>
          </motion.div>
          
          {renderApiKeyWarning()}
          
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 shadow-xl">
            <div className="flex flex-col md:flex-row h-[70vh]">
              {/* Sidebar with chat history */}
              <div className={`w-full md:w-80 bg-gray-900 border-r border-gray-800 overflow-hidden ${isMobile && currentChatId ? 'hidden' : 'flex flex-col'}`}>
                <div className="p-4 border-b border-gray-800">
                  <h2 className="text-xl font-semibold text-white">Conversations</h2>
                </div>
                
                {/* New chat button */}
                <div className="p-4">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={handleNewChat}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Chat
                  </Button>
                </div>
                
                {/* Search */}
                <div className="px-4 pb-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search conversations..."
                      className="pl-9 bg-gray-800 border-gray-700"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2">
                  {isLoadingChats ? (
                    <div className="flex justify-center items-center h-20">
                      <Loader2 className="h-6 w-6 text-primary animate-spin" />
                    </div>
                  ) : chatsError ? (
                    <div className="text-center p-4 text-red-400">
                      Failed to load conversations
                    </div>
                  ) : filteredChats?.length === 0 ? (
                    <div className="text-center p-4 text-gray-400">
                      {searchQuery ? 'No matching conversations' : 'No conversations yet'}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredChats?.map(renderChatItem)}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Main chat area */}
              <div className={`flex-1 flex flex-col ${!isMobile || currentChatId ? 'block' : 'hidden'}`}>
                {/* Chat header with model selection */}
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center">
                    {isMobile && currentChatId && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="mr-2"
                        onClick={() => setCurrentChatId(null)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                          <path d="m15 18-6-6 6-6"/>
                        </svg>
                      </Button>
                    )}
                    <h2 className="text-lg font-medium text-white">
                      {currentChatId 
                        ? chats?.find((chat: AIChat) => chat.id === currentChatId)?.title || 'Chat' 
                        : 'New Conversation'
                      }
                    </h2>
                  </div>
                  
                  <div className="w-48">
                    <Select
                      value={selectedModel}
                      onValueChange={setSelectedModel}
                      disabled={isLoadingModels || sendMessageMutation.isPending}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingModels ? (
                          <div className="flex justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : models ? (
                          Object.entries(models).map(([id, model]: [string, any]) => (
                            <SelectItem key={id} value={id}>
                              <div className="flex items-center">
                                <span>{model.name}</span>
                                {model.hasVision && (
                                  <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">Vision</span>
                                )}
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="gpt-4o">No models available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Messages area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isLoadingMessages ? (
                    <div className="flex justify-center items-center h-20">
                      <Loader2 className="h-6 w-6 text-primary animate-spin" />
                    </div>
                  ) : messagesError ? (
                    <div className="text-center p-4 text-red-400">
                      Failed to load messages
                    </div>
                  ) : !currentChatId && !messages?.length ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                      <div className="mb-4 p-4 rounded-full bg-primary/10">
                        <BotIcon size={40} className="text-primary" />
                      </div>
                      <h3 className="text-xl font-medium text-white mb-2">Start a New Conversation</h3>
                      <p className="text-gray-400 max-w-md">
                        Select a model and start asking questions. You can also upload images for analysis with vision-capable models.
                      </p>
                    </div>
                  ) : (
                    messages?.map((message: AIMessage) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] p-4 rounded-lg ${
                            message.role === 'user' 
                              ? 'bg-primary/20 text-white rounded-tr-none' 
                              : 'bg-gray-800 text-gray-100 rounded-tl-none'
                          }`}
                        >
                          {message.imageUrl && (
                            <div className="mb-3">
                              <img 
                                src={message.imageUrl} 
                                alt="Uploaded" 
                                className="max-h-64 w-auto rounded-md"
                              />
                            </div>
                          )}
                          <div className="prose prose-invert max-w-none text-sm">
                            {message.content.split('\n').map((text, i) => (
                              <p key={i} className="mb-2">{text}</p>
                            ))}
                          </div>
                          <div className="mt-2 flex justify-between items-center text-xs text-gray-400">
                            <span>{formatDate(message.createdAt.toString())}</span>
                            <span>{getModelDisplayName(message.model)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {sendMessageMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-4 rounded-lg bg-gray-800 text-gray-100 rounded-tl-none">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Input area */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800 bg-gray-900">
                  <div className="flex items-start space-x-2">
                    <div className="flex-1">
                      <Textarea
                        placeholder="Type your message..."
                        className="min-h-[60px] bg-gray-800 border-gray-700 resize-none"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                      />
                      {imageUrl && (
                        <div className="mt-2">
                          <img 
                            src={imageUrl} 
                            alt="Uploaded" 
                            className="max-h-32 w-auto rounded-md"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2">
                      <ImageUploader
                        imageUrl={imageUrl}
                        setImageUrl={setImageUrl}
                        isUploading={isUploading}
                        setIsUploading={setIsUploading}
                      />
                      <Button 
                        type="submit" 
                        size="icon"
                        disabled={
                          sendMessageMutation.isPending || 
                          isUploading || 
                          (!inputMessage.trim() && !imageUrl)
                        }
                      >
                        {sendMessageMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Wrap AIChat with required providers
const AIChatsWithProviders = () => {
  return (
    <TooltipProvider>
      <AIChat />
    </TooltipProvider>
  );
};

export default AIChatsWithProviders;