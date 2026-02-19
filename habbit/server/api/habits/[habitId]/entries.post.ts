import { useHabitEntries } from '../../../composables/useHabitEntries'
import type { HabitEntry } from '../../../../../shared/types/models'

export default defineEventHandler(async (event): Promise<HabitEntry> => {
  const habitId = getRouterParam(event, 'habitId')
  if (!habitId) {
    throw createError({ statusCode: 400, message: 'Habit ID is required' })
  }

  const body = await readBody(event)
  const { toggleHabitEntry } = useHabitEntries()

  return await toggleHabitEntry(habitId, body.date, body.notes)
})
