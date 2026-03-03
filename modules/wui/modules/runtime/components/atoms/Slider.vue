<script setup lang="ts">
import { ref, computed, } from 'vue'

interface Props {
  modelValue?: number | number[]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  orientation: 'horizontal'
})

const emit = defineEmits<{
  'update:modelValue': [value: number | number[]]
}>()

const sliderRef = ref<HTMLElement>()
const isDragging = ref(false)

const values = computed({
  get: () => props.modelValue || (props.min as number),
  set: (newValue: number | number[]) => emit('update:modelValue', newValue)
})

const percentage = computed(() => {
  const value = Array.isArray(values.value) ? values.value[0] ?? props.min : values.value
  return ((value - props.min) / (props.max - props.min)) * 100
})

const _orientationClasses = computed(() => {
  return props.orientation === 'horizontal'
    ? 'w-full h-2'
    : 'h-full w-2'
})

const _thumbClasses = computed(() => {
  const pos = props.orientation === 'horizontal'
    ? `left: ${percentage.value}%`
    : `bottom: ${percentage.value}%`
  
  return `absolute ${pos} transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-primary-foreground cursor-pointer shadow-md`
})

const _onMouseDown = (event: MouseEvent) => {
  if (props.disabled) return
  
  isDragging.value = true
  updateValue(event)
  
  const onMouseMove = (e: MouseEvent) => {
    if (isDragging.value) {
      updateValue(e)
    }
  }
  
  const onMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }
  
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

const updateValue = (event: MouseEvent) => {
  if (!sliderRef.value) return
  
  const rect = sliderRef.value.getBoundingClientRect()
  let percentage: number
  
  if (props.orientation === 'horizontal') {
    percentage = ((event.clientX - rect.left) / rect.width) * 100
  } else {
    percentage = ((rect.bottom - event.clientY) / rect.height) * 100
  }
  
  percentage = Math.max(0, Math.min(100, percentage))
  
  const value = props.min + (percentage / 100) * (props.max - props.min)
  const steppedValue = Math.round(value / props.step) * props.step
  
  values.value = steppedValue
}
</script>

<template>
  <div
    ref="sliderRef"
    :class="[
      'relative bg-secondary rounded-full cursor-pointer',
      _orientationClasses,
      props.disabled && 'opacity-50 cursor-not-allowed',
      props.class
    ]"
    @mousedown="_onMouseDown"
  >
    <div
      class="absolute bg-primary rounded-full"
      :class="_orientationClasses"
      :style="{
        width: props.orientation === 'horizontal' ? `${percentage.value.toFixed(0)}%` : '100%',
        height: props.orientation === 'vertical' ? `${percentage.value.toFixed(0)}%` : '100%'
      }"
    />
    <div :class="_thumbClasses" />
  </div>
</template>
