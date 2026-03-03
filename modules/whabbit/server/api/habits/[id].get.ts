import { useHabits } from '../../composables/useHabits'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Habit ID is required' })
  }

  const { getHabitById } = useHabits()
  const habit = await getHabitById(id)

  if (!habit) {
    throw createError({ statusCode: 404, message: 'Habit not found' })
  }

  return habit
})

