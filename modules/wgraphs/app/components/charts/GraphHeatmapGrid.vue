<script setup lang="ts">
interface Props {
  data: number[][]
  labels?: string[]
  width?: number
  height?: number
  minColor?: string
  maxColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 600,
  height: 400,
  minColor: '#eff6ff',
  maxColor: '#1e40af'
})

const maxValue = computed(() => Math.max(...props.data.flat()))
const minValue = computed(() => Math.min(...props.data.flat()))

const cellWidth = computed(() => (props.width - 80) / props.data[0].length)
const cellHeight = computed(() => (props.height - 80) / props.data.length)

const getColor = (value: number): string => {
  const ratio = (value - minValue.value) / (maxValue.value - minValue.value)
  const r1 = parseInt(props.minColor.slice(1, 3), 16)
  const g1 = parseInt(props.minColor.slice(3, 5), 16)
  const b1 = parseInt(props.minColor.slice(5, 7), 16)
  const r2 = parseInt(props.maxColor.slice(1, 3), 16)
  const g2 = parseInt(props.maxColor.slice(3, 5), 16)
  const b2 = parseInt(props.maxColor.slice(5, 7), 16)
  
  const r = Math.round(r1 + (r2 - r1) * ratio)
  const g = Math.round(g1 + (g2 - g1) * ratio)
  const b = Math.round(b1 + (b2 - b1) * ratio)
  
  return `rgb(${r}, ${g}, ${b})`
}
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-heatmap-grid">
    <g v-for="(row, rowIndex) in data" :key="rowIndex">
      <g v-for="(value, colIndex) in row" :key="`${rowIndex}-${colIndex}`">
        <rect
          :x="40 + colIndex * cellWidth"
          :y="40 + rowIndex * cellHeight"
          :width="cellWidth - 2"
          :height="cellHeight - 2"
          :fill="getColor(value)"
          rx="2"
        />
        <text
          v-if="cellWidth > 40 && cellHeight > 30"
          :x="40 + colIndex * cellWidth + cellWidth / 2"
          :y="40 + rowIndex * cellHeight + cellHeight / 2"
          text-anchor="middle"
          dominant-baseline="middle"
          class="text-xs fill-gray-700"
        >{{ value }}</text>
      </g>
    </g>
  </svg>
</template>
