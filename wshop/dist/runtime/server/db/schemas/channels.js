import { relations } from "drizzle-orm";
import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { orders } from "./orders.js";
import { products } from "./products/index.js";
export const channels = pgTable("channels", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  type: text("type").notNull(),
  // 'facebook', 'instagram', 'tiktok', 'shopee', 'lazada'
  enabled: boolean("enabled").default(true),
  config: jsonb("config").$type(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
export const channelProducts = pgTable("channel_products", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  channelId: text("channel_id").references(() => channels.id).notNull(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  externalId: text("external_id"),
  status: text("status").notNull(),
  // 'synced' | 'pending' | 'error'
  lastSynced: timestamp("last_synced")
});
export const channelOrders = pgTable("channel_orders", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  channelId: text("channel_id").references(() => channels.id).notNull(),
  externalOrderId: text("external_order_id").notNull(),
  orderId: text("order_id").references(() => orders.id, { onDelete: "set null" }),
  status: text("status").notNull(),
  // 'pending' | 'synced' | 'error'
  syncedAt: timestamp("synced_at")
});
export const channelsRelations = relations(channels, ({ many }) => ({
  channelProducts: many(channelProducts),
  channelOrders: many(channelOrders)
}));
export const channelProductsRelations = relations(channelProducts, ({ one }) => ({
  channel: one(channels, {
    fields: [channelProducts.channelId],
    references: [channels.id]
  }),
  product: one(products, {
    fields: [channelProducts.productId],
    references: [products.id]
  })
}));
export const channelOrdersRelations = relations(channelOrders, ({ one }) => ({
  channel: one(channels, {
    fields: [channelOrders.channelId],
    references: [channels.id]
  }),
  order: one(orders, {
    fields: [channelOrders.orderId],
    references: [orders.id]
  })
}));
