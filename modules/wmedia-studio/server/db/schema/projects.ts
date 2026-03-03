import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { softDelete, timestamps, userTracking } from "./helpers";

// =============================================================================
// Core Tables - Folders & Projects
// =============================================================================

export const folders = sqliteTable("folders", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	parentId: text("parent_id"),
	order: integer("order").notNull().default(0),
	...timestamps,
});

export const projects = sqliteTable("projects", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	thumbnail: text("thumbnail"),
	type: text("type").notNull().default("designer"),
	status: text("status").notNull().default("draft"),
	// Dimensions
	width: integer("width").notNull().default(1920),
	height: integer("height").notNull().default(1080),
	backgroundColor: text("background_color").notNull().default("#ffffff"),
	// Content
	elements: text("elements", { mode: "json" }).$type<string[]>().notNull().default([]),
	tracks: text("tracks", { mode: "json" }).notNull().default("[]"),
	timelineItems: text("timeline_items", { mode: "json" }).notNull().default("[]"),
	duration: integer("duration").notNull().default(0),
	version: integer("version").notNull().default(1),
	// Flags
	isTemplate: integer("is_template", { mode: "boolean" }).notNull().default(false),
	isFavorite: integer("is_favorite", { mode: "boolean" }).notNull().default(false),
	...softDelete,
	// Metadata
	folderId: text("folder_id"),
	size: integer("size").notNull().default(0),
	tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default([]),
	sharedWith: text("shared_with", { mode: "json" }).$type<{ userId: string; role: string }[]>().notNull().default([]),
	metadata: text("metadata", { mode: "json" }),
	...userTracking,
	...timestamps,
	// Editor Settings
	settingsSnapToGrid: integer("settings_snap_to_grid", { mode: "boolean" }).notNull().default(true),
	settingsGridSize: integer("settings_grid_size").notNull().default(10),
	settingsShowGuides: integer("settings_show_guides", { mode: "boolean" }).notNull().default(true),
	settingsShowRulers: integer("settings_show_rulers", { mode: "boolean" }).notNull().default(true),
	settingsAutoSave: integer("settings_auto_save", { mode: "boolean" }).notNull().default(true),
	settingsAutoSaveInterval: integer("settings_auto_save_interval").notNull().default(60),
});
