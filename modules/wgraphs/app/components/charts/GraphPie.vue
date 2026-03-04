<script setup lang="ts">
interface DataPoint {
  label: string
  value: number
  color?: string
}

interface Props {
  data: DataPoint[]
  width?: number
  height?: number
  showLabels?: boolean
  showPercentages?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 400,
  showLabels: true,
  showPercentages: true
})

const total = computed(() => props.data.reduce((sum, item) => sum + item.value, 0))
const centerX = computed(() => props.width / 2)
const centerY = computed(() => props.height / 2)
const radius = computed(() => Math.min(props.width, props.height) / 2 - 40)

const slices = computed(() => {
  let currentAngle = 0
  return props.data.map(item => {
    const angle = (item.value / total.value) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle += angle
    return { ...item, startAngle, endAngle, percentage: Math.round((item.value / total.value) * 100) }
  })
})

const getSlicePath = (startAngle: number, endAngle: number): string => {
  const start = polarToCartesian(centerX.value, centerY.value, radius.value, endAngle)
  const end = polarToCartesian(centerX.value, centerY.value, radius.value, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  return `M ${centerX.value} ${centerY.value} L ${start.x} ${start.y} A ${radius.value} ${radius.value} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`
}

const polarToCartesian = (cx: number, cy: number, r: number, angle: number): { x: number, y: number } => {
  const angleInRadians = (angle - 90) * Math.PI / 180
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians)
  }
}

const getLabelPosition = (startAngle: number, endAngle: number): { x: number, y: number } => {
  const midAngle = startAngle + (endAngle - startAngle) / 2
  const labelRadius = radius.value * 0.7
  return polarToCartesian(centerX.value, centerY.value, labelRadius, midAngle)
}
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-pie">
    <g v-for="(slice, index) in slices" :key="slice.label">
      <path :d="getSlicePath(slice.startAngle, slice.endAngle)" :fill="slice.color || `hsl(${index * 360 / data.length}, 70%, 60%)`" stroke="white" stroke-width="2" />
      <text
        v-if="showLabels"
        :x="getLabelPosition(slice.startAngle, slice.endAngle).x"
        :y="getLabelPosition(slice.startAngle, slice.endAngle).y"
        text-anchor="middle"
        dominant-baseline="middle"
        class="text-xs fill-white font-medium"
      >
        {{ showPercentages ? `${slice.percentage}%` : slice.label }}
      </text>
    </g>
  </svg>
</template>
