<script setup lang="ts">
interface Props {
  value: number
  min?: number
  max: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  size: 'md',
  showValue: true,
  animated: true
})

const sizeClasses = {
  sm: 'w-16 h-16 text-sm',
  md: 'w-24 h-24 text-base',
  lg: 'w-32 h-32 text-lg'
}

const strokeWidth = computed(() => {
  const widths = { sm: 6, md: 8, lg: 10 }
  return widths[props.size]
})

const percentage = computed(() => {
  const range = props.max - props.min
  const current = Math.max(0, Math.min(props.value - props.min, range))
  return (current / range) * 100
})

const circumference = computed(() => 2 * Math.PI * 45)
const dashoffset = computed(() => circumference.value - (percentage.value / 100) * circumference.value)
</script>

<template>
  <div class="flex items-center gap-2">
    <div :class="['relative flex items-center justify-center', sizeClasses[size]]">
      <svg class="-rotate-90" :width="size === 'sm' ? 64 : size === 'md' ? 96 : 128" :height="size === 'sm' ? 64 : size === 'md' ? 96 : 128">
        <circle
          cx="50%"
          cy="50%"
          r="45"
          fill="none"
          stroke="#e5e7eb"
          :stroke-width="strokeWidth"
        />
        <circle
          cx="50%"
          cy="50%"
          r="45"
          fill="none"
          stroke="#3b82f6"
          :stroke-width="strokeWidth"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashoffset"
          stroke-linecap="round"
          :class="{ 'transition-all duration-500': animated }"
        />
      </svg>
      <span v-if="showValue" class="absolute font-bold">{{ Math.round(percentage) }}%</span>
    </div>
  </div>
</template>
