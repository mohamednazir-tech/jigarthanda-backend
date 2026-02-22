import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const server = createHTTPServer({
  router: appRouter,
  createContext,
  onError: ({ error, path }: { error: any; path?: string }) => {
    console.error('TRPC Error:', error, 'at path:', path);
  },
});

server.listen(3000, () => {
  console.log('🚀 Backend server running on https://jigarthanda-backend.onrender.com');
});
