<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import { useHabits } from '~/composables/useHabits'

const appStore = useAppStore()
const { habits, addHabit } = useHabits()
</script>

<template>
  <div class="container mx-auto px-4 py-6 pb-24 md:pb-6">
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-text-primary mb-2">
        Dashboard
      </h1>
      <p class="text-text-secondary">
        Track your daily habits and build consistency
      </p>
    </div>

    <HabitGrid />
  </div>
</template>
