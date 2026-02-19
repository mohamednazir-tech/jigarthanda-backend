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
  console.log('🎉 Backend server running on http://0.0.0.0:3000');
  console.log('📱 Mobile app can connect to: http://10.171.132.69:3000');
  console.log('🍹 Jigarthanda POS Backend Ready!');
});
