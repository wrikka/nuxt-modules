<script setup lang="ts">
interface Metric {
  label: string
  value: number
  max: number
  color?: string
}

interface Props {
  value: number
  min?: number
  max: number
  size?: number
  strokeWidth?: number
  showValue?: boolean
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  size: 120,
  strokeWidth: 10,
  showValue: true
})

const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const progress = computed(() => {
  const range = props.max - props.min
  const current = Math.max(0, Math.min(props.value - props.min, range))
  return current / range
})
const dashoffset = computed(() => circumference.value * (1 - progress.value))

const color = computed(() => {
  if (progress.value < 0.3) return '#ef4444' // red
  if (progress.value < 0.6) return '#f59e0b' // yellow
  if (progress.value < 0.8) return '#3b82f6' // blue
  return '#10b981' // green
})
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <div class="relative" :style="{ width: `${size}px`, height: `${size}px` }">
      <svg :width="size" :height="size" class="-rotate-90">
        <circle
          :cx="size / 2"
          :cy="size / 2"
          :r="radius"
          fill="none"
          stroke="#e5e7eb"
          :stroke-width="strokeWidth"
        />
        <circle
          :cx="size / 2"
          :cy="size / 2"
          :r="radius"
          fill="none"
          :stroke="color"
          :stroke-width="strokeWidth"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashoffset"
          stroke-linecap="round"
          class="transition-all duration-500"
        />
      </svg>
      <div
        v-if="showValue"
        class="absolute inset-0 flex flex-col items-center justify-center"
      >
        <span class="text-2xl font-bold">{{ Math.round(progress * 100) }}%</span>
      </div>
    </div>
    <span v-if="label" class="text-sm text-gray-600">{{ label }}</span>
  </div>
</template>
