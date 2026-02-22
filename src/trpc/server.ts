import { trpcServer } from '@hono/trpc-server';
import { Context } from './context';

// Create a simple router for now
const router = {
  hello: {
    input: (input: string) => input,
    resolve: async ({ input }: { input: string }) => {
      return `Hello ${input}!`;
    },
  },
  _def: {
    hello: {
      input: (input: string) => input,
      resolve: async ({ input }: { input: string }) => {
        return `Hello ${input}!`;
      },
    },
  },
  _config: {},
  router: {},
  procedures: {},
  record: {},
  lazy: {},
  // Add your routes here
};

export const trpc = trpcServer({
  router,
  // Add any server configuration here
});
