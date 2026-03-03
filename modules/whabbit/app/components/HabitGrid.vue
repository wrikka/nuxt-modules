<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Habit } from '~/shared/types/models'
import { useHabits } from '~/composables/useHabits'
import { getDateRange, getToday } from '~/server/utils/date'
import { useRouter } from 'vue-router'

const { habits, loading, error, fetchHabits } = useHabits()
const router = useRouter()

const daysToShow = ref(30)
const dates = computed(() => getDateRange(daysToShow.value))

const showAddHabitModal = ref(false)

onMounted(() => {
  fetchHabits()
})

const handleAddHabit = () => {
  router.push('/add-habit')
}

const handleRetry = () => {
  fetchHabits()
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-text-primary">Your Habits</h2>
      <button
        @click="handleAddHabit"
        class="btn btn-primary text-sm"
        :disabled="loading"
      >
        + Add Habit
      </button>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="text-4xl mb-4 animate-spin">⏳</div>
      <p class="text-text-secondary">Loading your habits...</p>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <div class="text-6xl mb-4">❌</div>
      <h3 class="text-xl font-semibold text-text-primary mb-2">Failed to load habits</h3>
      <p class="text-text-secondary mb-4">{{ error }}</p>
      <button
        @click="handleRetry"
        class="btn btn-primary"
      >
        Retry
      </button>
    </div>

    <div v-else-if="habits.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">🎯</div>
      <h3 class="text-xl font-semibold text-text-primary mb-2">No habits yet</h3>
      <p class="text-text-secondary mb-4">Start tracking your habits today!</p>
      <button
        @click="handleAddHabit"
        class="btn btn-primary"
      >
        Add Your First Habit
      </button>
    </div>

    <div v-else class="card">
      <div class="flex gap-1 mb-4 text-xs text-text-secondary">
        <div class="w-10 shrink-0"></div>
        <div class="grow"></div>
        <div class="flex gap-1">
          <div
            v-for="(date, index) in dates"
            :key="date"
            class="w-8 h-8 flex items-center justify-center"
            :class="{ 'font-bold text-primary': date === getToday() }"
          >
            {{ index % 5 === 0 ? new Date(date).getDate() : '' }}
          </div>
        </div>
      </div>

      <HabitRow
        v-for="habit in habits"
        :key="habit.id"
        :habit="habit"
        :dates="dates"
      />
    </div>
  </div>
</template>
