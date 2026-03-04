<script setup lang="ts">
interface MapPoint {
  id: string
  name: string
  x: number
  y: number
  value: number
  color?: string
}

interface Props {
  points: MapPoint[]
  width?: number
  height?: number
  maxRadius?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 500,
  maxRadius: 30
})

const maxValue = computed(() => Math.max(...props.points.map(p => p.value)))

const getRadius = (value: number): number => (value / maxValue.value) * props.maxRadius
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-bubble-map">
    <rect x="0" y="0" :width="width" :height="height" fill="#f3f4f6" rx="8" />
    <g v-for="point in points" :key="point.id">
      <circle
        :cx="point.x"
        :cy="point.y"
        :r="getRadius(point.value)"
        :fill="point.color || '#3b82f6'"
        opacity="0.6"
        stroke="white"
        stroke-width="2"
      />
      <text
        :x="point.x"
        :y="point.y - getRadius(point.value) - 8"
        text-anchor="middle"
        class="text-xs fill-gray-700 font-medium"
      >{{ point.name }}</text>
    </g>
  </svg>
</template>
