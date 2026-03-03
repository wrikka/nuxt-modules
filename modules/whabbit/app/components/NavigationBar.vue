<script setup lang="ts">
const route = useRoute()

const views = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/' },
  { id: 'add-habit', label: 'Add Habit', icon: '➕', path: '/add-habit' },
  { id: 'statistics', label: 'Statistics', icon: '📈', path: '/statistics' }
]

const currentViewId = computed(() => {
  const currentPath = route.path
  if (currentPath === '/') return 'dashboard'
  if (currentPath === '/add-habit') return 'add-habit'
  if (currentPath === '/statistics') return 'statistics'
  return 'dashboard'
})

const handleNavigate = (path: string) => {
  navigateTo(path)
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-border md:top-0 md:bottom-auto md:border-t-0 md:border-b z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <div class="hidden md:flex items-center gap-2">
          <span class="text-2xl">🎯</span>
          <span class="font-bold text-xl text-text-primary">HabitKit</span>
        </div>

        <div class="flex items-center justify-around w-full md:w-auto md:gap-2">
          <button
            v-for="view in views"
            :key="view.id"
            @click="handleNavigate(view.path)"
            :class="[
              'flex flex-col md:flex-row items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200',
              currentViewId === view.id
                ? 'text-primary bg-primary/10'
                : 'text-text-secondary hover:bg-gray-100'
            ]"
          >
            <span class="text-xl">{{ view.icon }}</span>
            <span class="text-xs md:text-sm font-medium">{{ view.label }}</span>
          </button>
        </div>

        <div class="hidden md:block">
          <ThemeToggle />
        </div>
      </div>
    </div>
  </nav>
</template>
