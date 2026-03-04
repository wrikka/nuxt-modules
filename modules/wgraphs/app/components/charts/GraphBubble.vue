<script setup lang="ts">
interface DataPoint {
  x: number
  y: number
  z: number
  color?: string
}

interface Props {
  data: DataPoint[]
  width?: number
  height?: number
  maxBubbleSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 600,
  height: 400,
  maxBubbleSize: 30
})

const maxX = computed(() => Math.max(...props.data.map(d => d.x)))
const minX = computed(() => Math.min(...props.data.map(d => d.x)))
const maxY = computed(() => Math.max(...props.data.map(d => d.y)))
const minY = computed(() => Math.min(...props.data.map(d => d.y)))
const maxZ = computed(() => Math.max(...props.data.map(d => d.z)))

const getX = (value: number): number => 40 + ((value - minX.value) / (maxX.value - minX.value)) * (props.width - 80)
const getY = (value: number): number => props.height - 60 - ((value - minY.value) / (maxY.value - minY.value)) * (props.height - 100)
const getSize = (z: number): number => (z / maxZ.value) * props.maxBubbleSize
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-bubble">
    <line x1="40" :y1="height - 60" :x2="width - 40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    <line x1="40" y1="20" x2="40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    
    <circle
      v-for="(point, index) in data"
      :key="index"
      :cx="getX(point.x)"
      :cy="getY(point.y)"
      :r="getSize(point.z)"
      :fill="point.color || `hsl(${index * 360 / data.length}, 70%, 60%)`"
      opacity="0.6"
      stroke="white"
      stroke-width="2"
    />
  </svg>
</template>
