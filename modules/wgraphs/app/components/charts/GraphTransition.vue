<script setup lang="ts">
interface DataPoint {
  label: string
  value: number
  color?: string
}

interface Props {
  data: DataPoint[]
  animationDuration?: number
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  animationDuration: 1000,
  width: 600,
  height: 400
})

const animatedValues = ref<number[]>([])
const isAnimating = ref(false)

const maxValue = computed(() => Math.max(...props.data.map(d => d.value)))
const barWidth = computed(() => (props.width - 80) / props.data.length * 0.7)
const spacing = computed(() => (props.width - 80) / props.data.length)

const getBarHeight = (value: number): number => (value / maxValue.value) * (props.height - 100)
const getBarX = (index: number): number => 40 + index * spacing.value + (spacing.value - barWidth.value) / 2
const getBarY = (value: number): number => props.height - 60 - getBarHeight(value)

const startAnimation = () => {
  isAnimating.value = true
  animatedValues.value = new Array(props.data.length).fill(0)
  
  const startTime = Date.now()
  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / props.animationDuration, 1)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    
    animatedValues.value = props.data.map(d => d.value * easeOut)
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      isAnimating.value = false
    }
  }
  requestAnimationFrame(animate)
}

watch(() => props.data, startAnimation, { immediate: true })
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-transition">
    <line x1="40" :y1="height - 60" :x2="width - 40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    <line x1="40" y1="20" x2="40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    
    <g v-for="(item, index) in data" :key="item.label">
      <rect
        :x="getBarX(index)"
        :y="getBarY(animatedValues[index])"
        :width="barWidth"
        :height="getBarHeight(animatedValues[index])"
        :fill="item.color || `hsl(${index * 360 / data.length}, 70%, 60%)`"
        rx="4"
      />
      <text
        :x="getBarX(index) + barWidth / 2"
        :y="height - 40"
        text-anchor="middle"
        class="text-xs fill-gray-600"
      >{{ item.label }}</text>
    </g>
  </svg>
</template>
