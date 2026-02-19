import { relations } from "drizzle-orm";
import { decimal, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { reviewStatusEnum } from "../enums.js";
import { carts } from "./carts.js";
import { orders } from "./orders.js";
import { products } from "./products/index.js";
export const customers = pgTable("customers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: varchar("email").notNull().unique(),
  phone: varchar("phone"),
  avatar: text("avatar"),
  country: text("country"),
  spent: decimal("spent", { precision: 10, scale: 2 }).notNull().default("0.00"),
  orderCount: integer("order_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
export const productReviews = pgTable("product_reviews", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  customerId: text("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  // e.g., 1-5
  title: text("title"),
  content: text("content"),
  status: reviewStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
export const customerSegments = pgTable("customer_segments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
export const customersToCustomerSegments = pgTable("customers_to_customer_segments", {
  customerId: text("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  segmentId: text("segment_id").notNull().references(() => customerSegments.id, {
    onDelete: "cascade"
  })
});
export const customersRelations = relations(customers, ({ many }) => ({
  reviews: many(productReviews),
  orders: many(orders),
  cart: many(carts),
  customersToCustomerSegments: many(customersToCustomerSegments)
}));
export const customerSegmentsRelations = relations(customerSegments, ({ many }) => ({
  customersToCustomerSegments: many(customersToCustomerSegments),
  rules: many(customerSegmentRules)
}));
export const customerSegmentRules = pgTable("customer_segment_rules", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  segmentId: text("segment_id").notNull().references(() => customerSegments.id, {
    onDelete: "cascade"
  }),
  field: text("field").notNull(),
  // e.g., 'totalSpent', 'orderCount', 'createdAt'
  operator: text("operator").notNull(),
  // e.g., 'gt', 'lt', 'eq', 'between'
  value: text("value").notNull()
  // Can be a single value or a JSON string for ranges
});
export const customersToCustomerSegmentsRelations = relations(
  customersToCustomerSegments,
  ({ one }) => ({
    customer: one(customers, {
      fields: [customersToCustomerSegments.customerId],
      references: [customers.id]
    }),
    segment: one(customerSegments, {
      fields: [customersToCustomerSegments.segmentId],
      references: [customerSegments.id]
    })
  })
);
export const customerSegmentRulesRelations = relations(customerSegmentRules, ({ one }) => ({
  segment: one(customerSegments, {
    fields: [customerSegmentRules.segmentId],
    references: [customerSegments.id]
  })
}));
export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id]
  }),
  customer: one(customers, {
    fields: [productReviews.customerId],
    references: [customers.id]
  })
}));
