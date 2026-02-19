import * as z from "zod";
import { eq, and, gte, lt } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../create-context";
import { db } from "../../src/db/client";
import { orders } from "../../src/db/schema";

export const ordersRouter = createTRPCRouter({
  // ---------------- LIST ORDERS ----------------
  list: publicProcedure.query(async () => {
    return [];
  }),

  // ---------------- CREATE ORDER ----------------
  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        items: z.array(
          z.object({
            name: z.string(),
            quantity: z.number(),
            price: z.number(),
          })
        ),
        total: z.number(),
        customerName: z.string(),
        paymentType: z.enum(['cash', 'upi']).default('cash'),
      })
    )
    .mutation(async ({ input }: { input: any }) => {
      const [newOrder] = await db
        .insert(orders)
        .values({
          userId: input.userId,
          items: input.items,
          total: input.total, // store as number
          customerName: input.customerName,
          paymentType: input.paymentType,
        })
        .returning();

      return { success: true, order: newOrder };
    }),

  // ---------------- UPDATE ORDER ----------------
  update: publicProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ input }) => {
      return { success: true };
    }),

  // ---------------- DELETE ORDER ----------------
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return { success: true };
    }),

  // ---------------- GET USER ORDERS ----------------
  getByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }: { input: any }) => {
      return await db.query.orders.findMany({
        where: eq(orders.userId, input.userId),
        orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      });
    }),

  // ---------------- TODAY ORDERS ----------------
  getTodayOrders: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }: { input: any }) => {
      // Get current date in local timezone (India)
      const now = new Date();
      const localOffset = now.getTimezoneOffset() * 60000; // Convert to milliseconds
      const localNow = new Date(now.getTime() - localOffset);
      
      // Set start of day (midnight) in local timezone
      const start = new Date(localNow);
      start.setHours(0, 0, 0, 0);
      
      // Set end of day (next day midnight) in local timezone
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      return await db.query.orders.findMany({
        where: and(
          eq(orders.userId, input.userId),
          gte(orders.createdAt, start),
          lt(orders.createdAt, end)
        ),
      });
    }),

  // ---------------- MONTHLY REPORT ----------------
  getMonthlyReport: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        month: z.number(), // 0-11
        year: z.number(),
      })
    )
    .query(async ({ input }: { input: any }) => {
      const start = new Date(input.year, input.month, 1);
      const end = new Date(input.year, input.month + 1, 1);

      const monthlyOrders = await db.query.orders.findMany({
        where: and(
          eq(orders.userId, input.userId),
          gte(orders.createdAt, start),
          lt(orders.createdAt, end)
        ),
      });

      const totalSales = monthlyOrders.reduce(
        (sum, o) => sum + parseFloat(o.total?.toString() || '0'),
        0
      );

      return {
        orders: monthlyOrders,
        totalSales,
        totalOrders: monthlyOrders.length,
        month: input.month,
        year: input.year,
      };
    }),
});
