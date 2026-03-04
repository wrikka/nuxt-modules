<script setup lang="ts">
interface Props {
  value: number
  min?: number
  max?: number
  width?: number
  height?: number
  color?: string
  showValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  width: 300,
  height: 200,
  color: '#3b82f6',
  showValue: true
})

const percentage = computed(() => Math.min(100, Math.max(0, ((props.value - props.min) / (props.max - props.min)) * 100)))

const centerX = computed(() => props.width / 2)
const centerY = computed(() => props.height - 20)
const radius = computed(() => Math.min(props.width, props.height) / 2 - 20)

const arcPath = computed((): string => {
  const startAngle = Math.PI
  const endAngle = Math.PI + (percentage.value / 100) * Math.PI
  const x1 = centerX.value + radius.value * Math.cos(startAngle)
  const y1 = centerY.value + radius.value * Math.sin(startAngle)
  const x2 = centerX.value + radius.value * Math.cos(endAngle)
  const y2 = centerY.value + radius.value * Math.sin(endAngle)
  const largeArcFlag = percentage.value > 50 ? 1 : 0
  return `M ${x1} ${y1} A ${radius.value} ${radius.value} 0 ${largeArcFlag} 1 ${x2} ${y2}`
})

const backgroundArc = computed((): string => {
  const x1 = centerX.value + radius.value * Math.cos(Math.PI)
  const y1 = centerY.value + radius.value * Math.sin(Math.PI)
  const x2 = centerX.value + radius.value * Math.cos(0)
  const y2 = centerY.value + radius.value * Math.sin(0)
  return `M ${x1} ${y1} A ${radius.value} ${radius.value} 0 0 1 ${x2} ${y2}`
})
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-gauge">
    <path :d="backgroundArc" fill="none" stroke="#e5e7eb" stroke-width="20" stroke-linecap="round" />
    <path :d="arcPath" fill="none" :stroke="color" stroke-width="20" stroke-linecap="round" />
    <text
      :x="centerX"
      :y="centerY - radius / 2"
      text-anchor="middle"
      class="text-3xl fill-gray-800 font-bold"
    >{{ Math.round(percentage) }}%</text>
    <text
      v-if="showValue"
      :x="centerX"
      :y="centerY + 20"
      text-anchor="middle"
      class="text-lg fill-gray-600"
    >{{ value }}</text>
  </svg>
</template>
