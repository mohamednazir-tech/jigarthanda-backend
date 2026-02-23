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
    _config: {
      $types: {} as any,
      transformer: {
        input: {} as any,
        output: {} as any,
      },
      errorFormatter: () => ({} as any),
      allowOutsideOfServer: false,
      isServer: false,
      isDev: false,
    },
    router: {} as any,
    procedures: {} as any,
    record: {} as any,
    lazy: {} as any,
  },
  _config: {
    $types: {} as any,
    transformer: {
      input: {} as any,
      output: {} as any,
    },
    errorFormatter: () => ({} as any),
    allowOutsideOfServer: false,
    isServer: false,
    isDev: false,
  },
  router: {} as any,
  procedures: {} as any,
  record: {} as any,
  lazy: {} as any,
  createCaller: () => ({} as any),
  // Add your routes here
};

export const trpc = trpcServer({
  router,
  // Add any server configuration here
});
