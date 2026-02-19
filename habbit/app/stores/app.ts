import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const currentView = ref<'dashboard' | 'add-habit' | 'statistics'>('dashboard')
  const selectedHabitId = ref<string | null>(null)

  const setCurrentView = (view: 'dashboard' | 'add-habit' | 'statistics') => {
    currentView.value = view
  }

  const setSelectedHabitId = (id: string | null) => {
    selectedHabitId.value = id
  }

  return {
    currentView,
    selectedHabitId,
    setCurrentView,
    setSelectedHabitId
  }
})
