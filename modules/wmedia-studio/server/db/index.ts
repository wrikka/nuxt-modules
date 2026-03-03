import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

// Initialize SQLite database
const sqlite = new Database("./data/media-studio.db");

// Enable WAL mode for better concurrency
sqlite.pragma("journal_mode = WAL");

// Create drizzle database instance
export const db = drizzle(sqlite, { schema });

// Export schema for use in other files
export * from "./schema";
