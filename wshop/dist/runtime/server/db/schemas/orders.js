import { relations } from "drizzle-orm";
import { decimal, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { orderStatusEnum, paymentStatusEnum } from "../enums.js";
import { customers } from "./customers.js";
import { discounts } from "./discounts.js";
import { giftCardTransactions } from "./gift_cards.js";
import { products, productVariants } from "./products/index.js";
import { orderItemTaxes, orderTaxes } from "./taxes.js";
export const orders = pgTable("orders", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  customerId: text("customer_id").references(() => customers.id),
  status: orderStatusEnum("status").notNull().default("pending"),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default("pending"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).notNull().default("0.00"),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).notNull().default("0.00"),
  shippingAddress: jsonb("shipping_address").$type(),
  billingAddress: jsonb("billing_address").$type(),
  paymentMethod: text("payment_method"),
  paymentIntentId: text("payment_intent_id").unique(),
  discountId: text("discount_id").references(() => discounts.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").references(() => products.id, {
    onUpdate: "no action",
    onDelete: "set null"
  }),
  variantId: text("variant_id").references(() => productVariants.id, {
    onUpdate: "no action",
    onDelete: "set null"
  }),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).notNull().default("0.00")
});
export const insertOrderSchema = createInsertSchema(orders);
export const ordersRelations = relations(orders, ({ one, many }) => ({
  giftCardTransactions: many(giftCardTransactions),
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id]
  }),
  items: many(orderItems),
  taxes: many(orderTaxes),
  discount: one(discounts, {
    fields: [orders.discountId],
    references: [discounts.id]
  })
}));
export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
  taxes: many(orderItemTaxes),
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id]
  })
}));
