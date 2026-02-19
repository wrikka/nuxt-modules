import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'

const sqlite = new Database(process.env.DATABASE_URL || './data/habit.db')
export const db = drizzle(sqlite, { schema })

export function useDb() {
  return db
}

// Export schema tables for database operations
export { habits, habitEntries } from './schema'

// Note: Use shared types from ~/shared/types/models for type safety
// This ensures consistency between database schema and application types
