<script setup lang="ts">
interface Props {
  icon?: string
  label?: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  extended?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'i-lucide-plus',
  color: 'bg-blue-600',
  size: 'md',
  position: 'bottom-right',
  extended: false
})

const emit = defineEmits<{
  click: []
}>()

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-16 h-16'
}

const iconSizes = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-7'
}

const positionClasses = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6'
}
</script>

<template>
  <button
    type="button"
    class="fixed z-50 flex items-center justify-center rounded-full text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
    :class="[color, sizeClasses[size], positionClasses[position], extended ? 'px-4' : '']"
    @click="emit('click')"
  >
    <span :class="[icon, iconSizes[size]]" />
    <span v-if="extended && label" class="ml-2 font-medium">{{ label }}</span>
  </button>
</template>
