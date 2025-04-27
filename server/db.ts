import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '@shared/schema';
import { log } from './vite';

// Required for Neon Serverless with WebSockets
neonConfig.webSocketConstructor = ws;

// Check if we have a database URL
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create a connection pool
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create a Drizzle client
export const db = drizzle(pool, { schema });

// Log successful database connection
log('Database client initialized', 'database');