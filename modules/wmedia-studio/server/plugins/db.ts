import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import * as schema from "../db/schema";

export default defineNitroPlugin(async (nitroApp) => {
	const dbPath = "./data/media-studio.db";

	// Ensure data directory exists
	const dir = dirname(dbPath);
	await mkdir(dir, { recursive: true });

	// Initialize SQLite database
	const sqlite = new Database(dbPath);

	// Enable WAL mode for better concurrency
	sqlite.pragma("journal_mode = WAL");

	// Create drizzle database instance and attach to nitro context
	const db = drizzle(sqlite, { schema });

	// Store in nitroApp for global access
	(nitroApp as any).db = db;

	console.log("Database initialized successfully");
});

declare module "nitropack" {
	interface NitroApp {
		db: ReturnType<typeof drizzle<typeof schema>>;
	}
}
