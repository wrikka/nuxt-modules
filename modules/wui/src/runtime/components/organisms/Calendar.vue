<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue?: Date
  min?: Date
  max?: Date
  disabledDates?: Date[]
  firstDayOfWeek?: number
  showWeekNumbers?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  firstDayOfWeek: 0,
  showWeekNumbers: false
})

const emit = defineEmits<{
  'update:modelValue': [value: Date]
  'select': [date: Date]
}>()

const _currentMonth = ref(_props.modelValue || new Date())
const _selectedDate = ref<Date | null>(_props.modelValue || null)

watch(() => _props.modelValue, (newVal) => {
  if (newVal) {
    _selectedDate.value = newVal
    _currentMonth.value = newVal
  }
})

const _weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const _monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const _calendarDays = computed(() => {
  const year = _currentMonth.value.getFullYear()
  const month = _currentMonth.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const startDayOfWeek = (firstDay.getDay() - _props.firstDayOfWeek + 7) % 7
  const daysInMonth = lastDay.getDate()
  
  const days: (number | null)[] = Array(startDayOfWeek).fill(null)
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }
  
  return days
})

const _isSelected = (day: number) => {
  if (!_selectedDate.value) return false
  return (
    _selectedDate.value.getDate() === day &&
    _selectedDate.value.getMonth() === _currentMonth.value.getMonth() &&
    _selectedDate.value.getFullYear() === _currentMonth.value.getFullYear()
  )
}

const _isToday = (day: number) => {
  const today = new Date()
  return (
    today.getDate() === day &&
    today.getMonth() === _currentMonth.value.getMonth() &&
    today.getFullYear() === _currentMonth.value.getFullYear()
  )
}

const _isDisabled = (day: number) => {
  const date = new Date(_currentMonth.value.getFullYear(), _currentMonth.value.getMonth(), day)
  
  if (_props.min && date < _props.min) return true
  if (_props.max && date > _props.max) return true
  
  return _props.disabledDates?.some(d => 
    d.getDate() === date.getDate() &&
    d.getMonth() === date.getMonth() &&
    d.getFullYear() === date.getFullYear()
  )
}

const _selectDate = (day: number) => {
  if (_isDisabled(day)) return
  
  const date = new Date(_currentMonth.value.getFullYear(), _currentMonth.value.getMonth(), day)
  _selectedDate.value = date
  emit('update:modelValue', date)
  emit('select', date)
}

const _prevMonth = () => {
  _currentMonth.value = new Date(_currentMonth.value.getFullYear(), _currentMonth.value.getMonth() - 1, 1)
}

const _nextMonth = () => {
  _currentMonth.value = new Date(_currentMonth.value.getFullYear(), _currentMonth.value.getMonth() + 1, 1)
}
</script>

<template>
  <div :class="['w-80 rounded-md border bg-background p-3 shadow-md', _props.class]">
    <div class="flex items-center justify-between px-1 pb-3">
      <button
        type="button"
        class="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent"
        @click="_prevMonth"
      >
        <span class="i-lucide-chevron-left h-4 w-4" />
      </button>
      
      <span class="font-semibold">
        {{ _monthNames[_currentMonth.getMonth()] }} {{ _currentMonth.getFullYear() }}
      </span>
      
      <button
        type="button"
        class="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent"
        @click="_nextMonth"
      >
        <span class="i-lucide-chevron-right h-4 w-4" />
      </button>
    </div>
    
    <div class="grid grid-cols-7 gap-1 text-center">
      <div
        v-for="day in _weekDays"
        :key="day"
        class="h-8 w-8 text-xs font-medium text-muted-foreground"
      >
        {{ day }}
      </div>
      
      <button
        v-for="(day, index) in _calendarDays"
        :key="index"
        type="button"
        :disabled="day === null || (day !== null && _isDisabled(day))"
        :class="[
          'h-8 w-8 rounded-md text-sm',
          day === null && 'invisible',
          day !== null && _isDisabled(day) && 'cursor-not-allowed text-muted-foreground/50',
          day !== null && !_isDisabled(day) && 'hover:bg-accent',
          day !== null && _isSelected(day) && 'bg-primary text-primary-foreground hover:bg-primary/90',
          day !== null && _isToday(day) && !_isSelected(day) && 'border border-primary'
        ]"
        @click="day !== null && _selectDate(day)"
      >
        {{ day }}
      </button>
    </div>
  </div>
</template>
