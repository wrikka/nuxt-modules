import { relations } from "drizzle-orm";
import { decimal, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { discountTypeEnum } from "../enums.js";
import { orders } from "./orders.js";
export const discounts = pgTable("discounts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: varchar("code").notNull().unique(),
  description: text("description"),
  type: discountTypeEnum("type").notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  minPurchaseAmount: decimal("min_purchase_amount", { precision: 10, scale: 2 }),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").notNull().default(0),
  isActive: text("is_active").notNull().default("true"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
export const discountsRelations = relations(discounts, ({ many }) => ({
  orders: many(orders)
}));
export const insertDiscountSchema = createInsertSchema(discounts);
export const selectDiscountSchema = createSelectSchema(discounts);
