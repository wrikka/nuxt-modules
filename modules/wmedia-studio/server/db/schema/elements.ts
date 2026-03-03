import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamps } from "./helpers";

// =============================================================================
// Design Elements
// =============================================================================

export const elements = sqliteTable("elements", {
	id: text("id").primaryKey(),
	projectId: text("project_id").notNull(),
	type: text("type").notNull(),
	// Position & dimensions
	x: real("x").notNull().default(0),
	y: real("y").notNull().default(0),
	width: real("width").notNull().default(100),
	height: real("height").notNull().default(100),
	rotation: real("rotation").notNull().default(0),
	// Visual properties
	opacity: real("opacity").notNull().default(1),
	locked: integer("locked", { mode: "boolean" }).notNull().default(false),
	visible: integer("visible", { mode: "boolean" }).notNull().default(true),
	zIndex: integer("z_index").notNull().default(0),
	// Element-specific data
	data: text("data", { mode: "json" }).notNull(),
	...timestamps,
});
