<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  content?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  side: 'top',
  align: 'center',
  delay: 200
})

const isVisible = ref(false)
const timeoutRef = ref<NodeJS.Timeout>()

const _positionClasses = computed(() => {
  const side = props.side
  const align = props.align
  
  const sideClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2'
  }
  
  const alignClasses = {
    start: side === 'top' || side === 'bottom' ? 'left-0 -translate-x-0' : side === 'left' || side === 'right' ? 'top-0 -translate-y-0' : '',
    center: '',
    end: side === 'top' || side === 'bottom' ? 'right-0 translate-x-0' : side === 'left' || side === 'right' ? 'bottom-0 translate-y-0' : ''
  }
  
  return `${sideClasses[side]} ${alignClasses[align]}`
})

const _showTooltip = () => {
  if (timeoutRef.value) clearTimeout(timeoutRef.value)
  timeoutRef.value = setTimeout(() => {
    isVisible.value = true
  }, props.delay)
}

const _hideTooltip = () => {
  if (timeoutRef.value) clearTimeout(timeoutRef.value)
  isVisible.value = false
}
</script>

<template>
  <div class="relative inline-block">
    <div
      @mouseenter="_showTooltip"
      @mouseleave="_hideTooltip"
      @focus="_showTooltip"
      @blur="_hideTooltip"
    >
      <slot />
    </div>
    
    <div
      v-if="isVisible && props.content"
      :class="[
        'absolute z-50 px-2 py-1 text-xs text-primary-foreground bg-primary rounded shadow-md',
        'pointer-events-none whitespace-nowrap',
        _positionClasses
      ]"
    >
      {{ props.content }}
      <div
        class="absolute w-2 h-2 bg-primary rotate-45"
        :class="{
          'bottom-0 left-1/2 -translate-x-1/2 translate-y-1': props.side === 'top',
          'top-0 left-1/2 -translate-x-1/2 -translate-y-1': props.side === 'bottom',
          'left-0 top-1/2 -translate-y-1/2 translate-x-1': props.side === 'right',
          'right-0 top-1/2 -translate-y-1/2 -translate-x-1': props.side === 'left'
        }"
      />
    </div>
  </div>
</template>
