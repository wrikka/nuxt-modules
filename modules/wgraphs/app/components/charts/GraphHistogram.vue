<script setup lang="ts">
interface Props {
  data: number[]
  bins?: number
  width?: number
  height?: number
  barColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  bins: 10,
  width: 600,
  height: 400,
  barColor: '#3b82f6'
})

const minValue = computed(() => Math.min(...props.data))
const maxValue = computed(() => Math.max(...props.data))
const binWidth = computed(() => (maxValue.value - minValue.value) / props.bins)

const histogramData = computed(() => {
  const bins: number[] = new Array(props.bins).fill(0)
  props.data.forEach(value => {
    const binIndex = Math.min(Math.floor((value - minValue.value) / binWidth.value), props.bins - 1)
    bins[binIndex]++
  })
  return bins.map((count, index) => ({
    count,
    start: minValue.value + index * binWidth.value,
    end: minValue.value + (index + 1) * binWidth.value
  }))
})

const maxCount = computed(() => Math.max(...histogramData.value.map(d => d.count)))
const barWidth = computed(() => (props.width - 80) / props.bins * 0.9)
const spacing = computed(() => (props.width - 80) / props.bins * 0.1)

const getBarHeight = (count: number): number => (count / maxCount.value) * (props.height - 100)
const getBarX = (index: number): number => 40 + index * (barWidth.value + spacing.value)
const getBarY = (count: number): number => props.height - 60 - getBarHeight(count)
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-histogram">
    <line x1="40" :y1="height - 60" :x2="width - 40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    <line x1="40" y1="20" x2="40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    
    <g v-for="(bin, index) in histogramData" :key="index">
      <rect
        :x="getBarX(index)"
        :y="getBarY(bin.count)"
        :width="barWidth"
        :height="getBarHeight(bin.count)"
        :fill="barColor"
        opacity="0.7"
        rx="2"
      />
      <text
        :x="getBarX(index) + barWidth / 2"
        :y="height - 45"
        text-anchor="middle"
        class="text-xs fill-gray-600"
      >{{ Math.round(bin.start) }}</text>
    </g>
  </svg>
</template>
