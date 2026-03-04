<script setup lang="ts">
interface Action {
  id: string
  icon: string
  label: string
  color?: string
  action: () => void
}

interface Props {
  actions: Action[]
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  direction?: 'up' | 'down' | 'left' | 'right'
  mainIcon?: string
  mainColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  position: 'bottom-right',
  direction: 'up',
  mainIcon: 'i-lucide-plus',
  mainColor: 'bg-blue-600'
})

const isOpen = ref(false)
const hoveredAction = ref<string | null>(null)

const positionClasses = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6'
}

const getActionStyle = (index: number) => {
  const offset = (index + 1) * 60
  const styles: Record<string, { transform: string }> = {
    up: { transform: `translateY(-${offset}px)` },
    down: { transform: `translateY(${offset}px)` },
    left: { transform: `translateX(-${offset}px)` },
    right: { transform: `translateX(${offset}px)` }
  }
  return styles[props.direction]
}

const handleAction = (action: Action) => {
  action.action()
  isOpen.value = false
}
</script>

<template>
  <div class="fixed z-50" :class="positionClasses[position]">
    <div class="relative">
      <TransitionGroup name="speed-dial">
        <button
          v-for="(action, index) in actions"
          v-show="isOpen"
          :key="action.id"
          type="button"
          class="absolute flex items-center justify-center w-12 h-12 rounded-full text-white shadow-lg transition-all duration-200 hover:scale-110"
          :class="action.color || 'bg-gray-600'"
          :style="getActionStyle(index)"
          @mouseenter="hoveredAction = action.id"
          @mouseleave="hoveredAction = null"
          @click="handleAction(action)"
        >
          <span :class="action.icon" class="size-5" />
        </button>
      </TransitionGroup>
      
      <button
        type="button"
        class="relative flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg transition-transform duration-200 hover:scale-105"
        :class="mainColor"
        @click="isOpen = !isOpen"
      >
        <span
          class="size-6 transition-transform duration-200"
          :class="[mainIcon, { 'rotate-45': isOpen }]"
        />
      </button>
    </div>
    
    <div
      v-if="hoveredAction && isOpen"
      class="absolute whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-sm text-white"
      :class="direction === 'up' || direction === 'down' ? 'right-16 top-1/2 -translate-y-1/2' : 'bottom-16 left-1/2 -translate-x-1/2'"
    >
      {{ actions.find(a => a.id === hoveredAction)?.label }}
    </div>
  </div>
</template>

<style scoped>
.speed-dial-enter-active,
.speed-dial-leave-active {
  transition: all 0.2s ease;
}

.speed-dial-enter-from,
.speed-dial-leave-to {
  opacity: 0;
  transform: scale(0.5) !important;
}
</style>
