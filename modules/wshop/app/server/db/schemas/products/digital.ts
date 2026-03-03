import { integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core"
import { products, tags } from "./core"

export const productsToTags = pgTable("products_to_tags", {
	productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
	tagId: text("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
}, (t) => ({
	pk: primaryKey({ columns: [t.productId, t.tagId] }),
}))

// Digital Product Files Table
export const digitalProductFiles = pgTable("digital_product_files", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
	fileName: text("file_name").notNull(),
	fileUrl: text("file_url").notNull(), // This could be a path or a full URL
	fileSize: integer("file_size"), // in bytes
	createdAt: timestamp("created_at").defaultNow().notNull(),
})
