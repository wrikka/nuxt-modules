import { useHabits } from '../../composables/useHabits'
import type { Habit, NewHabit } from '../../../../shared/types/models'

export default defineEventHandler(async (event): Promise<Habit> => {
  const body = await readBody(event) as NewHabit
  const { createHabit } = useHabits()

  return await createHabit(body)
})
