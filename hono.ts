import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const server = createHTTPServer({
  router: appRouter,
  createContext,
  onError: ({ error, path, type, req, ctx }) => {
    console.error('TRPC Error:', error);
  },
});

server.listen(3000, () => {
  console.log("Server running on https://jigarthanda-backend.onrender.com");
});
