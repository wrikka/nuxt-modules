import { integer, text } from "drizzle-orm/sqlite-core";

// =============================================================================
// Reusable Column Patterns
// =============================================================================

export const timestamps = {
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
};

export const softDelete = {
	isDeleted: integer("is_deleted", { mode: "boolean" }).notNull().default(false),
	deletedAt: integer("deleted_at", { mode: "timestamp" }),
};

export const userTracking = {
	createdBy: text("created_by"),
	lastModifiedBy: text("last_modified_by"),
};
