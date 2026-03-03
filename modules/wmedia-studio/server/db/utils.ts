import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

/**
 * Ensure the data directory exists for the database
 */
export async function ensureDataDirectory(dbPath: string): Promise<void> {
	const dir = dirname(dbPath);
	try {
		await mkdir(dir, { recursive: true });
	} catch (error) {
		// Directory might already exist
		if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
			throw error;
		}
	}
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
	return crypto.randomUUID();
}

/**
 * Get current timestamp
 */
export function now(): Date {
	return new Date();
}
