<script setup lang="ts">
interface TimelineEvent {
  id: string
  label: string
  date: string
  description?: string
  color?: string
}

interface Props {
  events: TimelineEvent[]
  width?: number
  height?: number
  orientation?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 300,
  orientation: 'horizontal'
})

const sortedEvents = computed(() => [...props.events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))

const isHorizontal = computed(() => props.orientation === 'horizontal')
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-timeline">
    <line
      :x1="isHorizontal ? 40 : width / 2"
      :y1="isHorizontal ? height / 2 : 40"
      :x2="isHorizontal ? width - 40 : width / 2"
      :y2="isHorizontal ? height / 2 : height - 40"
      stroke="#d1d5db"
      stroke-width="4"
      stroke-linecap="round"
    />
    
    <g v-for="(event, index) in sortedEvents" :key="event.id">
      <circle
        :cx="isHorizontal ? 40 + (index / (sortedEvents.length - 1)) * (width - 80) : width / 2"
        :cy="isHorizontal ? height / 2 : 40 + (index / (sortedEvents.length - 1)) * (height - 80)"
        r="12"
        :fill="event.color || '#3b82f6'"
        stroke="white"
        stroke-width="3"
      />
      <text
        :x="isHorizontal ? 40 + (index / (sortedEvents.length - 1)) * (width - 80) : width / 2 + (index % 2 === 0 ? 30 : -30)"
        :y="isHorizontal ? (index % 2 === 0 ? height / 2 - 30 : height / 2 + 50) : 40 + (index / (sortedEvents.length - 1)) * (height - 80)"
        :text-anchor="isHorizontal ? 'middle' : (index % 2 === 0 ? 'start' : 'end')"
        dominant-baseline="middle"
        class="text-sm fill-gray-700 font-medium"
      >{{ event.label }}</text>
      <text
        v-if="event.description"
        :x="isHorizontal ? 40 + (index / (sortedEvents.length - 1)) * (width - 80) : width / 2 + (index % 2 === 0 ? 30 : -30)"
        :y="isHorizontal ? (index % 2 === 0 ? height / 2 - 50 : height / 2 + 70) : 40 + (index / (sortedEvents.length - 1)) * (height - 80) + 20"
        :text-anchor="isHorizontal ? 'middle' : (index % 2 === 0 ? 'start' : 'end')"
        class="text-xs fill-gray-500"
      >{{ event.description }}</text>
    </g>
  </svg>
</template>
