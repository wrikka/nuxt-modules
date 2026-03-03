<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: string
  format?: '12h' | '24h'
  minuteStep?: number
  disabled?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  format: '24h',
  minuteStep: 1
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const _parseTime = (timeStr: string) => {
  const parts = timeStr.split(':')
  return {
    hour: parseInt(parts[0] || '0', 10),
    minute: parseInt(parts[1] || '0', 10)
  }
}

const _currentTime = _parseTime(_props.modelValue || '00:00')
const _hour = ref(_currentTime.hour)
const _minute = ref(_currentTime.minute)
const _period = ref(_currentTime.hour >= 12 ? 'PM' : 'AM')

const _displayHour = computed(() => {
  if (_props.format === '12h') {
    const h = _hour.value % 12
    return h === 0 ? 12 : h
  }
  return _hour.value
})

const _hours = computed(() => 
  Array.from({ length: _props.format === '12h' ? 12 : 24 }, (_, i) => 
    _props.format === '12h' ? (i === 0 ? 12 : i) : i
  )
)

const _minutes = computed(() => 
  Array.from({ length: 60 / _props.minuteStep }, (_, i) => i * _props.minuteStep)
)

const _setHour = (h: number) => {
  if (_props.format === '12h') {
    _hour.value = _period.value === 'PM' ? (h % 12) + 12 : h % 12
  }
  else {
    _hour.value = h
  }
  _emitUpdate()
}

const _setMinute = (m: number) => {
  _minute.value = m
  _emitUpdate()
}

const _setPeriod = (p: 'AM' | 'PM') => {
  _period.value = p
  if (_props.format === '12h') {
    _hour.value = p === 'PM' ? (_hour.value % 12) + 12 : _hour.value % 12
  }
  _emitUpdate()
}

const _emitUpdate = () => {
  const h = String(_hour.value).padStart(2, '0')
  const m = String(_minute.value).padStart(2, '0')
  emit('update:modelValue', `${h}:${m}`)
}

const _classes = computed(() => [
  'rounded-md border bg-background p-3 shadow-md w-64',
  _props.class
])
</script>

<template>
  <div :class="_classes">
    <div class="flex items-center justify-center gap-2 pb-3 border-b">
      <div class="flex items-center gap-1">
        <span class="text-2xl font-bold w-12 text-center">
          {{ String(_displayHour).padStart(2, '0') }}
        </span>
        <span class="text-2xl font-bold">:</span>
        <span class="text-2xl font-bold w-12 text-center">
          {{ String(_minute).padStart(2, '0') }}
        </span>
      </div>
      
      <div v-if="format === '12h'" class="flex flex-col gap-1 ml-2">
        <button
          type="button"
          :class="['px-2 py-1 text-xs rounded', _period === 'AM' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent']"
          @click="_setPeriod('AM')"
        >
          AM
        </button>
        <button
          type="button"
          :class="['px-2 py-1 text-xs rounded', _period === 'PM' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent']"
          @click="_setPeriod('PM')"
        >
          PM
        </button>
      </div>
    </div>
    
    <div class="mt-3 grid grid-cols-2 gap-3">
      <div>
        <p class="text-xs text-muted-foreground mb-2 text-center">Hour</p>
        <div class="h-32 overflow-y-auto space-y-1">
          <button
            v-for="h in _hours"
            :key="h"
            type="button"
            :class="[
              'w-full py-1 text-sm rounded',
              _displayHour === h ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            ]"
            @click="_setHour(h)"
          >
            {{ String(h).padStart(2, '0') }}
          </button>
        </div>
      </div>
      
      <div>
        <p class="text-xs text-muted-foreground mb-2 text-center">Minute</p>
        <div class="h-32 overflow-y-auto space-y-1">
          <button
            v-for="m in _minutes"
            :key="m"
            type="button"
            :class="[
              'w-full py-1 text-sm rounded',
              _minute === m ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            ]"
            @click="_setMinute(m)"
          >
            {{ String(m).padStart(2, '0') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
