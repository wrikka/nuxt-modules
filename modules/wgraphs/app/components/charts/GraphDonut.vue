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
  innerRadius?: number
  showLabels?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 400,
  innerRadius: 0.5,
  showLabels: true
})

const total = computed(() => props.data.reduce((sum, item) => sum + item.value, 0))
const centerX = computed(() => props.width / 2)
const centerY = computed(() => props.height / 2)
const outerRadius = computed(() => Math.min(props.width, props.height) / 2 - 40)
const innerRadiusPx = computed(() => outerRadius.value * props.innerRadius)

const slices = computed(() => {
  let currentAngle = 0
  return props.data.map(item => {
    const angle = (item.value / total.value) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle += angle
    return { ...item, startAngle, endAngle }
  })
})

const getArcPath = (startAngle: number, endAngle: number, innerR: number, outerR: number): string => {
  const startOuter = polarToCartesian(centerX.value, centerY.value, outerR, endAngle)
  const endOuter = polarToCartesian(centerX.value, centerY.value, outerR, startAngle)
  const startInner = polarToCartesian(centerX.value, centerY.value, innerR, endAngle)
  const endInner = polarToCartesian(centerX.value, centerY.value, innerR, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  return `M ${startOuter.x} ${startOuter.y} A ${outerR} ${outerR} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y} L ${endInner.x} ${endInner.y} A ${innerR} ${innerR} 0 ${largeArcFlag} 1 ${startInner.x} ${startInner.y} Z`
}

const polarToCartesian = (cx: number, cy: number, r: number, angle: number): { x: number, y: number } => {
  const angleInRadians = (angle - 90) * Math.PI / 180
  return { x: cx + r * Math.cos(angleInRadians), y: cy + r * Math.sin(angleInRadians) }
}
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-donut">
    <g v-for="(slice, index) in slices" :key="slice.label">
      <path :d="getArcPath(slice.startAngle, slice.endAngle, innerRadiusPx, outerRadius)" :fill="slice.color || `hsl(${index * 360 / data.length}, 70%, 60%)`" stroke="white" stroke-width="2" />
    </g>
  </svg>
</template>
