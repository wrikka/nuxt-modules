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
  barColor?: string
  showValues?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: 600,
  height: 400,
  barColor: '#3b82f6',
  showValues: true
})

const maxValue = computed(() => Math.max(...props.data.map(d => d.value)))
const barWidth = computed(() => (props.width - 80) / props.data.length * 0.7)
const spacing = computed(() => (props.width - 80) / props.data.length * 0.3)

const getBarHeight = (value: number): number => (value / maxValue.value) * (props.height - 100)
const getBarX = (index: number): number => 40 + index * (barWidth.value + spacing.value)
const getBarY = (value: number): number => props.height - 60 - getBarHeight(value)
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-bar">
    <line x1="40" :y1="height - 60" :x2="width - 40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    <line x1="40" y1="20" x2="40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    
    <g v-for="(item, index) in data" :key="item.label">
      <rect
        :x="getBarX(index)"
        :y="getBarY(item.value)"
        :width="barWidth"
        :height="getBarHeight(item.value)"
        :fill="item.color || barColor"
        rx="4"
      />
      <text
        v-if="showValues"
        :x="getBarX(index) + barWidth / 2"
        :y="getBarY(item.value) - 8"
        text-anchor="middle"
        class="text-xs fill-gray-700"
      >{{ item.value }}</text>
      <text
        :x="getBarX(index) + barWidth / 2"
        :y="height - 40"
        text-anchor="middle"
        class="text-xs fill-gray-600"
      >{{ item.label }}</text>
    </g>
  </svg>
</template>
