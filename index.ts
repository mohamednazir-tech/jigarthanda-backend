import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const server = createHTTPServer({
  router: appRouter,
  createContext,
  onError: ({ error }: { error: any }) => {
    console.error('TRPC Error:', error);
  },
});

server.listen(3000, () => {
  console.log('🚀 Backend server running on http://localhost:3000');
});
