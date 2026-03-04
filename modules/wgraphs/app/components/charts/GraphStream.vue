<script setup lang="ts">
interface DataPoint {
  timestamp: number
  value: number
  label?: string
}

interface Props {
  data: DataPoint[]
  width?: number
  height?: number
  maxPoints?: number
  lineColor?: string
  fillColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 300,
  maxPoints: 50,
  lineColor: '#3b82f6',
  fillColor: 'rgba(59, 130, 246, 0.3)'
})

const visibleData = computed(() => {
  return props.data.slice(-props.maxPoints)
})

const maxValue = computed(() => Math.max(...visibleData.value.map(d => d.value), 1))
const minValue = computed(() => Math.min(...visibleData.value.map(d => d.value), 0))

const getX = (index: number): number => 40 + (index / (visibleData.value.length - 1 || 1)) * (props.width - 80)
const getY = (value: number): number => props.height - 40 - ((value - minValue.value) / (maxValue.value - minValue.value || 1)) * (props.height - 60)

const pathD = computed((): string => {
  if (visibleData.value.length === 0) return ''
  let d = `M ${getX(0)} ${getY(visibleData.value[0].value)}`
  for (let i = 1; i < visibleData.value.length; i++) {
    d += ` L ${getX(i)} ${getY(visibleData.value[i].value)}`
  }
  d += ` L ${getX(visibleData.value.length - 1)} ${props.height - 40} L ${getX(0)} ${props.height - 40} Z`
  return d
})

const linePath = computed((): string => {
  if (visibleData.value.length === 0) return ''
  return `M ${getX(0)} ${getY(visibleData.value[0].value)}` + visibleData.value.slice(1).map((d, i) => ` L ${getX(i + 1)} ${getY(d.value)}`).join('')
})
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-stream">
    <defs>
      <linearGradient id="streamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" :stop-color="lineColor" stop-opacity="0.4" />
        <stop offset="100%" :stop-color="lineColor" stop-opacity="0.05" />
      </linearGradient>
    </defs>
    <line x1="40" :y1="height - 40" :x2="width - 40" :y2="height - 40" stroke="#e5e7eb" stroke-width="2" />
    <line x1="40" y1="20" x2="40" :y2="height - 40" stroke="#e5e7eb" stroke-width="2" />
    <path :d="pathD" fill="url(#streamGradient)" />
    <path :d="linePath" fill="none" :stroke="lineColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <g v-for="(point, index) in visibleData" :key="point.timestamp">
      <circle
        :cx="getX(index)"
        :cy="getY(point.value)"
        r="4"
        :fill="lineColor"
        stroke="white"
        stroke-width="2"
      />
    </g>
  </svg>
</template>
