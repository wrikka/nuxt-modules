<script setup lang="ts">
interface DataPoint {
  label: string
  value: number
  cumulative?: number
  color?: string
}

interface Props {
  data: DataPoint[]
  width?: number
  height?: number
  barColor?: string
  lineColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 400,
  barColor: '#3b82f6',
  lineColor: '#ef4444'
})

const sortedData = computed(() => [...props.data].sort((a, b) => b.value - a.value))
const total = computed(() => sortedData.value.reduce((sum, d) => sum + d.value, 0))

const processedData = computed(() => {
  let cumulative = 0
  return sortedData.value.map(d => {
    cumulative += d.value
    return { ...d, cumulative, percentage: (cumulative / total.value) * 100 }
  })
})

const maxValue = computed(() => Math.max(...sortedData.value.map(d => d.value)))

const barWidth = computed(() => (props.width - 100) / sortedData.value.length * 0.7)
const spacing = computed(() => (props.width - 100) / sortedData.value.length)

const getBarHeight = (value: number): number => (value / maxValue.value) * (props.height - 120)
const getBarX = (index: number): number => 50 + index * spacing.value + (spacing.value - barWidth.value) / 2
const getBarY = (value: number): number => props.height - 80 - getBarHeight(value)

const getLineY = (percentage: number): number => props.height - 80 - (percentage / 100) * (props.height - 120)

const linePath = computed((): string => {
  if (processedData.value.length === 0) return ''
  return `M ${processedData.value.map((d, i) => `${getBarX(i) + barWidth.value / 2} ${getLineY(d.percentage)}`).join(' L ')}`
})
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-pareto">
    <line x1="50" :y1="height - 80" :x2="width - 50" :y2="height - 80" stroke="#e5e7eb" stroke-width="2" />
    <line x1="50" y1="40" x2="50" :y2="height - 80" stroke="#e5e7eb" stroke-width="2" />
    
    <g v-for="(item, index) in processedData" :key="item.label">
      <rect
        :x="getBarX(index)"
        :y="getBarY(item.value)"
        :width="barWidth"
        :height="getBarHeight(item.value)"
        :fill="item.color || barColor"
        rx="4"
        opacity="0.8"
      />
      <text
        :x="getBarX(index) + barWidth / 2"
        :y="height - 60"
        text-anchor="middle"
        class="text-xs fill-gray-600"
        transform="rotate(-45, ${getBarX(index) + barWidth / 2}, ${height - 60})"
      >{{ item.label }}</text>
    </g>
    
    <path :d="linePath" fill="none" :stroke="lineColor" stroke-width="3" stroke-linecap="round" />
    
    <g v-for="(item, index) in processedData" :key="`point-${index}`">
      <circle
        :cx="getBarX(index) + barWidth / 2"
        :cy="getLineY(item.percentage)"
        r="5"
        :fill="lineColor"
        stroke="white"
        stroke-width="2"
      />
    </g>
  </svg>
</template>
