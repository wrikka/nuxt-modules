import { relations } from "drizzle-orm";
import { decimal, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { booleanEnum, giftCardTransactionTypeEnum } from "../enums.js";
import { orders } from "./orders.js";
export const giftCards = pgTable("gift_cards", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: varchar("code").notNull().unique(),
  initialBalance: decimal("initial_balance", { precision: 10, scale: 2 }).notNull(),
  currentBalance: decimal("current_balance", { precision: 10, scale: 2 }).notNull(),
  isActive: booleanEnum("is_active").notNull().default("true"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
export const giftCardTransactions = pgTable("gift_card_transactions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  giftCardId: text("gift_card_id").notNull().references(() => giftCards.id, {
    onDelete: "cascade"
  }),
  orderId: text("order_id").references(() => orders.id, { onDelete: "set null" }),
  type: giftCardTransactionTypeEnum("type").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
export const giftCardsRelations = relations(giftCards, ({ many }) => ({
  transactions: many(giftCardTransactions)
}));
export const giftCardTransactionsRelations = relations(giftCardTransactions, ({ one }) => ({
  giftCard: one(giftCards, {
    fields: [giftCardTransactions.giftCardId],
    references: [giftCards.id]
  }),
  order: one(orders, {
    fields: [giftCardTransactions.orderId],
    references: [orders.id]
  })
}));
