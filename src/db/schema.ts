import { 
  pgTable, uuid, text, timestamp, jsonb, numeric, index 
} from "drizzle-orm/pg-core";

/* USERS TABLE */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  district: text("district").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

/* ORDERS TABLE */
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),

  items: jsonb("items")
    .$type<{ name: string; quantity: number; price: number }[]>()
    .notNull(),

  total: numeric("total", { precision: 10, scale: 2 }).notNull(),

  customerName: text("customer_name").notNull(),
  
  paymentType: text("payment_type").notNull().default("cash"),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  userIdx: index("orders_user_id_idx").on(table.userId),
}));
