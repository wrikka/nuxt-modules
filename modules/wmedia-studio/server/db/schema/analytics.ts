import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// =============================================================================
// Analytics & Activity
// =============================================================================

export const projectStats = sqliteTable("project_stats", {
	id: text("id").primaryKey(),
	projectId: text("project_id").notNull(),
	views: integer("views").notNull().default(0),
	edits: integer("edits").notNull().default(0),
	exports: integer("exports").notNull().default(0),
	lastModified: integer("last_modified", { mode: "timestamp" }),
});

export const mediaStats = sqliteTable("media_stats", {
	id: text("id").primaryKey(),
	mediaId: text("media_id").notNull(),
	views: integer("views").notNull().default(0),
	downloads: integer("downloads").notNull().default(0),
});

export const activityLog = sqliteTable("activity_log", {
	id: text("id").primaryKey(),
	// User info
	userId: text("user_id").notNull(),
	userName: text("user_name").notNull(),
	userAvatar: text("user_avatar"),
	// Action details
	action: text("action").notNull(),
	entityType: text("entity_type").notNull(),
	entityId: text("entity_id").notNull(),
	entityName: text("entity_name").notNull(),
	metadata: text("metadata", { mode: "json" }),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
