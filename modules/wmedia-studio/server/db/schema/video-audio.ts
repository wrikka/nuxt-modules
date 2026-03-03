import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamps } from "./helpers";

// =============================================================================
// Specialized Projects - Video & Audio
// =============================================================================

export const videoProjects = sqliteTable("video_projects", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	// Video settings
	width: integer("width").notNull().default(1920),
	height: integer("height").notNull().default(1080),
	fps: integer("fps").notNull().default(30),
	duration: real("duration").notNull().default(0),
	// Content
	tracks: text("tracks", { mode: "json" }).notNull().default("[]"),
	clips: text("clips", { mode: "json" }).notNull().default("[]"),
	mediaAssets: text("media_assets", { mode: "json" }).$type<string[]>().notNull().default([]),
	captions: text("captions", { mode: "json" }).notNull().default("[]"),
	// Settings
	settingsBackgroundColor: text("settings_background_color").notNull().default("#000000"),
	settingsAudioVolume: integer("settings_audio_volume").notNull().default(100),
	...timestamps,
});

export const audioProjects = sqliteTable("audio_projects", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	// Content
	tracks: text("tracks", { mode: "json" }).notNull().default("[]"),
	markers: text("markers", { mode: "json" }).notNull().default("[]"),
	regions: text("regions", { mode: "json" }).notNull().default("[]"),
	// Audio settings
	masterVolume: real("master_volume").notNull().default(1),
	bpm: integer("bpm").notNull().default(120),
	timeSignatureNumerator: integer("time_signature_numerator").notNull().default(4),
	timeSignatureDenominator: integer("time_signature_denominator").notNull().default(4),
	snapToGrid: integer("snap_to_grid", { mode: "boolean" }).notNull().default(true),
	gridSize: integer("grid_size").notNull().default(16),
	...timestamps,
});
