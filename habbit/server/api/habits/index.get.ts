import { useHabits } from '../../composables/useHabits'
import type { Habit } from '../../../../shared/types/models'

export default defineEventHandler(async (event): Promise<Habit[]> => {
  const { getAllHabits } = useHabits()
  return await getAllHabits()
})
