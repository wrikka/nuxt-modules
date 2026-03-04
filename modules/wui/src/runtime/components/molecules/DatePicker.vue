<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: Date
  placeholder?: string
  disabled?: boolean
  format?: string
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select date',
  format: 'MM/dd/yyyy'
})

const emit = defineEmits<{
  'update:modelValue': [date: Date]
}>()

const isOpen = ref(false)
const selectedDate = ref(_props.modelValue)

const _formattedDate = computed(() => {
  if (!selectedDate.value) return ''
  
  const date = selectedDate.value
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  
  return _props.format
    .replace('MM', month)
    .replace('dd', day)
    .replace('yyyy', String(year))
})

const _calendarDays = computed(() => {
  if (!selectedDate.value) return []
  
  const year = selectedDate.value.getFullYear()
  const month = selectedDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  const current = new Date(startDate)
  
  while (current <= lastDay || current.getDay() !== 0) {
    days.push({
      date: new Date(current),
      isCurrentMonth: current.getMonth() === month,
      isToday: isToday(current),
      isSelected: isSelected(current)
    })
    current.setDate(current.getDate() + 1)
  }
  
  return days
})

const isToday = (date: Date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

const isSelected = (date: Date) => {
  return selectedDate.value?.toDateString() === date.toDateString()
}

const _selectDate = (date: Date) => {
  selectedDate.value = date
  emit('update:modelValue', date)
  isOpen.value = false
}

const _toggleCalendar = () => {
  if (!_props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const _classes = computed(() => [
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  _props.class
])
</script>

<template>
  <div class="relative">
    <input
      :class="_classes"
      :value="_formattedDate"
      :placeholder="_props.placeholder"
      :disabled="_props.disabled"
      readonly
      @click="_toggleCalendar"
    />
    
    <div class="absolute right-3 top-1/2 -translate-y-1/2">
      <div class="i-lucide-calendar h-4 w-4 text-muted-foreground" />
    </div>
    
    <Teleport to="body">
      <div
        v-if="isOpen"
        class="absolute top-full left-0 z-50 mt-1 rounded-md border bg-popover p-4 shadow-lg"
      >
        <div class="grid grid-cols-7 gap-1 text-center text-sm">
          <div v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day" class="font-medium text-muted-foreground">
            {{ day }}
          </div>
          
          <button
            v-for="day in _calendarDays"
            :key="day.date.toISOString()"
            type="button"
            class="rounded p-1 hover:bg-accent hover:text-accent-foreground"
            :class="{
              'text-muted-foreground': !day.isCurrentMonth,
              'bg-primary text-primary-foreground': day.isSelected,
              'bg-accent': day.isToday && !day.isSelected
            }"
            @click="_selectDate(day.date)"
          >
            {{ day.date.getDate() }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
