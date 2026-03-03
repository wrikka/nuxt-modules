<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import type { ShapeStickyNote, ShapeText } from '../../shared/types/whiteboard'
import { useWhiteboardStore } from '~/stores/whiteboard'
import { storeToRefs } from 'pinia'
import { worldToScreen } from '~/utils/whiteboard/geometry'

const store = useWhiteboardStore()
const { ui, doc, camera } = storeToRefs(store)

const editingShape = computed(() => {
  if (!ui.value.editingShapeId) return null
  const shape = doc.value.shapes[ui.value.editingShapeId]
  if (shape?.type === 'sticky-note' || shape?.type === 'text') {
    return shape
  }
  return null
})

const textarea = ref<HTMLTextAreaElement | null>(null)
const text = ref('')

watch(editingShape, async (shape) => {
  if (shape) {
    text.value = shape.text
    await nextTick()
    textarea.value?.focus()
    textarea.value?.select()
  } else {
    text.value = ''
  }
})

const editorStyle = computed(() => {
  if (!editingShape.value) return { display: 'none' }

  const shape = editingShape.value

  // For text, the y is the baseline, so we need to adjust
  const yOffset = shape.type === 'text' ? -shape.fontSize : 0

  const topLeft = worldToScreen({ x: shape.x, y: shape.y + yOffset }, camera.value)
    let w, h
  if (shape.type === 'sticky-note') {
    w = shape.w
    h = shape.h
  } else { // text
    // Estimate width based on text length and font size
    w = shape.text.length * (shape.fontSize * 0.6)
    h = shape.fontSize * 1.2
  }

  const width = w * camera.value.zoom
  const height = h * camera.value.zoom

  return {
    display: 'block',
    position: 'absolute' as const,
    left: `${topLeft.x}px`,
    top: `${topLeft.y}px`,
    width: `${width}px`,
    height: `${height}px`,
    fontSize: `${shape.fontSize * camera.value.zoom}px`,
    lineHeight: 1.2,
    padding: `${8 * camera.value.zoom}px`,
  }
})

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  text.value = target.value
  if (editingShape.value) {
    store.updateShapeText(editingShape.value.id, target.value)
  }
}

function handleBlur() {
  store.setEditingShapeId(null)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    store.setEditingShapeId(null)
  }
}
</script>

<template>
  <textarea
    v-if="editingShape"
    ref="textarea"
    :value="text"
    :style="editorStyle"
    class="bg-transparent outline-none resize-none text-center m-0"
    @input="handleInput"
    @blur="handleBlur"
    @keydown="handleKeydown"
  />
</template>
