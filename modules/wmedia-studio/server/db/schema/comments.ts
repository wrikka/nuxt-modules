import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamps } from "./helpers";

// =============================================================================
// Collaboration - Comments
// =============================================================================

export const comments = sqliteTable("comments", {
	id: text("id").primaryKey(),
	projectId: text("project_id").notNull(),
	elementId: text("element_id"),
	// User info
	userId: text("user_id").notNull(),
	userName: text("user_name").notNull(),
	userAvatar: text("user_avatar"),
	// Content
	content: text("content").notNull(),
	x: real("x").notNull().default(0),
	y: real("y").notNull().default(0),
	resolved: integer("resolved", { mode: "boolean" }).notNull().default(false),
	...timestamps,
});

export const commentReplies = sqliteTable("comment_replies", {
	id: text("id").primaryKey(),
	commentId: text("comment_id").notNull(),
	// User info
	userId: text("user_id").notNull(),
	userName: text("user_name").notNull(),
	userAvatar: text("user_avatar"),
	content: text("content").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
