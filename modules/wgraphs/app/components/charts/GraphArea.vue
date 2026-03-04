<script setup lang="ts">
interface DataPoint {
  x: number | string
  y: number
}

interface Props {
  data: DataPoint[]
  width?: number
  height?: number
  areaColor?: string
  lineColor?: string
  smooth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: 600,
  height: 400,
  areaColor: '#3b82f6',
  lineColor: '#2563eb',
  smooth: false
})

const maxY = computed(() => Math.max(...props.data.map(d => d.y)))
const minY = computed(() => Math.min(...props.data.map(d => d.y)))

const getX = (index: number): number => 40 + (index / (props.data.length - 1)) * (props.width - 80)
const getY = (value: number): number => props.height - 60 - ((value - minY.value) / (maxY.value - minY.value)) * (props.height - 100)

const areaPath = computed((): string => {
  if (props.data.length === 0) return ''
  let d = `M ${getX(0)} ${props.height - 60}`
  for (let i = 0; i < props.data.length; i++) {
    if (props.smooth && i > 0) {
      const prevX = getX(i - 1)
      const prevY = getY(props.data[i - 1].y)
      const currX = getX(i)
      const currY = getY(props.data[i].y)
      const cpX1 = prevX + (currX - prevX) / 2
      const cpX2 = prevX + (currX - prevX) / 2
      d += ` C ${cpX1} ${prevY}, ${cpX2} ${currY}, ${currX} ${currY}`
    } else {
      d += ` L ${getX(i)} ${getY(props.data[i].y)}`
    }
  }
  d += ` L ${getX(props.data.length - 1)} ${props.height - 60} Z`
  return d
})
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-area">
    <defs>
      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" :stop-color="areaColor" stop-opacity="0.6" />
        <stop offset="100%" :stop-color="areaColor" stop-opacity="0.1" />
      </linearGradient>
    </defs>
    <line x1="40" :y1="height - 60" :x2="width - 40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    <line x1="40" y1="20" x2="40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    <path :d="areaPath" fill="url(#areaGradient)" />
  </svg>
</template>
