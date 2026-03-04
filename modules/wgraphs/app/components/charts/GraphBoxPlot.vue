<script setup lang="ts">
interface DataPoint {
  label: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
  outliers?: number[]
}

interface Props {
  data: DataPoint[]
  width?: number
  height?: number
  boxColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 600,
  height: 400,
  boxColor: '#3b82f6'
})

const minValue = computed(() => Math.min(...props.data.map(d => d.min)))
const maxValue = computed(() => Math.max(...props.data.map(d => d.max)))

const boxWidth = computed(() => (props.width - 80) / props.data.length * 0.7)
const spacing = computed(() => (props.width - 80) / props.data.length)

const getY = (value: number): number => props.height - 60 - ((value - minValue.value) / (maxValue.value - minValue.value)) * (props.height - 100)
const getBoxX = (index: number): number => 40 + index * spacing.value + (spacing.value - boxWidth.value) / 2
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-boxplot">
    <line x1="40" :y1="height - 60" :x2="width - 40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    <line x1="40" y1="20" x2="40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    
    <g v-for="(item, index) in data" :key="item.label">
      <line :x1="getBoxX(index) + boxWidth / 2" :y1="getY(item.min)" :x2="getBoxX(index) + boxWidth / 2" :y2="getY(item.q1)" :stroke="boxColor" stroke-width="2" />
      <line :x1="getBoxX(index) + boxWidth / 2" :y1="getY(item.q3)" :x2="getBoxX(index) + boxWidth / 2" :y2="getY(item.max)" :stroke="boxColor" stroke-width="2" />
      <rect :x="getBoxX(index)" :y="getY(item.q3)" :width="boxWidth" :height="getY(item.q1) - getY(item.q3)" :fill="boxColor" opacity="0.5" stroke="white" stroke-width="2" />
      <line :x1="getBoxX(index)" :y1="getY(item.median)" :x2="getBoxX(index) + boxWidth" :y2="getY(item.median)" stroke="white" stroke-width="2" />
      <text :x="getBoxX(index) + boxWidth / 2" :y="height - 40" text-anchor="middle" class="text-xs fill-gray-600">{{ item.label }}</text>
    </g>
  </svg>
</template>
