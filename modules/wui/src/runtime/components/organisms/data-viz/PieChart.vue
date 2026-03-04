<script setup lang="ts">
interface DataPoint {
  label: string
  value: number
  color?: string
}

interface Props {
  data: DataPoint[]
  size?: number
  innerRadius?: number
  showLegend?: boolean
  showLabels?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 200,
  innerRadius: 0,
  showLegend: true,
  showLabels: false
})

const total = computed(() => props.data.reduce((sum, d) => sum + d.value, 0))

const slices = computed(() => {
  let currentAngle = 0
  const radius = props.size / 2
  const center = radius
  
  return props.data.map((item, index) => {
    const angle = (item.value / total.value) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180
    
    const x1 = center + radius * Math.cos(startRad)
    const y1 = center + radius * Math.sin(startRad)
    const x2 = center + radius * Math.cos(endRad)
    const y2 = center + radius * Math.sin(endRad)
    
    const largeArc = angle > 180 ? 1 : 0
    
    const path = props.innerRadius > 0
      ? createDonutSlice(center, center, radius, props.innerRadius, startAngle, endAngle)
      : `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
    
    const midAngle = startAngle + angle / 2
    const labelX = center + (radius * 0.7) * Math.cos((midAngle * Math.PI) / 180)
    const labelY = center + (radius * 0.7) * Math.sin((midAngle * Math.PI) / 180)
    
    currentAngle += angle
    
    return {
      ...item,
      path,
      percentage: Math.round((item.value / total.value) * 100),
      labelX,
      labelY
    }
  })
})

function createDonutSlice(cx: number, cy: number, r: number, ir: number, startAngle: number, endAngle: number) {
  const startRad = (startAngle * Math.PI) / 180
  const endRad = (endAngle * Math.PI) / 180
  
  const x1 = cx + r * Math.cos(startRad)
  const y1 = cy + r * Math.sin(startRad)
  const x2 = cx + r * Math.cos(endRad)
  const y2 = cy + r * Math.sin(endRad)
  
  const x3 = cx + ir * Math.cos(endRad)
  const y3 = cy + ir * Math.sin(endRad)
  const x4 = cx + ir * Math.cos(startRad)
  const y4 = cy + ir * Math.sin(startRad)
  
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${ir} ${ir} 0 ${largeArc} 0 ${x4} ${y4} Z`
}
</script>

<template>
  <div class="flex items-center gap-6">
    <svg :width="size" :height="size">
      <g
        v-for="(slice, i) in slices"
        :key="i"
      >
        <path
          :d="slice.path"
          :fill="slice.color || `hsl(${(i * 360) / data.length}, 70%, 60%)`"
          stroke="white"
          stroke-width="2"
        />
        <text
          v-if="showLabels && slice.percentage > 5"
          :x="slice.labelX"
          :y="slice.labelY"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="white"
          font-size="12"
          font-weight="bold"
        >
          {{ slice.percentage }}%
        </text>
      </g>
    </svg>
    
    <div v-if="showLegend" class="space-y-2">
      <div
        v-for="(slice, i) in slices"
        :key="`legend-${i}`"
        class="flex items-center gap-2"
      >
        <span
          class="h-3 w-3 rounded-full"
          :style="{ backgroundColor: slice.color || `hsl(${(i * 360) / data.length}, 70%, 60%)` }"
        />
        <span class="text-sm">{{ slice.label }}</span>
        <span class="text-sm text-gray-500">({{ slice.percentage }}%)</span>
      </div>
    </div>
  </div>
</template>
