<script setup lang="ts">
interface DataPoint {
  x: number | string
  y: number
}

interface Props {
  data: DataPoint[]
  width?: number
  height?: number
  lineColor?: string
  showPoints?: boolean
  smooth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: 600,
  height: 400,
  lineColor: '#3b82f6',
  showPoints: true,
  smooth: false
})

const maxY = computed(() => Math.max(...props.data.map(d => d.y)))
const minY = computed(() => Math.min(...props.data.map(d => d.y)))

const getX = (index: number): number => 40 + (index / (props.data.length - 1)) * (props.width - 80)
const getY = (value: number): number => props.height - 60 - ((value - minY.value) / (maxY.value - minY.value)) * (props.height - 100)

const pathD = computed((): string => {
  if (props.data.length === 0) return ''
  let d = `M ${getX(0)} ${getY(props.data[0].y)}`
  for (let i = 1; i < props.data.length; i++) {
    if (props.smooth) {
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
  return d
})
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-line">
    <line x1="40" :y1="height - 60" :x2="width - 40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    <line x1="40" y1="20" x2="40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    
    <path :d="pathD" fill="none" :stroke="lineColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    
    <g v-if="showPoints">
      <circle
        v-for="(point, index) in data"
        :key="index"
        :cx="getX(index)"
        :cy="getY(point.y)"
        r="5"
        :fill="lineColor"
        stroke="white"
        stroke-width="2"
      />
    </g>
  </svg>
</template>
