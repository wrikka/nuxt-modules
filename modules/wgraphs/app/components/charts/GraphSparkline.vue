<script setup lang="ts">
interface Props {
  data: number[]
  width?: number
  height?: number
  lineColor?: string
  showArea?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: 200,
  height: 60,
  lineColor: '#3b82f6',
  showArea: true
})

const maxValue = computed(() => Math.max(...props.data))
const minValue = computed(() => Math.min(...props.data))

const getX = (index: number): number => (index / (props.data.length - 1)) * props.width
const getY = (value: number): number => props.height - ((value - minValue.value) / (maxValue.value - minValue.value)) * props.height

const pathD = computed((): string => {
  if (props.data.length === 0) return ''
  let d = `M 0 ${getY(props.data[0])}`
  for (let i = 1; i < props.data.length; i++) {
    d += ` L ${getX(i)} ${getY(props.data[i])}`
  }
  if (props.showArea) {
    d += ` L ${props.width} ${props.height} L 0 ${props.height} Z`
  }
  return d
})
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-sparkline">
    <defs v-if="showArea">
      <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" :stop-color="lineColor" stop-opacity="0.4" />
        <stop offset="100%" :stop-color="lineColor" stop-opacity="0.05" />
      </linearGradient>
    </defs>
    <path v-if="showArea" :d="pathD" fill="url(#sparklineGradient)" />
    <path
      :d="`M 0 ${getY(data[0])}` + data.slice(1).map((v, i) => ` L ${getX(i + 1)} ${getY(v)}`).join('')"
      fill="none"
      :stroke="lineColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
