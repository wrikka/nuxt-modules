<script setup lang="ts">
interface DataPoint {
  x: number
  y: number
  value: number
}

interface Props {
  data: DataPoint[]
  width?: number
  height?: number
  hexRadius?: number
  minColor?: string
  maxColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 500,
  hexRadius: 20,
  minColor: '#eff6ff',
  maxColor: '#1e40af'
})

const maxValue = computed(() => Math.max(...props.data.map(d => d.value)))
const minValue = computed(() => Math.min(...props.data.map(d => d.value)))

const hexWidth = computed(() => props.hexRadius * Math.sqrt(3))
const hexHeight = computed(() => props.hexRadius * 2)

const getHexPath = (cx: number, cy: number): string => {
  const points: string[] = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i
    const x = cx + props.hexRadius * Math.cos(angle)
    const y = cy + props.hexRadius * Math.sin(angle)
    points.push(`${x},${y}`)
  }
  return `M ${points.join(' L ')} Z`
}

const getColor = (value: number): string => {
  const ratio = (value - minValue.value) / (maxValue.value - minValue.value)
  const r1 = parseInt(props.minColor.slice(1, 3), 16)
  const g1 = parseInt(props.minColor.slice(3, 5), 16)
  const b1 = parseInt(props.minColor.slice(5, 7), 16)
  const r2 = parseInt(props.maxColor.slice(1, 3), 16)
  const g2 = parseInt(props.maxColor.slice(3, 5), 16)
  const b2 = parseInt(props.maxColor.slice(5, 7), 16)
  
  const r = Math.round(r1 + (r2 - r1) * ratio)
  const g = Math.round(g1 + (g2 - g1) * ratio)
  const b = Math.round(b1 + (b2 - b1) * ratio)
  
  return `rgb(${r}, ${g}, ${b})`
}
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-hexbin">
    <g v-for="(point, index) in data" :key="index">
      <path
        :d="getHexPath(point.x, point.y)"
        :fill="getColor(point.value)"
        stroke="white"
        stroke-width="1"
        opacity="0.9"
      />
    </g>
  </svg>
</template>
