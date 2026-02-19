import { useHabitEntries } from '../../../composables/useHabitEntries'
import type { HabitEntry } from '../../../../../shared/types/models'

export default defineEventHandler(async (event): Promise<HabitEntry[]> => {
  const habitId = getRouterParam(event, 'habitId')
  if (!habitId) {
    throw createError({ statusCode: 400, message: 'Habit ID is required' })
  }

  const { getHabitEntries } = useHabitEntries()
  const { date, startDate, endDate } = getQuery(event)

  return await getHabitEntries(habitId, {
    date: date as string,
    startDate: startDate as string,
    endDate: endDate as string,
  })
})

