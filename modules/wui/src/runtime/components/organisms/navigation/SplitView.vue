<script setup lang="ts">
interface Props {
  direction?: 'horizontal' | 'vertical'
  initialSize?: number
  minSize?: number
  maxSize?: number
  resizable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'horizontal',
  initialSize: 50,
  minSize: 20,
  maxSize: 80,
  resizable: true
})

const containerRef = ref<HTMLDivElement>()
const splitPosition = ref(props.initialSize)
const isDragging = ref(false)

const onMouseDown = () => {
  if (!props.resizable) return
  isDragging.value = true
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !containerRef.value) return
  
  const rect = containerRef.value.getBoundingClientRect()
  let percentage
  
  if (props.direction === 'horizontal') {
    percentage = ((e.clientX - rect.left) / rect.width) * 100
  } else {
    percentage = ((e.clientY - rect.top) / rect.height) * 100
  }
  
  splitPosition.value = Math.max(props.minSize, Math.min(props.maxSize, percentage))
}

const onMouseUp = () => {
  isDragging.value = false
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
})
</script>

<template>
  <div
    ref="containerRef"
    class="flex overflow-hidden"
    :class="direction === 'vertical' ? 'flex-col' : 'flex-row'"
  >
    <div
      class="overflow-auto"
      :style="direction === 'horizontal'
        ? { width: `${splitPosition}%` }
        : { height: `${splitPosition}%` }"
    >
      <slot name="first" />
    </div>
    
    <div
      v-if="resizable"
      class="flex-shrink-0 bg-gray-200 transition-colors hover:bg-gray-300"
      :class="direction === 'horizontal'
        ? 'w-1 cursor-col-resize'
        : 'h-1 cursor-row-resize'"
      :style="{ cursor: isDragging ? (direction === 'horizontal' ? 'col-resize' : 'row-resize') : '' }"
      @mousedown="onMouseDown"
    >
      <div
        class="flex items-center justify-center"
        :class="direction === 'horizontal' ? 'h-full' : 'w-full'"
      >
        <div
          class="rounded-full bg-gray-400"
          :class="direction === 'horizontal' ? 'h-8 w-1' : 'h-1 w-8'"
        />
      </div>
    </div>
    
    <div class="flex-1 overflow-auto">
      <slot name="second" />
    </div>
  </div>
</template>
