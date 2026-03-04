<script setup lang="ts">
interface DataPoint {
  label: string
  value: number
}

interface Props {
  data: DataPoint[]
  width?: number
  height?: number
  maxValue?: number
  lineColor?: string
  fillColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 500,
  height: 500,
  maxValue: 100,
  lineColor: '#3b82f6',
  fillColor: 'rgba(59, 130, 246, 0.3)'
})

const centerX = computed(() => props.width / 2)
const centerY = computed(() => props.height / 2)
const radius = computed(() => Math.min(props.width, props.height) / 2 - 60)

const angleStep = computed(() => (2 * Math.PI) / props.data.length)

const getPoint = (index: number, value: number): { x: number, y: number } => {
  const angle = index * angleStep.value - Math.PI / 2
  const r = (value / props.maxValue) * radius.value
  return {
    x: centerX.value + r * Math.cos(angle),
    y: centerY.value + r * Math.sin(angle)
  }
}

const pathD = computed((): string => {
  if (props.data.length === 0) return ''
  const points = props.data.map((d, i) => getPoint(i, d.value))
  return `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') + ' Z'
})
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-radar">
    <g v-for="i in 5" :key="`grid-${i}`">
      <circle
        :cx="centerX"
        :cy="centerY"
        :r="radius * i / 5"
        fill="none"
        stroke="#e5e7eb"
        stroke-width="1"
      />
    </g>
    <g v-for="(item, index) in data" :key="`axis-${index}`">
      <line
        :x1="centerX"
        :y1="centerY"
        :x2="getPoint(index, maxValue).x"
        :y2="getPoint(index, maxValue).y"
        stroke="#e5e7eb"
        stroke-width="1"
      />
      <text
        :x="getPoint(index, maxValue * 1.15).x"
        :y="getPoint(index, maxValue * 1.15).y"
        text-anchor="middle"
        dominant-baseline="middle"
        class="text-sm fill-gray-700 font-medium"
      >{{ item.label }}</text>
    </g>
    <path :d="pathD" :fill="fillColor" :stroke="lineColor" stroke-width="3" />
    <g v-for="(item, index) in data" :key="`point-${index}`">
      <circle
        :cx="getPoint(index, item.value).x"
        :cy="getPoint(index, item.value).y"
        r="5"
        :fill="lineColor"
        stroke="white"
        stroke-width="2"
      />
    </g>
  </svg>
</template>
