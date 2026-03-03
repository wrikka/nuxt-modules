import { ref } from 'vue'
import type { Habit, HabitEntry } from '~/shared/types/models'

export const useHabits = () => {
  const habits = ref<Habit[]>([])
  const habitEntries = ref<HabitEntry[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchHabits = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<Habit[]>('/api/habits')
      habits.value = response
    } catch (e) {
      error.value = 'Failed to fetch habits'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const addHabit = async (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    try {
      const newHabit = await $fetch<Habit>('/api/habits', {
        method: 'POST',
        body: habit
      })
      habits.value.push(newHabit)
      return newHabit
    } catch (e) {
      error.value = 'Failed to add habit'
      console.error(e)
      throw e
    }
  }

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    try {
      const updated = await $fetch<Habit>(`/api/habits/${id}`, {
        method: 'PUT',
        body: updates
      })
      const index = habits.value.findIndex(h => h.id === id)
      if (index !== -1) {
        habits.value[index] = updated
      }
    } catch (e) {
      error.value = 'Failed to update habit'
      console.error(e)
      throw e
    }
  }

  const deleteHabit = async (id: string) => {
    try {
      await $fetch<void>(`/api/habits/${id}`, {
        method: 'DELETE' as any
      })
      habits.value = habits.value.filter(h => h.id !== id)
      habitEntries.value = habitEntries.value.filter(e => e.habitId !== id)
    } catch (e) {
      error.value = 'Failed to delete habit'
      console.error(e)
      throw e
    }
  }

  const getHabitById = (id: string) => {
    return habits.value.find(h => h.id === id)
  }

  const toggleHabitEntry = async (habitId: string, date: string) => {
    try {
      const entry = await $fetch<HabitEntry>(`/api/habits/${habitId}/entries`, {
        method: 'POST',
        body: { date }
      })
      
      const existingIndex = habitEntries.value.findIndex(
        e => e.habitId === habitId && e.date === date
      )

      if (existingIndex !== -1) {
        habitEntries.value[existingIndex] = entry
      } else {
        habitEntries.value.push(entry)
      }
    } catch (e) {
      error.value = 'Failed to toggle habit entry'
      console.error(e)
      throw e
    }
  }

  const getHabitEntriesForDate = (habitId: string, date: string) => {
    return habitEntries.value.find(e => e.habitId === habitId && e.date === date)
  }

  const getHabitEntriesForRange = async (habitId: string, startDate: string, endDate: string) => {
    try {
      const entries = await $fetch<HabitEntry[]>(`/api/habits/${habitId}/entries`, {
        query: { startDate, endDate }
      })
      return entries
    } catch (e) {
      error.value = 'Failed to fetch habit entries'
      console.error(e)
      return []
    }
  }

  const getHabitStreak = (habitId: string) => {
    const entries = habitEntries.value
      .filter(e => e.habitId === habitId && e.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    if (entries.length === 0) return 0

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const entry of entries) {
      const entryDate = new Date(entry.date)
      entryDate.setHours(0, 0, 0, 0)

      const diffDays = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === streak) {
        streak++
        currentDate = entryDate
      } else if (diffDays > streak) {
        break
      }
    }

    return streak
  }

  const getHabitCompletionRate = async (habitId: string, days: number = 30) => {
    const habit = getHabitById(habitId)
    if (!habit) return 0

    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const entries = await getHabitEntriesForRange(
      habitId,
      startDate.toISOString().split('T')[0] || '',
      endDate.toISOString().split('T')[0] || ''
    )

    const completedDays = entries.filter(e => e.completed).length
    return Math.round((completedDays / days) * 100)
  }

  return {
    habits,
    habitEntries,
    loading,
    error,
    fetchHabits,
    addHabit,
    updateHabit,
    deleteHabit,
    getHabitById,
    toggleHabitEntry,
    getHabitEntriesForDate,
    getHabitEntriesForRange,
    getHabitStreak,
    getHabitCompletionRate
  }
}
