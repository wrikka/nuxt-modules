import { decimal, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core"
import { productStatusEnum, productTypeEnum } from "../enums"

export const products = pgTable("products", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	description: text("description"),
	handle: varchar("handle").notNull().unique(),
	price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0.00"),
	status: productStatusEnum("status").notNull().default("draft"),
	type: productTypeEnum("type").notNull().default("physical"),
	taxCode: text("tax_code"), // For Stripe Tax
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const productImages = pgTable("product_images", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
	src: text("src").notNull(),
	alt: text("alt"),
})

export const tags = pgTable("tags", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: varchar("name").notNull().unique(),
})
