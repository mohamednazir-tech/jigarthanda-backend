import { createTRPCRouter } from "./create-context";
import { authRouter } from "./routes/auth";
import { ordersRouter } from "./routes/orders";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  orders: ordersRouter,
});

export type AppRouter = typeof appRouter;
