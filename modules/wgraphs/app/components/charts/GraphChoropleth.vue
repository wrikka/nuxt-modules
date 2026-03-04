<script setup lang="ts">
interface MapRegion {
  id: string
  name: string
  value: number
  path: string
}

interface Props {
  regions: MapRegion[]
  width?: number
  height?: number
  minColor?: string
  maxColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 500,
  minColor: '#eff6ff',
  maxColor: '#1e40af'
})

const maxValue = computed(() => Math.max(...props.regions.map(r => r.value)))
const minValue = computed(() => Math.min(...props.regions.map(r => r.value)))

const getColor = (value: number): string => {
  const ratio = (value - minValue.value) / (maxValue.value - minValue.value)
  const r1 = parseInt(props.minColor.slice(1, 3), 16)
  const g1 = parseInt(props.minColor.slice(3, 5), 16)
  const b1 = parseInt(props.minColor.slice(5, 7), 16)
  const r2 = parseInt(props.maxColor.slice(1, 3), 16)
  const g2 = parseInt(props.maxColor.slice(3, 5), 16)
  const b2 = parseInt(props.maxColor.slice(5, 7), 16)
  
  const r = Math.round(r1 + (r2 - r1) * ratio)
  const g = Math.round(g1 + (g2 - g1) * ratio)
  const b = Math.round(b1 + (b2 - b1) * ratio)
  
  return `rgb(${r}, ${g}, ${b})`
}
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-choropleth">
    <defs>
      <linearGradient id="legendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" :stop-color="minColor" />
        <stop offset="100%" :stop-color="maxColor" />
      </linearGradient>
    </defs>
    <g v-for="region in regions" :key="region.id">
      <path
        :d="region.path"
        :fill="getColor(region.value)"
        stroke="white"
        stroke-width="1"
        opacity="0.9"
      />
      <text
        v-if="region.path"
        :x="region.path.includes('M') ? 0 : width / 2"
        :y="height / 2"
        text-anchor="middle"
        class="text-xs fill-gray-700"
      >{{ region.name }}</text>
    </g>
    <rect :x="width - 200" :y="height - 40" width="150" height="20" fill="url(#legendGradient)" rx="2" />
    <text :x="width - 200" :y="height - 50" class="text-xs fill-gray-600">{{ minValue }}</text>
    <text :x="width - 50" :y="height - 50" text-anchor="end" class="text-xs fill-gray-600">{{ maxValue }}</text>
  </svg>
</template>
