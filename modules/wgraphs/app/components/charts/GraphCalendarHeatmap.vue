<script setup lang="ts">
interface CalendarDay {
  date: number
  value: number
}

interface Props {
  data: CalendarDay[]
  width?: number
  month?: number
  year?: number
  minColor?: string
  maxColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
  minColor: '#f3f4f6',
  maxColor: '#1f2937'
})

const maxValue = computed(() => Math.max(...props.data.map(d => d.value), 1))
const minValue = computed(() => Math.min(...props.data.map(d => d.value)))

const daysInMonth = computed(() => new Date(props.year, props.month + 1, 0).getDate())
const firstDayOfMonth = computed(() => new Date(props.year, props.month, 1).getDay())

const cellSize = computed(() => (props.width - 80) / 7)

const getColor = (value: number): string => {
  if (value === 0) return '#f9fafb'
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

const getDayPosition = (day: number): { x: number, y: number } => {
  const adjustedDay = day + firstDayOfMonth.value - 1
  const col = adjustedDay % 7
  const row = Math.floor(adjustedDay / 7)
  return { x: 40 + col * cellSize.value, y: 60 + row * cellSize.value }
}
</script>

<template>
  <svg :width="width" :height="60 + Math.ceil((daysInMonth + firstDayOfMonth - 1) / 7) * cellSize" class="w-graph-calendar-heatmap">
    <text x="width / 2" y="30" text-anchor="middle" class="text-lg fill-gray-800 font-semibold">{{ year }} - {{ month + 1 }}</text>
    <g v-for="day in daysInMonth" :key="day">
      <rect
        :x="getDayPosition(day).x"
        :y="getDayPosition(day).y"
        :width="cellSize - 4"
        :height="cellSize - 4"
        :fill="getColor(data.find(d => d.date === day)?.value || 0)"
        rx="4"
        stroke="white"
        stroke-width="2"
      />
      <text
        :x="getDayPosition(day).x + cellSize / 2 - 2"
        :y="getDayPosition(day).y + cellSize / 2 - 2"
        text-anchor="middle"
        dominant-baseline="middle"
        class="text-xs fill-gray-600"
      >{{ day }}</text>
    </g>
  </svg>
</template>
