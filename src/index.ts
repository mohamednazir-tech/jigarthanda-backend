import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// Add CORS middleware
app.use('/*', cors({
  origin: ['https://jigarthanda-backend.onrender.com', 'exp://*'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Simple health check
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    service: 'jigarthanda-backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Simple TRPC endpoint
app.post('/trpc/:path', (c) => {
  return c.json({
    result: {
      data: { message: 'TRPC endpoint working' }
    }
  });
});

const server = serve({
  fetch: app.fetch,
  port: 3000,
});

console.log('🚀 Backend server running on https://jigarthanda-backend.onrender.com');
console.log('🔥 Hono server ready');
