<script setup lang="ts">
import type { Habit } from '~/composables/useHabits'
import { useAppStore } from '~/stores/app'
import { useHabits } from '~/composables/useHabits'

const appStore = useAppStore()
const { addHabit } = useHabits()

const handleSubmit = (habit: Omit<Habit, 'id' | 'createdAt'>) => {
  addHabit(habit)
  appStore.setCurrentView('dashboard')
}

const handleCancel = () => {
  appStore.setCurrentView('dashboard')
}
</script>

<template>
  <div class="container mx-auto px-4 py-6 pb-24 md:pb-6">
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-text-primary mb-2">
        Add New Habit
      </h1>
      <p class="text-text-secondary">
        Create a new habit to track your progress
      </p>
    </div>

    <HabitForm @submit="handleSubmit" @cancel="handleCancel" />
  </div>
</template>
