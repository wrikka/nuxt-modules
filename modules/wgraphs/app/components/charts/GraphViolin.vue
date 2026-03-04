<script setup lang="ts">
interface Props {
  data: number[]
  width?: number
  height?: number
  smoothness?: number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 600,
  height: 400,
  smoothness: 10,
  color: '#8b5cf6'
})

const minValue = computed(() => Math.min(...props.data))
const maxValue = computed(() => Math.max(...props.data))
const bandwidth = computed(() => (maxValue.value - minValue.value) / props.smoothness)

const density = computed(() => {
  const points: { x: number, y: number }[] = []
  const step = (maxValue.value - minValue.value) / props.smoothness
  for (let i = 0; i <= props.smoothness; i++) {
    const x = minValue.value + i * step
    let y = 0
    props.data.forEach(point => {
      const diff = (x - point) / bandwidth.value
      y += Math.exp(-0.5 * diff * diff) / (bandwidth.value * Math.sqrt(2 * Math.PI))
    })
    y /= props.data.length
    points.push({ x, y })
  }
  return points
})

const maxY = computed(() => Math.max(...density.value.map(d => d.y)))

const getX = (value: number): number => 40 + ((value - minValue.value) / (maxValue.value - minValue.value)) * (props.width - 80)
const getY = (value: number): number => props.height - 60 - (value / maxY.value) * (props.height - 100)

const pathD = computed((): string => {
  if (density.value.length === 0) return ''
  let d = `M ${getX(density.value[0].x)} ${props.height - 60}`
  for (let i = 0; i < density.value.length; i++) {
    d += ` L ${getX(density.value[i].x)} ${getY(density.value[i].y)}`
  }
  d += ` L ${getX(density.value[density.value.length - 1].x)} ${props.height - 60} Z`
  return d
})
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-violin">
    <defs>
      <linearGradient id="violinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" :stop-color="color" stop-opacity="0.6" />
        <stop offset="100%" :stop-color="color" stop-opacity="0.2" />
      </linearGradient>
    </defs>
    <line x1="40" :y1="height - 60" :x2="width - 40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    <line x1="40" y1="20" x2="40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    <path :d="pathD" fill="url(#violinGradient)" />
  </svg>
</template>
