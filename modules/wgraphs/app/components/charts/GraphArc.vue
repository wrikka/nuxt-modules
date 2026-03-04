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
  sortByValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 400,
  sortByValue: true
})

const sortedData = computed(() => {
  if (!props.sortByValue) return props.data
  return [...props.data].sort((a, b) => b.value - a.value)
})

const maxValue = computed(() => Math.max(...sortedData.value.map(d => d.value)))
const nodeRadius = computed(() => Math.min((props.width - 80) / sortedData.value.length / 2, 20))

const getX = (index: number): number => 40 + index * ((props.width - 80) / sortedData.value.length) + nodeRadius.value
const getY = (value: number): number => props.height / 2 - (value / maxValue.value) * (props.height / 2 - 60)
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-arc">
    <line x1="40" :y1="height / 2" :x2="width - 40" :y2="height / 2" stroke="#e5e7eb" stroke-width="2" />
    <g v-for="(item, index) in sortedData" :key="item.label">
      <path
        :d="`M ${getX(index)} ${height / 2} Q ${getX(index)} ${getY(item.value)} ${getX(index) + nodeRadius * 2} ${height / 2}`"
        fill="none"
        :stroke="item.color || `hsl(${index * 360 / sortedData.length}, 70%, 60%)`"
        stroke-width="3"
        opacity="0.7"
      />
      <circle
        :cx="getX(index) + nodeRadius"
        :cy="height / 2"
        :r="nodeRadius"
        :fill="item.color || `hsl(${index * 360 / sortedData.length}, 70%, 60%)`"
        stroke="white"
        stroke-width="2"
      />
      <text
        :x="getX(index) + nodeRadius"
        :y="height / 2 + 30"
        text-anchor="middle"
        class="text-xs fill-gray-600"
      >{{ item.label }}</text>
    </g>
  </svg>
</template>
