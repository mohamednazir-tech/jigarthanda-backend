import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { inferAsyncReturnType } from "@trpc/server";

export const createContext = async () => {
  return {
    user: null as { id: string; name: string } | null,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

/* 🔐 Protected Procedure */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Login required",
    });
  }

  return next({
    ctx: {
      user: ctx.user,
    },
  });
});