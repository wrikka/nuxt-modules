import { relations } from "drizzle-orm"
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const categories = pgTable("categories", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	description: text("description"),
	parentId: text("parent_id").references((): any => categories.id, { onDelete: "set null" }),
	image: text("image"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	parent: one(categories, {
		fields: [categories.parentId],
		references: [categories.id],
		relationName: "parent_category",
	}),
	children: many(categories, {
		relationName: "parent_category",
	}),
}))
