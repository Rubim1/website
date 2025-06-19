# Class 7A Website

## Overview

This is a dynamic class website featuring an immersive experience with game-inspired visual effects and interactive design elements. The application serves as a comprehensive platform for class information, schedule management, gallery sharing, and real-time communication.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **State Management**: React Context API for global state
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth UI transitions
- **3D Graphics**: Three.js for interactive visual effects

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Real-time Communication**: WebSocket support for live chat
- **Authentication**: Firebase Auth for user management
- **API Design**: RESTful endpoints with TypeScript validation

### Data Storage Solutions
- **Primary Database**: PostgreSQL (Neon serverless) for structured data
- **Real-time Database**: Firebase Realtime Database for chat messages
- **ORM**: Drizzle ORM with schema-first approach
- **Session Management**: PostgreSQL-backed sessions

## Key Components

### Frontend Components
1. **Hero Section**: Interactive landing area with 3D background effects
2. **Navigation**: Smooth-scrolling navbar with animated indicators
3. **Gallery**: Media showcase with modal viewing capabilities
4. **Chat System**: Real-time messaging with typing indicators
5. **Calendar**: Event management with Indonesian holidays
6. **Schedule**: Weekly student rotation display
7. **Music Player**: Integrated audio player with multiple source support

### Backend Services
1. **API Routes**: Express.js routes for data operations
2. **WebSocket Server**: Real-time communication handling
3. **Database Models**: User, chat messages, AI chat systems
4. **AI Integration**: DeepSeek and Gemini API support
5. **File Storage**: Asset management and serving

### Database Schema
- **Users**: Authentication and profile data
- **Chat Messages**: Real-time messaging with metadata
- **AI Chats**: Conversation threads with AI models
- **AI Messages**: Individual messages in AI conversations

## Data Flow

1. **Client Requests**: React components make API calls through query client
2. **API Processing**: Express server handles requests with validation
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **Real-time Updates**: Firebase handles live chat synchronization
5. **Response Delivery**: JSON responses with proper error handling

## External Dependencies

### Core Technologies
- React ecosystem (React Query, Router, Context)
- UI libraries (Radix UI, Tailwind CSS, Framer Motion)
- Database stack (PostgreSQL, Drizzle ORM, Neon)
- Build tools (Vite, TypeScript, ESBuild)

### Third-party Integrations
- **Firebase**: Authentication and real-time database
- **AI Services**: DeepSeek and Gemini API integration
- **Three.js**: 3D graphics and visual effects
- **Font Awesome**: Icon library for UI elements

### Development Tools
- TypeScript for type safety
- ESLint and Prettier for code quality
- PostCSS for CSS processing
- Various Vite plugins for enhanced development

## Deployment Strategy

### Multi-platform Support
The application supports multiple deployment targets:

1. **GitHub Pages**: Static site deployment with SPA routing
2. **Cloudflare Pages**: Edge-optimized deployment
3. **Replit**: Development and hosting environment
4. **Local Development**: Full-stack development setup

### Build Configurations
- **Development**: Hot reload with full backend services
- **Production**: Optimized bundles with static asset generation
- **GitHub Pages**: Base path configuration for subdirectory hosting
- **Cloudflare**: Edge-optimized build with redirects

### Environment Management
- Environment-specific configurations
- API key management through environment variables
- Database connection handling across platforms
- Firebase configuration for different environments

## Changelog

- June 19, 2025. Initial setup
- June 19, 2025. Transformed UI to liquid glass design with glassmorphism effects
- June 19, 2025. Optimized navigation - removed animated hover effects and moving box for instant response
- June 19, 2025. Implemented animated menu selection highlighter with liquid glass design and spring animations

## User Preferences

Preferred communication style: Simple, everyday language.