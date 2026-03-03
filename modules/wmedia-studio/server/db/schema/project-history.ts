import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// =============================================================================
// Project Management - History, Exports, Shares
// =============================================================================

export const projectHistory = sqliteTable("project_history", {
	id: text("id").primaryKey(),
	projectId: text("project_id").notNull(),
	version: integer("version").notNull(),
	elements: text("elements", { mode: "json" }).$type<string[]>().notNull().default([]),
	snapshot: text("snapshot").notNull(),
	description: text("description"),
	createdBy: text("created_by"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const projectExports = sqliteTable("project_exports", {
	id: text("id").primaryKey(),
	projectId: text("project_id").notNull(),
	format: text("format").notNull(),
	status: text("status").notNull().default("pending"),
	url: text("url"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	completedAt: integer("completed_at", { mode: "timestamp" }),
});

export const projectShares = sqliteTable("project_shares", {
	id: text("id").primaryKey(),
	projectId: text("project_id").notNull(),
	userId: text("user_id").notNull(),
	role: text("role").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
