import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const habits = sqliteTable('habits', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull(),
  icon: text('icon').notNull(),
  targetDays: integer('target_days').notNull(),
  createdAt: text('created_at').notNull()
})

export const habitEntries = sqliteTable('habit_entries', {
  id: text('id').primaryKey(),
  habitId: text('habit_id').notNull().references(() => habits.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  notes: text('notes')
})

// Note: Use shared types from ~/shared/types/models instead of inferred types
// This ensures type consistency across client and server
