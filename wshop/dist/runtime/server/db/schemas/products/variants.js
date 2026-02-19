import { decimal, integer, jsonb, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { optionDisplayTypeEnum } from "../enums.js";
import { productImages, products } from "./core.js";
export const productOptions = pgTable("product_options", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  displayType: optionDisplayTypeEnum("display_type").notNull().default("text"),
  values: jsonb("values").$type().notNull()
});
export const productVariants = pgTable("product_variants", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  sku: varchar("sku").unique(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  options: jsonb("options").$type(),
  imageId: text("image_id").references(() => productImages.id, { onDelete: "set null" })
});
