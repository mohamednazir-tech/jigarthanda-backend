const http = require('http');
const { createHTTPServer } = require("@trpc/server/adapters/standalone");
const { appRouter } = require("./trpc/app-router");
const { createContext } = require("./trpc/create-context");

console.log('🚀 Starting Jigarthanda Backend Server...');

const server = createHTTPServer({
  router: appRouter,
  createContext,
  onError: ({ error, path, type, req, ctx }) => {
    console.error('TRPC Error:', error);
  },
});

server.listen(3000, '0.0.0.0', () => {
  console.log('🎉 Backend server running on https://jigarthanda-backend.onrender.com');
  console.log('📱 Mobile app can connect to: https://jigarthanda-backend.onrender.com/trpc');
  console.log('🍹 Jigarthanda POS Backend Ready!');
});
