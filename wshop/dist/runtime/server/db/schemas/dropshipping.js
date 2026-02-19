import { relations } from "drizzle-orm";
import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { products } from "./products/index.js";
export const suppliers = pgTable("suppliers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  type: text("type").notNull(),
  // 'dropshipping' | 'print_on_demand'
  enabled: boolean("enabled").default(true),
  config: jsonb("config").$type(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
export const supplierProducts = pgTable("supplier_products", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  supplierId: text("supplier_id").references(() => suppliers.id).notNull(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  externalId: text("external_id"),
  price: text("price"),
  stock: text("stock"),
  status: text("status").notNull(),
  // 'active' | 'inactive' | 'out_of_stock'
  lastSynced: timestamp("last_synced")
});
export const suppliersRelations = relations(suppliers, ({ many }) => ({
  supplierProducts: many(supplierProducts)
}));
export const supplierProductsRelations = relations(supplierProducts, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [supplierProducts.supplierId],
    references: [suppliers.id]
  }),
  product: one(products, {
    fields: [supplierProducts.productId],
    references: [products.id]
  })
}));
