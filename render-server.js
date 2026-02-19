const http = require('http');
const { createHTTPServer } = require("@trpc/server/adapters/standalone");
const { appRouter } = require("./trpc/app-router");
const { createContext } = require("./trpc/create-context");

console.log('🚀 Starting Jigarthanda Backend for Render...');

// Configure for Render
const PORT = process.env.PORT || 3000;

const server = createHTTPServer({
  router: appRouter,
  createContext,
  onError: ({ error, path, type, req, ctx }) => {
    console.error('TRPC Error:', error);
  },
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('🎉 Backend server running on port:', PORT);
  console.log('🌐 Render deployment ready');
  console.log('📱 Mobile app can connect to:', process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`);
  console.log('🍹 Jigarthanda POS Backend Ready!');
});
