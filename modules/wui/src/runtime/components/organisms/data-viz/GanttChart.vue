<script setup lang="ts">
interface Task {
  id: string
  name: string
  start: Date
  end: Date
  progress?: number
  color?: string
  dependencies?: string[]
}

interface Props {
  tasks: Task[]
  startDate?: Date
  endDate?: Date
  rowHeight?: number
  headerHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  rowHeight: 40,
  headerHeight: 50
})

const emit = defineEmits<{
  taskClick: [task: Task]
  taskUpdate: [task: Task]
}>()

const containerRef = ref<HTMLDivElement>()
const scrollLeft = ref(0)

const timelineStart = computed(() => {
  if (props.startDate) return new Date(props.startDate)
  const dates = props.tasks.map(t => t.start)
  return dates.length ? new Date(Math.min(...dates.map(d => d.getTime()))) : new Date()
})

const timelineEnd = computed(() => {
  if (props.endDate) return new Date(props.endDate)
  const dates = props.tasks.map(t => t.end)
  return dates.length ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date()
})

const totalDays = computed(() => {
  const diff = timelineEnd.value.getTime() - timelineStart.value.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
})

const dayWidth = 40
const totalWidth = computed(() => totalDays.value * dayWidth)

const months = computed(() => {
  const result: { name: string; days: number; offset: number }[] = []
  let current = new Date(timelineStart.value)
  let offset = 0
  
  while (current <= timelineEnd.value) {
    const monthStart = new Date(current.getFullYear(), current.getMonth(), 1)
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0)
    const start = Math.max(monthStart.getTime(), timelineStart.value.getTime())
    const end = Math.min(monthEnd.getTime(), timelineEnd.value.getTime())
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
    
    result.push({
      name: current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      days,
      offset
    })
    
    offset += days
    current = new Date(current.getFullYear(), current.getMonth() + 1, 1)
  }
  
  return result
})

const taskBars = computed(() => {
  return props.tasks.map((task, index) => {
    const startOffset = Math.ceil((task.start.getTime() - timelineStart.value.getTime()) / (1000 * 60 * 60 * 24))
    const duration = Math.ceil((task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    
    return {
      ...task,
      top: index * props.rowHeight,
      left: startOffset * dayWidth,
      width: duration * dayWidth - 10,
      progressWidth: (duration * dayWidth - 10) * ((task.progress || 0) / 100)
    }
  })
})
</script>

<template>
  <div ref="containerRef" class="rounded-lg border border-gray-200 bg-white overflow-hidden">
    <div class="flex">
      <div class="w-48 border-r border-gray-200 bg-gray-50 flex-shrink-0">
        <div :style="{ height: `${headerHeight}px` }" class="flex items-center px-4 border-b border-gray-200 font-medium">
          Task
        </div>
        <div
          v-for="(task, i) in tasks"
          :key="task.id"
          :style="{ height: `${rowHeight}px` }"
          class="flex items-center px-4 border-b border-gray-100 text-sm"
        >
          {{ task.name }}
        </div>
      </div>
      
      <div class="flex-1 overflow-auto" @scroll="e => scrollLeft = (e.target as HTMLDivElement).scrollLeft">
        <div :style="{ width: `${totalWidth}px` }">
          <div :style="{ height: `${headerHeight}px` }" class="flex border-b border-gray-200 bg-gray-50">
            <div
              v-for="month in months"
              :key="month.name"
              :style="{ width: `${month.days * dayWidth}px` }"
              class="flex items-center justify-center border-r border-gray-200 text-sm font-medium"
            >
              {{ month.name }}
            </div>
          </div>
          
          <div class="relative">
            <div
              v-for="i in tasks.length"
              :key="`row-${i}`"
              :style="{ height: `${rowHeight}px`, top: `${(i - 1) * rowHeight}px` }"
              class="absolute left-0 right-0 border-b border-gray-100"
            />
            
            <div
              v-for="bar in taskBars"
              :key="bar.id"
              :style="{
                left: `${bar.left}px`,
                top: `${bar.top + 5}px`,
                width: `${bar.width}px`,
                height: `${rowHeight - 10}px`
              }"
              class="absolute rounded cursor-pointer group"
              :class="bar.color || 'bg-blue-500'"
              @click="emit('taskClick', bar)"
            >
              <div
                :style="{ width: `${bar.progressWidth}px` }"
                class="h-full rounded bg-opacity-70 bg-black"
              />
              <span class="absolute inset-0 flex items-center justify-center text-xs text-white font-medium truncate px-2">
                {{ bar.progress }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
