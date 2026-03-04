<script setup lang="ts">
interface FlowPoint {
  id: string
  name: string
  x: number
  y: number
}

interface FlowRoute {
  from: string
  to: string
  value: number
  color?: string
}

interface Props {
  points: FlowPoint[]
  routes: FlowRoute[]
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 500
})

const pointMap = computed(() => new Map(props.points.map(p => [p.id, p])))

const maxValue = computed(() => Math.max(...props.routes.map(r => r.value)))

const getFlowPath = (route: FlowRoute): string => {
  const from = pointMap.value.get(route.from)
  const to = pointMap.value.get(route.to)
  if (!from || !to) return ''
  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2 - 50
  return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`
}

const getStrokeWidth = (value: number): number => Math.max(2, (value / maxValue.value) * 8)
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-flow-map">
    <rect x="0" y="0" :width="width" :height="height" fill="#f9fafb" rx="8" />
    <g v-for="(route, index) in routes" :key="index">
      <path
        :d="getFlowPath(route)"
        fill="none"
        :stroke="route.color || '#3b82f6'"
        :stroke-width="getStrokeWidth(route.value)"
        opacity="0.6"
        stroke-linecap="round"
      />
      <circle
        :cx="(pointMap.get(route.from)?.x || 0 + pointMap.get(route.to)?.x || 0) / 2"
        :cy="(pointMap.get(route.from)?.y || 0 + pointMap.get(route.to)?.y || 0) / 2 - 25"
        r="4"
        :fill="route.color || '#3b82f6'"
      />
    </g>
    <g v-for="point in points" :key="point.id">
      <circle
        :cx="point.x"
        :cy="point.y"
        r="8"
        fill="#1f2937"
        stroke="white"
        stroke-width="2"
      />
      <text
        :x="point.x"
        :y="point.y + 20"
        text-anchor="middle"
        class="text-xs fill-gray-700 font-medium"
      >{{ point.name }}</text>
    </g>
  </svg>
</template>
