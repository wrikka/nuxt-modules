<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  direction?: 'horizontal' | 'vertical'
  minSize?: number
  maxSize?: number
  defaultSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'horizontal',
  minSize: 100,
  maxSize: 800,
  defaultSize: 300
})

const emit = defineEmits<{
  resize: [size: number]
}>()

const panelSize = ref(props.defaultSize)
const isResizing = ref(false)
const startPos = ref(0)
const startSize = ref(0)

const startResize = (e: MouseEvent) => {
  isResizing.value = true
  startPos.value = props.direction === 'horizontal' ? e.clientX : e.clientY
  startSize.value = panelSize.value
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
}

const onResize = (e: MouseEvent) => {
  if (!isResizing.value) return
  
  const current = props.direction === 'horizontal' ? e.clientX : e.clientY
  const delta = current - startPos.value
  const newSize = Math.max(props.minSize, Math.min(props.maxSize, startSize.value + delta))
  
  panelSize.value = newSize
  emit('resize', newSize)
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
}

onUnmounted(() => {
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
})

const panelStyle = computed(() => ({
  [props.direction === 'horizontal' ? 'width' : 'height']: `${panelSize.value}px`
}))

const handleClass = computed(() =>
  props.direction === 'horizontal'
    ? 'w-1 cursor-col-resize hover:bg-blue-500'
    : 'h-1 cursor-row-resize hover:bg-blue-500'
)
</script>

<template>
  <div class="flex" :class="direction === 'horizontal' ? 'flex-row' : 'flex-col'">
    <div :style="panelStyle" class="overflow-auto">
      <slot name="panel" />
    </div>
    <div
      class="bg-gray-300 transition-colors"
      :class="[handleClass, isResizing ? 'bg-blue-500' : '']"
      @mousedown="startResize"
    />
    <div class="flex-1 overflow-auto">
      <slot name="content" />
    </div>
  </div>
</template>
