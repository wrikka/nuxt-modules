<script setup lang="ts">
interface DataPoint {
  id: string
  values: number[]
  color?: string
}

interface Props {
  data: DataPoint[]
  dimensions: string[]
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 400
})

const padding = 60
const chartWidth = computed(() => props.width - padding * 2)
const chartHeight = computed(() => props.height - padding * 2)

const xScale = computed(() => chartWidth.value / (props.dimensions.length - 1))

const allValues = computed(() => props.data.flatMap(d => d.values))
const minValue = computed(() => Math.min(...allValues.value))
const maxValue = computed(() => Math.max(...allValues.value))

const getY = (value: number): number => padding + chartHeight.value - ((value - minValue.value) / (maxValue.value - minValue.value)) * chartHeight.value
const getX = (index: number): number => padding + index * xScale.value
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-parallel">
    <g v-for="(dim, index) in dimensions" :key="index">
      <line
        :x1="getX(index)"
        :y1="padding"
        :x2="getX(index)"
        :y2="height - padding"
        stroke="#e5e7eb"
        stroke-width="2"
      />
      <text
        :x="getX(index)"
        :y="height - padding + 25"
        text-anchor="middle"
        class="text-sm fill-gray-700 font-medium"
      >{{ dim }}</text>
    </g>
    <g v-for="(item, index) in data" :key="item.id">
      <path
        :d="`M ${item.values.map((v, i) => `${getX(i)} ${getY(v)}`).join(' L ')}`"
        fill="none"
        :stroke="item.color || `hsl(${index * 360 / data.length}, 70%, 50%)`"
        stroke-width="2"
        opacity="0.6"
      />
    </g>
  </svg>
</template>
