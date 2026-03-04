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
}

const props = withDefaults(defineProps<Props>(), {
  width: 600,
  height: 400
})

const sortedData = computed(() => [...props.data].sort((a, b) => b.value - a.value))
const maxValue = computed(() => Math.max(...sortedData.value.map(d => d.value)))

const getBarWidth = (value: number): number => (value / maxValue.value) * (props.width - 200)
const barHeight = computed(() => Math.min((props.height - 80) / sortedData.value.length, 40))
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-funnel">
    <defs>
      <linearGradient id="funnelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#3b82f6" />
        <stop offset="100%" stop-color="#1e40af" />
      </linearGradient>
    </defs>
    <g v-for="(item, index) in sortedData" :key="item.label">
      <rect
        :x="(width - getBarWidth(item.value)) / 2"
        :y="40 + index * (barHeight + 10)"
        :width="getBarWidth(item.value)"
        :height="barHeight"
        :fill="item.color || 'url(#funnelGradient)'"
        rx="4"
        opacity="0.9"
      />
      <text
        :x="(width - getBarWidth(item.value)) / 2 - 10"
        :y="40 + index * (barHeight + 10) + barHeight / 2"
        text-anchor="end"
        dominant-baseline="middle"
        class="text-sm fill-gray-700 font-medium"
      >{{ item.label }}</text>
      <text
        :x="(width + getBarWidth(item.value)) / 2 + 10"
        :y="40 + index * (barHeight + 10) + barHeight / 2"
        dominant-baseline="middle"
        class="text-sm fill-gray-600"
      >{{ item.value }}</text>
    </g>
  </svg>
</template>
