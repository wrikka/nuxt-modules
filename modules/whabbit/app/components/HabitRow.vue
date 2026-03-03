<script setup lang="ts">
import { computed } from 'vue'
import type { Habit } from '~/shared/types/models'
import { useHabits } from '~/composables/useHabits'

interface Props {
  habit: Habit
  dates: string[]
}

const props = defineProps<Props>()

const { habitEntries, toggleHabitEntry, getHabitEntriesForDate, getHabitStreak } = useHabits()

const completedDays = computed(() => {
  return props.dates.filter(date => {
    const entry = getHabitEntriesForDate(props.habit.id, date)
    return entry?.completed || false
  }).length
})

const streak = computed(() => getHabitStreak(props.habit.id))

const completionRate = computed(() => {
  if (props.dates.length === 0) return 0
  return Math.round((completedDays.value / props.dates.length) * 100)
})
</script>

<template>
  <div class="flex items-center gap-4 py-3 border-b border-border last:border-0">
    <div class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg" :style="{ backgroundColor: habit.color }">
      {{ habit.icon }}
    </div>

    <div class="grow min-w-0">
      <h3 class="font-semibold text-text-primary truncate">{{ habit.name }}</h3>
      <div class="flex items-center gap-3 text-sm text-text-secondary">
        <span>🔥 {{ streak }} day streak</span>
        <span>✓ {{ completionRate }}%</span>
      </div>
    </div>

    <div class="flex gap-1 shrink-0">
      <HabitCell
        v-for="date in dates"
        :key="`${habit.id}-${date}`"
        :habit-id="habit.id"
        :date="date"
        :completed="getHabitEntriesForDate(habit.id, date)?.completed || false"
        :color="habit.color"
        @toggle="toggleHabitEntry"
      />
    </div>
  </div>
</template>
