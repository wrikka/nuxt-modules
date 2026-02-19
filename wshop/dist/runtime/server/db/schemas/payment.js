import { relations } from "drizzle-orm";
import { boolean, decimal, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { orders } from "./orders.js";
export const paymentMethods = pgTable("payment_methods", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  // 'cash', 'card', 'qr', 'transfer'
  icon: text("icon"),
  enabled: boolean("enabled").default(true),
  config: jsonb("config").$type()
});
export const paymentTransactions = pgTable("payment_transactions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: text("method").notNull(),
  status: text("status").notNull(),
  // 'pending', 'completed', 'failed', 'refunded'
  reference: text("reference"),
  // e.g., Stripe Payment Intent ID
  metadata: jsonb("metadata").$type(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
export const paymentTransactionsRelations = relations(paymentTransactions, ({ one }) => ({
  order: one(orders, {
    fields: [paymentTransactions.orderId],
    references: [orders.id]
  })
}));
