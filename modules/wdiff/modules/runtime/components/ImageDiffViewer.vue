<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface ImageComparisonOptions {
  blendMode?: 'difference' | 'side-by-side' | 'onion-skin' | 'split'
  opacity?: number
  zoom?: number
  panX?: number
  panY?: number
}

interface Props {
  oldImage: string // URL or base64
  newImage: string // URL or base64
  oldLabel?: string
  newLabel?: string
  mode?: ImageComparisonOptions['blendMode']
  maxWidth?: number
  maxHeight?: number
  allowZoom?: boolean
  allowPan?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  oldLabel: 'Before',
  newLabel: 'After',
  mode: 'side-by-side',
  maxWidth: 800,
  maxHeight: 600,
  allowZoom: true,
  allowPan: true,
})

const emit = defineEmits<{
  (e: 'modeChange', mode: ImageComparisonOptions['blendMode']): void
  (e: 'zoomChange', zoom: number): void
  (e: 'differenceCalculated', diffPercentage: number): void
}>()

const currentMode = ref(props.mode)
const zoom = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const splitPosition = ref(50) // For split mode
const onionOpacity = ref(0.5) // For onion-skin mode
const imageLoaded = ref({ old: false, new: false })
const canvasRef = ref<HTMLCanvasElement | null>(null)

// Difference calculation
const diffPercentage = computed(() => {
  if (!imageLoaded.value.old || !imageLoaded.value.new) return 0
  
  // This would calculate actual pixel difference
  // For now, return a placeholder
  return 0
})

const handleImageLoad = (side: 'old' | 'new') => {
  imageLoaded.value[side] = true
  
  if (imageLoaded.value.old && imageLoaded.value.new) {
    calculateDifference()
  }
}

const calculateDifference = async () => {
  if (!canvasRef.value) return
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // Load images
  const [oldImg, newImg] = await Promise.all([
    loadImage(props.oldImage),
    loadImage(props.newImage),
  ])
  
  canvas.width = oldImg.width
  canvas.height = oldImg.height
  
  // Draw old image
  ctx.drawImage(oldImg, 0, 0)
  const oldData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  
  // Draw new image
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(newImg, 0, 0)
  const newData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  
  // Calculate difference
  let diffPixels = 0
  const diffImage = ctx.createImageData(canvas.width, canvas.height)
  
  for (let i = 0; i < oldData.data.length; i += 4) {
    const rDiff = Math.abs(oldData.data[i] - newData.data[i])
    const gDiff = Math.abs(oldData.data[i + 1] - newData.data[i + 1])
    const bDiff = Math.abs(oldData.data[i + 2] - newData.data[i + 2])
    
    if (rDiff > 10 || gDiff > 10 || bDiff > 10) {
      diffPixels++
      // Highlight difference in red
      diffImage.data[i] = 255
      diffImage.data[i + 1] = 0
      diffImage.data[i + 2] = 0
      diffImage.data[i + 3] = 255
    } else {
      // Show original with reduced opacity
      diffImage.data[i] = oldData.data[i]
      diffImage.data[i + 1] = oldData.data[i + 1]
      diffImage.data[i + 2] = oldData.data[i + 2]
      diffImage.data[i + 3] = 128
    }
  }
  
  const totalPixels = canvas.width * canvas.height
  const percentage = (diffPixels / totalPixels) * 100
  
  ctx.putImageData(diffImage, 0, 0)
  
  emit('differenceCalculated', percentage)
}

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Zoom and pan handlers
const handleWheel = (e: WheelEvent) => {
  if (!props.allowZoom) return
  
  e.preventDefault()
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  zoom.value = Math.max(0.1, Math.min(5, zoom.value * delta))
  emit('zoomChange', zoom.value)
}

const handleMouseDown = (e: MouseEvent) => {
  if (!props.allowPan) return
  
  isDragging.value = true
  dragStart.value = {
    x: e.clientX - panX.value,
    y: e.clientY - panY.value,
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !props.allowPan) return
  
  panX.value = e.clientX - dragStart.value.x
  panY.value = e.clientY - dragStart.value.y
}

const handleMouseUp = () => {
  isDragging.value = false
}

const resetView = () => {
  zoom.value = 1
  panX.value = 0
  panY.value = 0
  splitPosition.value = 50
}

const setMode = (mode: ImageComparisonOptions['blendMode']) => {
  currentMode.value = mode
  emit('modeChange', mode)
}

// Download diff image
const downloadDiff = () => {
  if (!canvasRef.value) return
  
  const link = document.createElement('a')
  link.download = `diff-${Date.now()}.png`
  link.href = canvasRef.value.toDataURL()
  link.click()
}
</script>

