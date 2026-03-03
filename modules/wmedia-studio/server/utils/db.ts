import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../db/schema";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

/**
 * Get or create the database instance
 */
export function useDb() {
	if (!dbInstance) {
		const sqlite = new Database("./data/media-studio.db");
		sqlite.pragma("journal_mode = WAL");
		dbInstance = drizzle(sqlite, { schema });
	}
	return dbInstance;
}

/**
 * Reset the database instance (useful for testing)
 */
export function resetDb() {
	dbInstance = null;
}
