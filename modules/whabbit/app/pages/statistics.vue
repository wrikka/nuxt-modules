<script setup lang="ts">
import { computedAsync } from '@vueuse/core'
import type { Habit } from '~/shared/types/models'
import { useHabits } from '~/composables/useHabits'
import { getToday, getDaysAgo, getMonthName } from '~/server/utils/date'

const { habits, getHabitStreak, getHabitCompletionRate } = useHabits()

const stats = computedAsync(async () => {
  const today = getToday()
  const thirtyDaysAgo = getDaysAgo(30)

  return await Promise.all(habits.value.map(async (habit) => ({
    ...habit,
    streak: getHabitStreak(habit.id),
    completionRate: await getHabitCompletionRate(habit.id, 30)
  })))
}, [])

const totalHabits = computed(() => habits.value.length)

const averageCompletionRate = computed(() => {
  if (stats.value.length === 0) return 0
  const sum = stats.value.reduce((acc, stat) => acc + stat.completionRate, 0)
  return Math.round(sum / stats.value.length)
})

const longestStreak = computed(() => {
  if (stats.value.length === 0) return 0
  return Math.max(...stats.value.map(stat => stat.streak))
})

const currentMonth = computed(() => {
  const today = new Date()
  return getMonthName(today.toISOString())
})
</script>

<template>
  <div class="container mx-auto px-4 py-6 pb-24 md:pb-6">
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-text-primary mb-2">
        Statistics
      </h1>
      <p class="text-text-secondary">
        Track your progress and achievements
      </p>
    </div>

    <div v-if="habits.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">📊</div>
      <h3 class="text-xl font-semibold text-text-primary mb-2">No statistics yet</h3>
      <p class="text-text-secondary">Add some habits to start tracking your progress!</p>
    </div>

    <div v-else class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card text-center">
          <div class="text-4xl font-bold text-primary mb-2">{{ totalHabits }}</div>
          <div class="text-text-secondary">Total Habits</div>
        </div>
        <div class="card text-center">
          <div class="text-4xl font-bold text-success mb-2">{{ averageCompletionRate }}%</div>
          <div class="text-text-secondary">Avg. Completion</div>
        </div>
        <div class="card text-center">
          <div class="text-4xl font-bold text-warning mb-2">🔥 {{ longestStreak }}</div>
          <div class="text-text-secondary">Longest Streak</div>
        </div>
      </div>

      <div class="card">
        <h2 class="text-xl font-bold text-text-primary mb-4">Habit Performance</h2>
        <div class="space-y-4">
          <div
            v-for="stat in stats"
            :key="stat.id"
            class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
          >
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl"
              :style="{ backgroundColor: stat.color }"
            >
              {{ stat.icon }}
            </div>
            <div class="grow">
              <h3 class="font-semibold text-text-primary">{{ stat.name }}</h3>
              <div class="flex gap-4 text-sm text-text-secondary">
                <span>🔥 {{ stat.streak }} day streak</span>
                <span>✓ {{ stat.completionRate }}% completion</span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold" :style="{ color: stat.color }">
                {{ stat.completionRate }}%
              </div>
              <div class="text-xs text-text-secondary">30 days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
