<script setup lang="ts">
interface DataPoint {
  label: string
  value: number
  color?: string
}

interface Props {
  data: DataPoint[]
  type?: 'line' | 'bar' | 'area'
  width?: number
  height?: number
  showGrid?: boolean
  showLegend?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'line',
  width: 400,
  height: 200,
  showGrid: true,
  showLegend: true
})

const maxValue = computed(() => Math.max(...props.data.map(d => d.value)))

const chartPath = computed(() => {
  if (!props.data.length) return ''
  
  const xStep = props.width / (props.data.length - 1)
  const yScale = props.height / maxValue.value
  
  let path = `M 0 ${props.height - props.data[0].value * yScale}`
  
  for (let i = 1; i < props.data.length; i++) {
    const x = i * xStep
    const y = props.height - props.data[i].value * yScale
    path += ` L ${x} ${y}`
  }
  
  return path
})

const areaPath = computed(() => {
  if (!props.data.length) return ''
  const xStep = props.width / (props.data.length - 1)
  return `${chartPath.value} L ${props.width} ${props.height} L 0 ${props.height} Z`
})
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white p-4">
    <svg :width="width" :height="height" class="overflow-visible">
      <g v-if="showGrid">
        <line
          v-for="i in 5"
          :key="`h-${i}`"
          :x1="0"
          :y1="(height / 5) * i"
          :x2="width"
          :y2="(height / 5) * i"
          stroke="#e5e7eb"
          stroke-width="1"
        />
      </g>
      
      <path
        v-if="type === 'area'"
        :d="areaPath"
        fill="rgba(59, 130, 246, 0.2)"
      />
      
      <path
        v-if="type === 'line' || type === 'area'"
        :d="chartPath"
        fill="none"
        stroke="#3b82f6"
        stroke-width="2"
      />
      
      <rect
        v-for="(point, i) in data"
        v-if="type === 'bar'"
        :key="`bar-${i}`"
        :x="(width / data.length) * i + 4"
        :y="height - (point.value / maxValue) * height"
        :width="(width / data.length) - 8"
        :height="(point.value / maxValue) * height"
        :fill="point.color || '#3b82f6'"
        rx="2"
      />
    </svg>
    
    <div v-if="showLegend" class="mt-4 flex flex-wrap gap-4">
      <div
        v-for="point in data"
        :key="point.label"
        class="flex items-center gap-2"
      >
        <span
          class="h-3 w-3 rounded-full"
          :style="{ backgroundColor: point.color || '#3b82f6' }"
        />
        <span class="text-sm text-gray-600">{{ point.label }}</span>
      </div>
    </div>
  </div>
</template>
