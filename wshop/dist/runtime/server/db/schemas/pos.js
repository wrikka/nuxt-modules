import { relations } from "drizzle-orm";
import { decimal, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { posSessionStatusEnum } from "../enums.js";
import { products, productVariants } from "./products/index.js";
import { staffAccounts } from "./staff.js";
export const posSessions = pgTable("pos_sessions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  staffId: text("staff_id").notNull().references(() => staffAccounts.id, { onDelete: "restrict" }),
  status: posSessionStatusEnum("status").notNull().default("active"),
  openingAmount: decimal("opening_amount", { precision: 10, scale: 2 }).notNull(),
  closingAmount: decimal("closing_amount", { precision: 10, scale: 2 }),
  cashSales: decimal("cash_sales", { precision: 10, scale: 2 }).default("0.00"),
  cardSales: decimal("card_sales", { precision: 10, scale: 2 }).default("0.00"),
  openedAt: timestamp("opened_at").defaultNow().notNull(),
  closedAt: timestamp("closed_at")
});
export const posSessionItems = pgTable("pos_session_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionId: text("session_id").notNull().references(() => posSessions.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "set null" }),
  variantId: text("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  // Price at the time of sale
  soldAt: timestamp("sold_at").defaultNow().notNull()
});
export const posSessionsRelations = relations(posSessions, ({ one, many }) => ({
  staff: one(staffAccounts, {
    fields: [posSessions.staffId],
    references: [staffAccounts.id]
  }),
  items: many(posSessionItems)
}));
export const posSessionItemsRelations = relations(posSessionItems, ({ one }) => ({
  session: one(posSessions, {
    fields: [posSessionItems.sessionId],
    references: [posSessions.id]
  }),
  product: one(products, {
    fields: [posSessionItems.productId],
    references: [products.id]
  }),
  variant: one(productVariants, {
    fields: [posSessionItems.variantId],
    references: [productVariants.id]
  })
}));
