<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  direction?: 'horizontal' | 'vertical'
  minSize?: number
  maxSize?: number
  defaultSize?: number
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  direction: 'horizontal',
  minSize: 200,
  maxSize: 800,
  defaultSize: 300
})

const _size = ref(_props.defaultSize)
const _isDragging = ref(false)
const _containerRef = ref<HTMLElement | null>(null)
const _startPos = ref(0)
const _startSize = ref(0)

const _isHorizontal = computed(() => _props.direction === 'horizontal')

const _containerStyle = computed(() => ({
  [_isHorizontal.value ? 'width' : 'height']: `${_size.value}px`
}))

const _handleStyle = computed(() => ({
  cursor: _isHorizontal.value ? 'col-resize' : 'row-resize',
  [_isHorizontal.value ? 'right' : 'bottom']: '-4px',
  [_isHorizontal.value ? 'width' : 'height']: '8px',
  [_isHorizontal.value ? 'height' : 'width']: '100%'
}))

const _startResize = (event: MouseEvent) => {
  _isDragging.value = true
  _startPos.value = _isHorizontal.value ? event.clientX : event.clientY
  _startSize.value = _size.value
  document.body.style.cursor = _isHorizontal.value ? 'col-resize' : 'row-resize'
  document.body.style.userSelect = 'none'
}

const _handleResize = (event: MouseEvent) => {
  if (!_isDragging.value) return
  
  const currentPos = _isHorizontal.value ? event.clientX : event.clientY
  const delta = currentPos - _startPos.value
  let newSize = _startSize.value + delta
  
  newSize = Math.max(_props.minSize, Math.min(_props.maxSize, newSize))
  _size.value = newSize
}

const _stopResize = () => {
  _isDragging.value = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

onMounted(() => {
  document.addEventListener('mousemove', _handleResize)
  document.addEventListener('mouseup', _stopResize)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', _handleResize)
  document.removeEventListener('mouseup', _stopResize)
})
</script>

<template>
  <div
    ref="_containerRef"
    class="relative flex-shrink-0"
    :style="_containerStyle"
  >
    <slot />
    
    <div
      class="absolute z-10 bg-transparent hover:bg-primary/10 transition-colors"
      :style="_handleStyle"
      @mousedown="_startResize"
    />
  </div>
</template>
