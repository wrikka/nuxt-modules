<script setup lang="ts">
interface StackedDataPoint {
  label: string
  values: number[]
  colors?: string[]
}

interface Props {
  data: StackedDataPoint[]
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 600,
  height: 400
})

const maxTotal = computed(() => Math.max(...props.data.map(d => d.values.reduce((a, b) => a + b, 0))))
const barWidth = computed(() => (props.width - 80) / props.data.length * 0.7)
const spacing = computed(() => (props.width - 80) / props.data.length)

const getBarX = (index: number): number => 40 + index * spacing.value + (spacing.value - barWidth.value) / 2
const getBarHeight = (value: number): number => (value / maxTotal.value) * (props.height - 100)

const stackedBars = computed(() => {
  return props.data.map((item, index) => {
    let y = props.height - 60
    const segments = item.values.map((value, segIndex) => {
      const height = getBarHeight(value)
      y -= height
      return {
        y,
        height,
        value,
        color: item.colors?.[segIndex] || `hsl(${segIndex * 360 / item.values.length}, 70%, 60%)`
      }
    })
    return { index, label: item.label, x: getBarX(index), segments }
  })
})
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-stacked-bar">
    <line x1="40" :y1="height - 60" :x2="width - 40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    <line x1="40" y1="20" x2="40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    
    <g v-for="bar in stackedBars" :key="bar.label">
      <g v-for="(segment, segIndex) in bar.segments" :key="segIndex">
        <rect
          :x="bar.x"
          :y="segment.y"
          :width="barWidth"
          :height="segment.height"
          :fill="segment.color"
          stroke="white"
          stroke-width="1"
        />
      </g>
      <text
        :x="bar.x + barWidth / 2"
        :y="height - 40"
        text-anchor="middle"
        class="text-xs fill-gray-600"
      >{{ bar.label }}</text>
    </g>
  </svg>
</template>
