import { useDb, habits, habitEntries } from '../db'
import { eq } from 'drizzle-orm'
import { generateHabitId } from '../utils/id'
import type { Habit, NewHabit } from '../../shared/types/models'

export function useHabits() {
  const db = useDb()

  async function getAllHabits(): Promise<Habit[]> {
    return await db.select().from(habits) as Habit[]
  }

  async function getHabitById(id: string): Promise<Habit | null> {
    const habit = await db.select().from(habits).where(eq(habits.id, id)).limit(1)
    return (habit[0] as Habit) || null
  }

  async function createHabit(data: NewHabit): Promise<Habit> {
    const newHabit = {
      id: generateHabitId(),
      ...data,
      createdAt: new Date().toISOString(),
    }

    const result = await db.insert(habits).values(newHabit).returning()
    return result[0] as Habit
  }

  async function updateHabit(id: string, data: Partial<NewHabit>): Promise<Habit | null> {
    const updated = await db.update(habits)
      .set(data)
      .where(eq(habits.id, id))
      .returning()

    return (updated[0] as Habit) || null
  }

  async function deleteHabit(id: string): Promise<{ success: boolean }> {
    await db.delete(habitEntries).where(eq(habitEntries.habitId, id))
    await db.delete(habits).where(eq(habits.id, id))
    return { success: true }
  }

  return {
    getAllHabits,
    getHabitById,
    createHabit,
    updateHabit,
    deleteHabit,
  }
}
