<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue?: [number, number]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  modelValue: () => [0, 100],
  min: 0,
  max: 100,
  step: 1
})

const emit = defineEmits<{
  'update:modelValue': [value: [number, number]]
}>()

const _values = ref<[number, number]>([..._props.modelValue])
const _trackRef = ref<HTMLElement | null>(null)
const _isDragging = ref<number | null>(null)

const _minValue = computed(() => Math.min(_values.value[0], _values.value[1]))
const _maxValue = computed(() => Math.max(_values.value[0], _values.value[1]))

const _minPercent = computed(() => 
  ((_minValue.value - _props.min) / (_props.max - _props.min)) * 100
)

const _maxPercent = computed(() => 
  ((_maxValue.value - _props.min) / (_props.max - _props.min)) * 100
)

const _rangeStyle = computed(() => ({
  left: `${_minPercent.value}%`,
  width: `${_maxPercent.value - _minPercent.value}%`
}))

const _getValueFromPosition = (clientX: number): number => {
  if (!_trackRef.value) return _props.min
  
  const rect = _trackRef.value.getBoundingClientRect()
  const percent = (clientX - rect.left) / rect.width
  const rawValue = _props.min + percent * (_props.max - _props.min)
  const steppedValue = Math.round(rawValue / _props.step) * _props.step
  
  return Math.max(_props.min, Math.min(_props.max, steppedValue))
}

const _startDrag = (index: number, event: MouseEvent | TouchEvent) => {
  if (_props.disabled) return
  _isDragging.value = index
  event.preventDefault()
}

const _handleDrag = (event: MouseEvent | TouchEvent) => {
  if (_isDragging.value === null || !_trackRef.value) return
  
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const newValue = _getValueFromPosition(clientX)
  
  const newValues: [number, number] = [..._values.value]
  newValues[_isDragging.value] = newValue
  
  _values.value = newValues
  emit('update:modelValue', newValues)
}

const _stopDrag = () => {
  _isDragging.value = null
}

onMounted(() => {
  document.addEventListener('mousemove', _handleDrag)
  document.addEventListener('mouseup', _stopDrag)
  document.addEventListener('touchmove', _handleDrag)
  document.addEventListener('touchend', _stopDrag)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', _handleDrag)
  document.removeEventListener('mouseup', _stopDrag)
  document.removeEventListener('touchmove', _handleDrag)
  document.removeEventListener('touchend', _stopDrag)
})
</script>

<template>
  <div :class="['relative w-full py-4', _props.class]">
    <div
      ref="_trackRef"
      class="relative h-2 w-full rounded-full bg-muted"
    >
      <div
        class="absolute h-full rounded-full bg-primary"
        :style="_rangeStyle"
      />
      
      <button
        v-for="(_, index) in 2"
        :key="index"
        type="button"
        :disabled="disabled"
        class="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 border-primary bg-background shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed"
        :style="{ left: `calc(${index === 0 ? _minPercent : _maxPercent}% - 10px)` }"
        @mousedown="_startDrag(index, $event)"
        @touchstart="_startDrag(index, $event)"
      >
        <span class="sr-only">{{ index === 0 ? 'Min' : 'Max' }} value</span>
      </button>
    </div>
    
    <div class="mt-2 flex justify-between text-sm text-muted-foreground">
      <span>{{ _minValue }}</span>
      <span>{{ _maxValue }}</span>
    </div>
  </div>
</template>
