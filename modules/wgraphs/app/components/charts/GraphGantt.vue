<script setup lang="ts">
interface Task {
  id: string
  name: string
  start: number
  duration: number
  color?: string
  progress?: number
}

interface Props {
  tasks: Task[]
  width?: number
  height?: number
  rowHeight?: number
  timeRange?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 400,
  rowHeight: 50,
  timeRange: 100
})

const timeScale = computed(() => (props.width - 100) / props.timeRange)

const maxEnd = computed(() => Math.max(...props.tasks.map(t => t.start + t.duration)))

const adjustedTimeRange = computed(() => Math.max(props.timeRange, maxEnd.value))
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-gantt">
    <line x1="50" y1="30" x2="50" :y2="height - 30" stroke="#e5e7eb" stroke-width="2" />
    
    <g v-for="i in 11" :key="`grid-${i}`">
      <line
        :x1="50 + ((i - 1) / 10) * (width - 100)"
        y1="30"
        :x2="50 + ((i - 1) / 10) * (width - 100)"
        :y2="height - 30"
        stroke="#f3f4f6"
        stroke-width="1"
      />
      <text
        :x="50 + ((i - 1) / 10) * (width - 100)"
        y="20"
        text-anchor="middle"
        class="text-xs fill-gray-500"
      >{{ Math.round((i - 1) * adjustedTimeRange / 10) }}</text>
    </g>
    
    <g v-for="(task, index) in tasks" :key="task.id">
      <rect
        :x="50 + task.start * timeScale"
        :y="40 + index * rowHeight"
        :width="task.duration * timeScale"
        :height="rowHeight - 10"
        :fill="task.color || '#3b82f6'"
        rx="4"
        opacity="0.8"
      />
      <rect
        v-if="task.progress"
        :x="50 + task.start * timeScale"
        :y="40 + index * rowHeight"
        :width="task.duration * timeScale * (task.progress / 100)"
        :height="rowHeight - 10"
        fill="#1e40af"
        rx="4"
      />
      <text
        x="45"
        :y="40 + index * rowHeight + rowHeight / 2"
        text-anchor="end"
        dominant-baseline="middle"
        class="text-sm fill-gray-700"
      >{{ task.name }}</text>
    </g>
  </svg>
</template>
