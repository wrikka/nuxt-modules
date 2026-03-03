import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamps } from "./helpers";

// =============================================================================
// Brand Kits
// =============================================================================

export const brandKits = sqliteTable("brand_kits", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	templates: text("templates", { mode: "json" }).$type<string[]>().notNull().default([]),
	...timestamps,
});

export const brandColors = sqliteTable("brand_colors", {
	id: text("id").primaryKey(),
	brandKitId: text("brand_kit_id").notNull(),
	name: text("name").notNull(),
	hex: text("hex").notNull(),
	isPrimary: integer("is_primary", { mode: "boolean" }).notNull().default(false),
});

export const brandFonts = sqliteTable("brand_fonts", {
	id: text("id").primaryKey(),
	brandKitId: text("brand_kit_id").notNull(),
	name: text("name").notNull(),
	family: text("family").notNull(),
	weights: text("weights", { mode: "json" }).$type<number[]>().notNull().default([]),
	isPrimary: integer("is_primary", { mode: "boolean" }).notNull().default(false),
});

export const brandLogos = sqliteTable("brand_logos", {
	id: text("id").primaryKey(),
	brandKitId: text("brand_kit_id").notNull(),
	name: text("name").notNull(),
	url: text("url").notNull(),
	thumbnail: text("thumbnail"),
	isPrimary: integer("is_primary", { mode: "boolean" }).notNull().default(false),
});
