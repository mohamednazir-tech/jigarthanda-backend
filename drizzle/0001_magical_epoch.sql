ALTER TABLE "orders" ALTER COLUMN "items" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "total" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payment_type" text DEFAULT 'cash' NOT NULL;--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("user_id");