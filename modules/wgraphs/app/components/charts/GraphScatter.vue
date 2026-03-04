<script setup lang="ts">
interface DataPoint {
  x: number
  y: number
  size?: number
  color?: string
}

interface Props {
  data: DataPoint[]
  width?: number
  height?: number
  defaultSize?: number
  defaultColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 600,
  height: 400,
  defaultSize: 8,
  defaultColor: '#3b82f6'
})

const maxX = computed(() => Math.max(...props.data.map(d => d.x)))
const minX = computed(() => Math.min(...props.data.map(d => d.x)))
const maxY = computed(() => Math.max(...props.data.map(d => d.y)))
const minY = computed(() => Math.min(...props.data.map(d => d.y)))

const getX = (value: number): number => 40 + ((value - minX.value) / (maxX.value - minX.value)) * (props.width - 80)
const getY = (value: number): number => props.height - 60 - ((value - minY.value) / (maxY.value - minY.value)) * (props.height - 100)
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-scatter">
    <line x1="40" :y1="height - 60" :x2="width - 40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    <line x1="40" y1="20" x2="40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    
    <circle
      v-for="(point, index) in data"
      :key="index"
      :cx="getX(point.x)"
      :cy="getY(point.y)"
      :r="point.size || defaultSize"
      :fill="point.color || defaultColor"
      opacity="0.7"
    />
  </svg>
</template>
