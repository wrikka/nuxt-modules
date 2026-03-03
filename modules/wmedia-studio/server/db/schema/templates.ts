import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamps } from "./helpers";

// =============================================================================
// Templates
// =============================================================================

export const templates = sqliteTable("templates", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	thumbnail: text("thumbnail").notNull(),
	category: text("category").notNull(),
	tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default([]),
	// Content
	elements: text("elements", { mode: "json" }).$type<string[]>().notNull().default([]),
	width: integer("width").notNull(),
	height: integer("height").notNull(),
	backgroundColor: text("background_color").notNull().default("#ffffff"),
	// Stats
	isPremium: integer("is_premium", { mode: "boolean" }).notNull().default(false),
	usageCount: integer("usage_count").notNull().default(0),
	rating: real("rating").notNull().default(0),
	createdBy: text("created_by"),
	...timestamps,
});
