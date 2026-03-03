import { useDb, habitEntries } from '../db'
import { eq, and, gte, lte } from 'drizzle-orm'
import { generateHabitEntryId } from '../utils/id'
import type { HabitEntry, NewHabitEntry } from '../../shared/types/models'

export interface GetHabitEntriesOptions {
  date?: string
  startDate?: string
  endDate?: string
}

export function useHabitEntries() {
  const db = useDb()

  async function getHabitEntries(habitId: string, options: GetHabitEntriesOptions = {}): Promise<HabitEntry[]> {
    const { date, startDate, endDate } = options

    if (date) {
      const entry = await db.select().from(habitEntries)
        .where(and(eq(habitEntries.habitId, habitId), eq(habitEntries.date, date)))
        .limit(1)
      return entry as HabitEntry[]
    }

    if (startDate && endDate) {
      const entries = await db.select().from(habitEntries)
        .where(and(
          eq(habitEntries.habitId, habitId),
          gte(habitEntries.date, startDate),
          lte(habitEntries.date, endDate)
        ))
      return entries as HabitEntry[]
    }

    const allEntries = await db.select().from(habitEntries).where(eq(habitEntries.habitId, habitId))
    return allEntries as HabitEntry[]
  }

  async function toggleHabitEntry(habitId: string, date: string, notes?: string): Promise<HabitEntry> {
    const existingEntry = await db.select().from(habitEntries)
      .where(and(eq(habitEntries.habitId, habitId), eq(habitEntries.date, date)))
      .limit(1)

    if (existingEntry.length > 0 && existingEntry[0]) {
      const updatedEntry = await db.update(habitEntries)
        .set({ completed: !existingEntry[0].completed })
        .where(eq(habitEntries.id, existingEntry[0].id))
        .returning()
      return updatedEntry[0] as HabitEntry
    }

    const newEntry: NewHabitEntry = {
      id: generateHabitEntryId(),
      habitId,
      date,
      completed: true,
      notes,
    }

    const result = await db.insert(habitEntries).values(newEntry).returning()
    return result[0] as HabitEntry
  }

  return {
    getHabitEntries,
    toggleHabitEntry,
  }
}
