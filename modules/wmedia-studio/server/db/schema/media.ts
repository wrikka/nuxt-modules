import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamps } from "./helpers";

// =============================================================================
// Media & Assets
// =============================================================================

export const mediaItems = sqliteTable("media_items", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	type: text("type").notNull(),
	url: text("url").notNull(),
	thumbnail: text("thumbnail"),
	// File info
	size: integer("size").notNull(),
	mimeType: text("mime_type").notNull(),
	// Media dimensions
	width: integer("width"),
	height: integer("height"),
	duration: real("duration"),
	// Organization
	tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default([]),
	folderId: text("folder_id"),
	// Metadata
	uploadedBy: text("uploaded_by").notNull(),
	metadata: text("metadata", { mode: "json" }),
	...timestamps,
});