<template>
  <div class="image-diff-viewer">
    <!-- Controls -->
    <div class="viewer-controls">
      <div class="mode-selector">
        <button
          v-for="mode in ['side-by-side', 'difference', 'onion-skin', 'split']"
          :key="mode"
          :class="['mode-btn', { active: currentMode === mode }]"
          @click="setMode(mode as ImageComparisonOptions['blendMode'])"
        >
          {{ mode.replace('-', ' ') }}
        </button>
      </div>

      <div v-if="allowZoom" class="zoom-controls">
        <button class="zoom-btn" @click="zoom = Math.max(0.1, zoom - 0.1)">−</button>
        <span class="zoom-value">{{ Math.round(zoom * 100) }}%</span>
        <button class="zoom-btn" @click="zoom = Math.min(5, zoom + 0.1)">+</button>
        <button class="reset-btn" @click="resetView">Reset</button>
      </div>

      <button class="download-btn" @click="downloadDiff">
        Download Diff
      </button>
    </div>

    <!-- Image comparison area -->
    <div
      class="comparison-area"
      :style="{ maxWidth: `${maxWidth}px`, maxHeight: `${maxHeight}px` }"
      @wheel="handleWheel"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
    >
      <!-- Side by side -->
      <div v-if="currentMode === 'side-by-side'" class="side-by-side">
        <div class="image-side">
          <span class="image-label">{{ oldLabel }}</span>
          <img
            :src="oldImage"
            :style="{ transform: `scale(${zoom}) translate(${panX}px, ${panY}px)` }"
            @load="handleImageLoad('old')"
          />
        </div>
        <div class="image-side">
          <span class="image-label">{{ newLabel }}</span>
          <img
            :src="newImage"
            :style="{ transform: `scale(${zoom}) translate(${panX}px, ${panY}px)` }"
            @load="handleImageLoad('new')"
          />
        </div>
      </div>

      <!-- Difference mode -->
      <div v-else-if="currentMode === 'difference'" class="difference-mode">
        <canvas
          ref="canvasRef"
          :style="{ transform: `scale(${zoom}) translate(${panX}px, ${panY}px)` }"
        />
      </div>

      <!-- Onion skin -->
      <div v-else-if="currentMode === 'onion-skin'" class="onion-skin">
        <img :src="oldImage" class="onion-old" :style="{ opacity: 1 - onionOpacity }" />
        <img :src="newImage" class="onion-new" :style="{ opacity: onionOpacity }" />
        <input
          v-model.number="onionOpacity"
          type="range"
          min="0"
          max="1"
          step="0.01"
          class="opacity-slider"
        />
      </div>

      <!-- Split view -->
      <div v-else-if="currentMode === 'split'" class="split-mode">
        <div class="split-container" :style="{ '--split': `${splitPosition}%` }">
          <img :src="oldImage" class="split-old" />
          <img :src="newImage" class="split-new" />
          <div
            class="split-handle"
            :style="{ left: `${splitPosition}%` }"
            @mousedown="(e) => {
              const rect = (e.currentTarget as HTMLElement).parentElement!.getBoundingClientRect()
              const updateSplit = (ev: MouseEvent) => {
                splitPosition = Math.max(0, Math.min(100, ((ev.clientX - rect.left) / rect.width) * 100))
              }
              const stopDrag = () => {
                document.removeEventListener('mousemove', updateSplit)
                document.removeEventListener('mouseup', stopDrag)
              }
              document.addEventListener('mousemove', updateSplit)
              document.addEventListener('mouseup', stopDrag)
            }"
          >
            <span class="handle-icon">↔</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Info -->
    <div class="viewer-info">
      <span v-if="imageLoaded.old && imageLoaded.new" class="diff-stat">
        Difference: {{ diffPercentage.toFixed(2) }}%
      </span>
      <span v-else class="loading">Loading images...</span>
    </div>
  </div>
</template>

<style scoped>
.image-diff-viewer {
  @apply flex flex-col gap-4;
}

.viewer-controls {
  @apply flex flex-wrap items-center justify-between gap-4;
}

.mode-selector {
  @apply flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg;
}

.mode-btn {
  @apply px-3 py-1.5 text-sm rounded-md capitalize;
  @apply text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700;
  @apply transition-colors;
}

.mode-btn.active {
  @apply bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm;
}

.zoom-controls {
  @apply flex items-center gap-2;
}

.zoom-btn {
  @apply w-8 h-8 flex items-center justify-center;
  @apply bg-gray-100 dark:bg-gray-800 rounded-full;
  @apply text-gray-700 dark:text-gray-300 font-bold;
  @apply hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors;
}

.zoom-value {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300 w-14 text-center;
}

.reset-btn,
.download-btn {
  @apply px-3 py-1.5 text-sm rounded-md;
  @apply bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300;
  @apply hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors;
}

.download-btn {
  @apply bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300;
  @apply hover:bg-blue-200 dark:hover:bg-blue-900/50;
}

.comparison-area {
  @apply relative overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-lg;
  @apply cursor-grab active:cursor-grabbing;
}

.side-by-side {
  @apply grid grid-cols-2 gap-4 p-4;
}

.image-side {
  @apply relative;
}

.image-label {
  @apply absolute top-2 left-2 px-2 py-1;
  @apply bg-black/50 text-white text-xs rounded;
  @apply z-10;
}

.image-side img {
  @apply w-full h-auto object-contain;
}

.difference-mode canvas {
  @apply w-full h-auto;
}

.onion-skin {
  @apply relative;
}

.onion-skin img {
  @apply absolute inset-0 w-full h-auto object-contain;
}

.opacity-slider {
  @apply absolute bottom-4 left-1/2 -translate-x-1/2 w-48;
}

.split-mode {
  @apply relative;
}

.split-container {
  @apply relative overflow-hidden;
}

.split-old,
.clip-new {
  @apply w-full h-auto object-contain;
}

.split-new {
  @apply absolute inset-0;
  clip-path: inset(0 0 0 var(--split, 50%));
}

.split-handle {
  @apply absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize;
  @apply flex items-center justify-center -translate-x-1/2;
  @apply shadow-lg;
}

.handle-icon {
  @apply w-6 h-6 bg-white rounded-full flex items-center justify-center;
  @apply text-gray-600 text-xs shadow-md;
}

.viewer-info {
  @apply text-center text-sm;
}

.diff-stat {
  @apply font-medium text-gray-700 dark:text-gray-300;
}

.loading {
  @apply text-gray-500 dark:text-gray-400;
}
</style>
