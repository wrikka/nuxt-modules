<script setup lang="ts">
import type { ExportOptions } from '../types'

const props = defineProps<{
  src?: string
  width?: number
  height?: number
}>()

const emit = defineEmits<{
  save: [dataUrl: string, blob: Blob | null]
  cancel: []
  load: []
  error: [error: Error]
}>()

const canvasRef = ref<HTMLCanvasElement>()
const fileInputRef = ref<HTMLInputElement>()

const {
  state,
  canUndo,
  canRedo,
  initCanvas,
  loadImage,
  setFilter,
  resetFilters,
  rotate,
  flip,
  setCrop,
  applyCrop,
  undo,
  redo,
  exportImage,
  exportBlob,
  saveToHistory
} = useImageEditor()

const activeTool = ref<'filter' | 'crop' | 'rotate' | null>(null)
const cropRegion = reactive({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  isDrawing: false
})

onMounted(() => {
  if (canvasRef.value) {
    initCanvas(canvasRef.value, props.width, props.height)

    if (props.src) {
      loadImage(props.src).then(() => {
        emit('load')
      }).catch((err) => {
        emit('error', err)
      })
    }
  }
})

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  try {
    await loadImage(file)
    emit('load')
  } catch (err) {
    emit('error', err as Error)
  }
}

const handleSave = async () => {
  const dataUrl = exportImage()
  const blob = await exportBlob()
  emit('save', dataUrl, blob)
}

const handleCanvasMouseDown = (e: MouseEvent) => {
  if (activeTool.value !== 'crop') return

  const rect = canvasRef.value!.getBoundingClientRect()
  cropRegion.x = e.clientX - rect.left
  cropRegion.y = e.clientY - rect.top
  cropRegion.isDrawing = true
}

const handleCanvasMouseMove = (e: MouseEvent) => {
  if (activeTool.value !== 'crop' || !cropRegion.isDrawing) return

  const rect = canvasRef.value!.getBoundingClientRect()
  cropRegion.width = e.clientX - rect.left - cropRegion.x
  cropRegion.height = e.clientY - rect.top - cropRegion.y

  setCrop({
    x: Math.min(cropRegion.x, cropRegion.x + cropRegion.width),
    y: Math.min(cropRegion.y, cropRegion.y + cropRegion.height),
    width: Math.abs(cropRegion.width),
    height: Math.abs(cropRegion.height)
  })
}

const handleCanvasMouseUp = () => {
  if (activeTool.value === 'crop' && cropRegion.isDrawing) {
    cropRegion.isDrawing = false
    if (Math.abs(cropRegion.width) > 10 && Math.abs(cropRegion.height) > 10) {
      applyCrop()
    }
    setCrop(null)
  }
}

const filterPresets = [
  { name: 'Grayscale', type: 'grayscale' as const, min: 0, max: 100 },
  { name: 'Sepia', type: 'sepia' as const, min: 0, max: 100 },
  { name: 'Blur', type: 'blur' as const, min: 0, max: 20 },
  { name: 'Brightness', type: 'brightness' as const, min: 0, max: 200 },
  { name: 'Contrast', type: 'contrast' as const, min: 0, max: 200 },
  { name: 'Saturation', type: 'saturation' as const, min: 0, max: 200 },
  { name: 'Hue', type: 'hue' as const, min: -180, max: 180 }
]
</script>

<template>
  <div class="wimage-editor">
    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-section">
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileUpload"
        >
        <button @click="fileInputRef?.click()">
          Upload
        </button>
      </div>

      <div class="toolbar-section">
        <button
          :class="{ active: activeTool === 'filter' }"
          @click="activeTool = activeTool === 'filter' ? null : 'filter'"
        >
          Filters
        </button>
        <button
          :class="{ active: activeTool === 'crop' }"
          @click="activeTool = activeTool === 'crop' ? null : 'crop'"
        >
          Crop
        </button>
        <button
          :class="{ active: activeTool === 'rotate' }"
          @click="activeTool = activeTool === 'rotate' ? null : 'rotate'"
        >
          Rotate
        </button>
      </div>

      <div class="toolbar-section">
        <button :disabled="!canUndo" @click="undo">
          Undo
        </button>
        <button :disabled="!canRedo" @click="redo">
          Redo
        </button>
      </div>

      <div class="toolbar-section">
        <button @click="handleSave">
          Save
        </button>
        <button @click="emit('cancel')">
          Cancel
        </button>
      </div>
    </div>

    <!-- Filter Panel -->
    <div v-if="activeTool === 'filter'" class="filter-panel">
      <div
        v-for="filter in filterPresets"
        :key="filter.type"
        class="filter-control"
      >
        <label>{{ filter.name }}</label>
        <input
          type="range"
          :min="filter.min"
          :max="filter.max"
          :value="state.filters[filter.type]"
          @input="e => setFilter(filter.type, Number((e.target as HTMLInputElement).value))"
          @change="saveToHistory"
        >
        <span>{{ state.filters[filter.type] }}</span>
      </div>
      <button @click="resetFilters">
        Reset Filters
      </button>
    </div>

    <!-- Rotate Panel -->
    <div v-if="activeTool === 'rotate'" class="rotate-panel">
      <button @click="rotate(-90); saveToHistory()">
        Rotate Left 90°
      </button>
      <button @click="rotate(90); saveToHistory()">
        Rotate Right 90°
      </button>
      <button @click="rotate(180); saveToHistory()">
        Rotate 180°
      </button>
      <button @click="flip('x'); saveToHistory()">
        Flip Horizontal
      </button>
      <button @click="flip('y'); saveToHistory()">
        Flip Vertical
      </button>
    </div>

    <!-- Canvas Container -->
    <div class="canvas-container">
      <canvas
        ref="canvasRef"
        :class="{ 'crop-mode': activeTool === 'crop' }"
        @mousedown="handleCanvasMouseDown"
        @mousemove="handleCanvasMouseMove"
        @mouseup="handleCanvasMouseUp"
        @mouseleave="handleCanvasMouseUp"
      />
    </div>
  </div>
</template>

<style scoped>
.wimage-editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.toolbar {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.toolbar-section {
  display: flex;
  gap: 0.5rem;
  padding-right: 1rem;
  border-right: 1px solid #ddd;
}

.toolbar-section:last-child {
  border-right: none;
}

button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background: #e0e0e0;
}

button.active {
  background: #007bff;
  color: #fff;
  border-color: #007bff;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.filter-panel,
.rotate-panel {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 4px;
}

.filter-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.filter-control label {
  width: 80px;
}

.filter-control input[type="range"] {
  flex: 1;
}

.filter-control span {
  width: 40px;
  text-align: right;
}

.canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

canvas {
  max-width: 100%;
  max-height: 100%;
  cursor: default;
}

canvas.crop-mode {
  cursor: crosshair;
}

.hidden {
  display: none;
}
</style>
