<script setup lang="ts">
interface DataPoint {
  label: string
  value: number
  base?: number
  color?: string
}

interface Props {
  data: DataPoint[]
  width?: number
  height?: number
  positiveColor?: string
  negativeColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 400,
  positiveColor: '#22c55e',
  negativeColor: '#ef4444'
})

const maxValue = computed(() => Math.max(...props.data.map(d => (d.base || 0) + d.value)))
const minValue = computed(() => Math.min(...props.data.map(d => (d.base || 0) + d.value), 0))

const barWidth = computed(() => (props.width - 100) / props.data.length * 0.8)
const spacing = computed(() => (props.width - 100) / props.data.length)

const getBarX = (index: number): number => 50 + index * spacing.value + (spacing.value - barWidth.value) / 2

const zeroY = computed(() => {
  const range = maxValue.value - minValue.value
  return props.height - 60 - ((-minValue.value) / range) * (props.height - 100)
})

const getBarHeight = (value: number, base: number): number => {
  const range = maxValue.value - minValue.value
  return Math.abs(value / range) * (props.height - 100)
}

const getBarY = (value: number, base: number): number => {
  const total = base + value
  if (value >= 0) {
    return zeroY.value - getBarHeight(value, base)
  } else {
    return zeroY.value
  }
}
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-waterfall">
    <line x1="50" y1="40" x2="50" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    <line x1="50" :y1="zeroY" :x2="width - 50" :y2="zeroY" stroke="#374151" stroke-width="2" stroke-dasharray="5,5" />
    
    <g v-for="(item, index) in data" :key="item.label">
      <rect
        :x="getBarX(index)"
        :y="getBarY(item.value, item.base || 0)"
        :width="barWidth"
        :height="getBarHeight(item.value, item.base || 0) || 2"
        :fill="item.color || (item.value >= 0 ? positiveColor : negativeColor)"
        rx="2"
      />
      <text
        :x="getBarX(index) + barWidth / 2"
        :y="getBarY(item.value, item.base || 0) - 8"
        text-anchor="middle"
        class="text-xs fill-gray-700"
      >{{ item.value > 0 ? '+' : '' }}{{ item.value }}</text>
      <text
        :x="getBarX(index) + barWidth / 2"
        :y="height - 40"
        text-anchor="middle"
        class="text-xs fill-gray-600"
      >{{ item.label }}</text>
    </g>
  </svg>
</template>
