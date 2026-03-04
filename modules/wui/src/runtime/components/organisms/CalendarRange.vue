<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue?: [Date | null, Date | null]
  min?: Date
  max?: Date
  presets?: Array<{ label: string; days: number }>
  format?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [null, null],
  format: 'yyyy-MM-dd'
})

const emit = defineEmits<{
  'update:modelValue': [range: [Date | null, Date | null]]
}>()

const startDate = ref<Date | null>(props.modelValue[0])
const endDate = ref<Date | null>(props.modelValue[1])
const selecting = ref<'start' | 'end'>('start')

const currentMonth = ref(new Date())

const daysInMonth = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  return new Date(year, month + 1, 0).getDate()
})

const firstDayOfMonth = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  return new Date(year, month, 1).getDay()
})

const monthName = computed(() => {
  return currentMonth.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const prevMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1)
}

const nextMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1)
}

const isSelected = (day: number) => {
  const date = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), day)
  
  if (startDate.value && endDate.value) {
    return date >= startDate.value && date <= endDate.value
  }
  if (startDate.value) {
    return date.toDateString() === startDate.value.toDateString()
  }
  return false
}

const isStart = (day: number) => {
  if (!startDate.value) return false
  const date = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), day)
  return date.toDateString() === startDate.value.toDateString()
}

const isEnd = (day: number) => {
  if (!endDate.value) return false
  const date = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), day)
  return date.toDateString() === endDate.value.toDateString()
}

const selectDate = (day: number) => {
  const date = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), day)
  
  if (selecting.value === 'start') {
    startDate.value = date
    endDate.value = null
    selecting.value = 'end'
  } else {
    if (date < startDate.value!) {
      startDate.value = date
      endDate.value = null
    } else {
      endDate.value = date
      selecting.value = 'start'
      emit('update:modelValue', [startDate.value, endDate.value])
    }
  }
}

const applyPreset = (days: number) => {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)
  startDate.value = start
  endDate.value = end
  emit('update:modelValue', [start, end])
}

const clear = () => {
  startDate.value = null
  endDate.value = null
  selecting.value = 'start'
  emit('update:modelValue', [null, null])
}

watch(() => props.modelValue, (val) => {
  startDate.value = val[0]
  endDate.value = val[1]
})
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white p-4">
    <div class="mb-4 flex items-center justify-between">
      <button type="button" class="rounded p-1 hover:bg-gray-100" @click="prevMonth">
        <span class="i-lucide-chevron-left" />
      </button>
      <span class="font-medium">{{ monthName }}</span>
      <button type="button" class="rounded p-1 hover:bg-gray-100" @click="nextMonth">
        <span class="i-lucide-chevron-right" />
      </button>
    </div>
    
    <div class="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-gray-400">
      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
    </div>
    
    <div class="grid grid-cols-7 gap-1">
      <span v-for="n in firstDayOfMonth" :key="`empty-${n}`" />
      <button
        v-for="day in daysInMonth"
        :key="day"
        type="button"
        class="aspect-square rounded text-sm transition-colors"
        :class="[
          isSelected(day) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100',
          isStart(day) ? 'rounded-l-full bg-blue-600 text-white' : '',
          isEnd(day) ? 'rounded-r-full bg-blue-600 text-white' : ''
        ]"
        @click="selectDate(day)"
      >
        {{ day }}
      </button>
    </div>
    
    <div v-if="presets?.length" class="mt-4 flex flex-wrap gap-2">
      <button
        v-for="preset in presets"
        :key="preset.label"
        type="button"
        class="rounded-full bg-gray-100 px-3 py-1 text-xs hover:bg-gray-200"
        @click="applyPreset(preset.days)"
      >
        {{ preset.label }}
      </button>
    </div>
    
    <div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
      <div class="text-sm text-gray-600">
        <span v-if="startDate">{{ startDate.toLocaleDateString() }}</span>
        <span v-if="startDate && endDate"> - </span>
        <span v-if="endDate">{{ endDate.toLocaleDateString() }}</span>
        <span v-if="!startDate && !endDate">Select range</span>
      </div>
      <Button size="sm" variant="ghost" @click="clear">Clear</Button>
    </div>
  </div>
</template>
