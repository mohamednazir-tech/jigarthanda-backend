import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { appRouter } from './trpc';
import { createContext } from './trpc/context';
import { trpcServer } from './trpc/server';

const app = appRouter;

const server = serve({
  fetch: app.fetch,
  port: 3000,
});

console.log('🚀 Backend server running on http://localhost:3000');
console.log('🔥 TRPC server ready');
