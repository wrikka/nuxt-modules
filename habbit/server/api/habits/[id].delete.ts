import { useHabits } from '../../composables/useHabits'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Habit ID is required' })
  }

  const { deleteHabit } = useHabits()
  return await deleteHabit(id)
})
