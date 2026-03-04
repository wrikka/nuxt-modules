<template>
  <div class="image-editor space-y-4">
    <!-- Canvas Container -->
    <div class="relative bg-gray-900 rounded-lg overflow-hidden">
      <canvas
        ref="canvasRef"
        class="max-w-full mx-auto cursor-crosshair"
        :class="{ 'cursor-move': isDragging }"
        @mousedown="startDrag"
        @mousemove="drag"
        @mouseup="endDrag"
        @mouseleave="endDrag"
        @wheel="handleWheel"
      />

      <!-- Toolbar -->
      <div class="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2">
        <button
          @click="setTool('move')"
          :class="{ 'bg-blue-100 text-blue-700': currentTool === 'move' }"
          class="p-2 rounded hover:bg-gray-100 transition-colors"
          title="Move"
        >
          <Icon name="mdi:cursor-move" class="w-5 h-5" />
        </button>
        <button
          @click="setTool('crop')"
          :class="{ 'bg-blue-100 text-blue-700': currentTool === 'crop' }"
          class="p-2 rounded hover:bg-gray-100 transition-colors"
          title="Crop"
        >
          <Icon name="mdi:crop" class="w-5 h-5" />
        </button>
        <button
          @click="rotate(-90)"
          class="p-2 rounded hover:bg-gray-100 transition-colors"
          title="Rotate Left"
        >
          <Icon name="mdi:rotate-left" class="w-5 h-5" />
        </button>
        <button
          @click="rotate(90)"
          class="p-2 rounded hover:bg-gray-100 transition-colors"
          title="Rotate Right"
        >
          <Icon name="mdi:rotate-right" class="w-5 h-5" />
        </button>
        <button
          @click="flip('horizontal')"
          class="p-2 rounded hover:bg-gray-100 transition-colors"
          title="Flip Horizontal"
        >
          <Icon name="mdi:flip-horizontal" class="w-5 h-5" />
        </button>
        <button
          @click="flip('vertical')"
          class="p-2 rounded hover:bg-gray-100 transition-colors"
          title="Flip Vertical"
        >
          <Icon name="mdi:flip-vertical" class="w-5 h-5" />
        </button>
      </div>

      <!-- Zoom Controls -->
      <div class="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
        <button @click="zoomOut" class="p-2 rounded hover:bg-gray-100">
          <Icon name="mdi:magnify-minus" class="w-5 h-5" />
        </button>
        <span class="text-sm w-16 text-center">{{ Math.round(zoom * 100) }}%</span>
        <button @click="zoomIn" class="p-2 rounded hover:bg-gray-100">
          <Icon name="mdi:magnify-plus" class="w-5 h-5" />
        </button>
        <button @click="resetZoom" class="p-2 rounded hover:bg-gray-100 text-sm">
          Fit
        </button>
      </div>
    </div>

    <!-- Adjustments -->
    <div class="bg-gray-50 p-4 rounded-lg space-y-4">
      <h4 class="font-medium text-gray-700">ปรับแต่ง</h4>

      <!-- Brightness -->
      <div class="space-y-1">
        <div class="flex justify-between">
          <label class="text-sm">ความสว่าง</label>
          <span class="text-sm text-gray-500">{{ brightness }}%</span>
        </div>
        <input
          v-model.number="brightness"
          type="range"
          min="0"
          max="200"
          class="w-full"
          @input="applyFilters"
        />
      </div>

      <!-- Contrast -->
      <div class="space-y-1">
        <div class="flex justify-between">
          <label class="text-sm">ความคมชัด</label>
          <span class="text-sm text-gray-500">{{ contrast }}%</span>
        </div>
        <input
          v-model.number="contrast"
          type="range"
          min="0"
          max="200"
          class="w-full"
          @input="applyFilters"
        />
      </div>

      <!-- Saturation -->
      <div class="space-y-1">
        <div class="flex justify-between">
          <label class="text-sm">ความอิ่มตัวของสี</label>
          <span class="text-sm text-gray-500">{{ saturation }}%</span>
        </div>
        <input
          v-model.number="saturation"
          type="range"
          min="0"
          max="200"
          class="w-full"
          @input="applyFilters"
        />
      </div>

      <!-- Reset -->
      <button @click="resetAdjustments" class="text-sm text-blue-600 hover:text-blue-800">
        รีเซ็ตการปรับแต่ง
      </button>
    </div>

    <!-- Crop Controls -->
    <div v-if="currentTool === 'crop' && cropArea" class="bg-blue-50 p-4 rounded-lg">
      <h4 class="font-medium text-blue-700">การตัดภาพ</h4>
      <p class="text-sm text-blue-600 mb-3">ลากเพื่อเลือกพื้นที่ หรือใช้ขนาดคงที่</p>
      <div class="flex gap-2">
        <button
          v-for="ratio in cropRatios"
          :key="ratio.label"
          @click="setCropRatio(ratio.value)"
          class="px-3 py-1 text-sm border border-blue-200 rounded hover:bg-blue-100"
        >
          {{ ratio.label }}
        </button>
        <button @click="applyCrop" class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
          ตัดภาพ
        </button>
        <button @click="cancelCrop" class="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
          ยกเลิก
        </button>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-center gap-3">
      <button
        @click="resetAll"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
      >
        เริ่มใหม่
      </button>
      <button
        @click="saveImage"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
      >
        <Icon name="mdi:content-save" class="w-5 h-5" />
        บันทึก
      </button>
      <button
        @click="downloadImage"
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
      >
        <Icon name="mdi:download" class="w-5 h-5" />
        ดาวน์โหลด
      </button>
    </div>

    <!-- Format Selection -->
    <div class="flex items-center justify-center gap-4">
      <label class="text-sm">บันทึกเป็น:</label>
      <select v-model="outputFormat" class="px-3 py-1 border rounded">
        <option value="image/jpeg">JPEG</option>
        <option value="image/png">PNG</option>
        <option value="image/webp">WebP</option>
      </select>
      <input
        v-if="outputFormat === 'image/jpeg' || outputFormat === 'image/webp'"
        v-model.number="quality"
        type="range"
        min="1"
        max="100"
        class="w-24"
      />
      <span v-if="outputFormat === 'image/jpeg' || outputFormat === 'image/webp'" class="text-sm text-gray-500">
        {{ quality }}%
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

type Tool = 'move' | 'crop'
type CropRatio = { label: string; value: number | null }

interface Point {
  x: number
  y: number
}

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

const props = defineProps<{
  imageFile: File
}>()

const emit = defineEmits<{
  save: [file: File]
}>()

// Refs
const canvasRef = ref<HTMLCanvasElement>()
const currentTool = ref<Tool>('move')
const zoom = ref(1)
const isDragging = ref(false)
const dragStart = ref<Point>({ x: 0, y: 0 })
const imageOffset = ref<Point>({ x: 0, y: 0 })

// Adjustments
const brightness = ref(100)
const contrast = ref(100)
const saturation = ref(100)

// Crop
const cropArea = ref<CropArea | null>(null)
const cropRatios: CropRatio[] = [
  { label: 'Free', value: null },
  { label: '1:1', value: 1 },
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 }
]

// Output
const outputFormat = ref('image/jpeg')
const quality = ref(90)

// Image state
let originalImage: HTMLImageElement | null = null
let currentImage: HTMLImageElement | null = null
let rotation = 0
let flipH = 1
let flipV = 1

// Load image on mount
onMounted(() => {
  loadImage()
})

watch(() => props.imageFile, () => {
  loadImage()
})

const loadImage = () => {
  const img = new Image()
  img.onload = () => {
    originalImage = img
    currentImage = img
    resetAll()
  }
  img.src = URL.createObjectURL(props.imageFile)
}

const render = () => {
  if (!canvasRef.value || !currentImage) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Calculate canvas size based on zoom
  const width = currentImage.width * zoom.value
  const height = currentImage.height * zoom.value

  canvas.width = width
  canvas.height = height

  // Clear and save context
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save()

  // Apply transforms
  ctx.translate(width / 2 + imageOffset.value.x, height / 2 + imageOffset.value.y)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.scale(flipH * zoom.value, flipV * zoom.value)

  // Apply filters
  ctx.filter = `brightness(${brightness.value}%) contrast(${contrast.value}%) saturate(${saturation.value}%)`

  // Draw image centered
  ctx.drawImage(currentImage, -currentImage.width / 2, -currentImage.height / 2)

  ctx.restore()

  // Draw crop overlay
  if (cropArea.value && currentTool.value === 'crop') {
    ctx.save()
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.clearRect(cropArea.value.x, cropArea.value.y, cropArea.value.width, cropArea.value.height)

    // Draw crop border
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.strokeRect(cropArea.value.x, cropArea.value.y, cropArea.value.width, cropArea.value.height)
    ctx.restore()
  }
}

// Tool handlers
const setTool = (tool: Tool) => {
  currentTool.value = tool
  if (tool !== 'crop') {
    cropArea.value = null
  }
  render()
}

// Drag handlers
const startDrag = (e: MouseEvent) => {
  if (!canvasRef.value) return

  const rect = canvasRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  isDragging.value = true
  dragStart.value = { x, y }

  if (currentTool.value === 'crop') {
    cropArea.value = { x, y, width: 0, height: 0 }
  }
}

const drag = (e: MouseEvent) => {
  if (!isDragging.value || !canvasRef.value) return

  const rect = canvasRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  if (currentTool.value === 'move') {
    imageOffset.value.x += x - dragStart.value.x
    imageOffset.value.y += y - dragStart.value.y
    dragStart.value = { x, y }
    render()
  } else if (currentTool.value === 'crop' && cropArea.value) {
    cropArea.value.width = x - cropArea.value.x
    cropArea.value.height = y - cropArea.value.y
    render()
  }
}

const endDrag = () => {
  isDragging.value = false
}

const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  zoom.value = Math.max(0.1, Math.min(3, zoom.value + delta))
  render()
}

// Zoom handlers
const zoomIn = () => {
  zoom.value = Math.min(3, zoom.value + 0.25)
  render()
}

const zoomOut = () => {
  zoom.value = Math.max(0.1, zoom.value - 0.25)
  render()
}

const resetZoom = () => {
  zoom.value = 1
  imageOffset.value = { x: 0, y: 0 }
  render()
}

// Transform handlers
const rotate = (degrees: number) => {
  rotation = (rotation + degrees) % 360
  render()
}

const flip = (direction: 'horizontal' | 'vertical') => {
  if (direction === 'horizontal') {
    flipH *= -1
  } else {
    flipV *= -1
  }
  render()
}

// Adjustment handlers
const applyFilters = () => {
  render()
}

const resetAdjustments = () => {
  brightness.value = 100
  contrast.value = 100
  saturation.value = 100
  render()
}

// Crop handlers
const setCropRatio = (ratio: number | null) => {
  if (!cropArea.value || !canvasRef.value) return

  const canvas = canvasRef.value
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const size = Math.min(canvas.width, canvas.height) * 0.5

  if (ratio === null) {
    cropArea.value = {
      x: centerX - size / 2,
      y: centerY - size / 2,
      width: size,
      height: size
    }
  } else {
    const height = size
    const width = height * ratio
    cropArea.value = {
      x: centerX - width / 2,
      y: centerY - height / 2,
      width,
      height
    }
  }

  render()
}

const applyCrop = () => {
  if (!cropArea.value || !canvasRef.value || !currentImage) return

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Calculate actual crop coordinates based on zoom and offset
  const scaleX = currentImage.width / (canvasRef.value.width / zoom.value)
  const scaleY = currentImage.height / (canvasRef.value.height / zoom.value)

  const cropX = (cropArea.value.x - imageOffset.value.x - canvasRef.value.width / 2) * scaleX + currentImage.width / 2
  const cropY = (cropArea.value.y - imageOffset.value.y - canvasRef.value.height / 2) * scaleY + currentImage.height / 2
  const cropW = cropArea.value.width * scaleX
  const cropH = cropArea.value.height * scaleY

  canvas.width = Math.abs(cropW)
  canvas.height = Math.abs(cropH)

  ctx.filter = `brightness(${brightness.value}%) contrast(${contrast.value}%) saturate(${saturation.value}%)`
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.scale(flipH, flipV)
  ctx.drawImage(currentImage, -currentImage.width / 2 - cropX, -currentImage.height / 2 - cropY)

  const newImg = new Image()
  newImg.onload = () => {
    currentImage = newImg
    cropArea.value = null
    currentTool.value = 'move'
    resetZoom()
  }
  newImg.src = canvas.toDataURL()
}

const cancelCrop = () => {
  cropArea.value = null
  currentTool.value = 'move'
  render()
}

// Reset all
const resetAll = () => {
  if (!originalImage) return
  currentImage = originalImage
  rotation = 0
  flipH = 1
  flipV = 1
  resetZoom()
  resetAdjustments()
}

// Save handlers
const saveImage = () => {
  if (!canvasRef.value) return

  const dataUrl = canvasRef.value.toDataURL(outputFormat.value, quality.value / 100)

  fetch(dataUrl)
    .then(res => res.blob())
    .then(blob => {
      const extension = outputFormat.value.split('/')[1]
      const fileName = `edited_${Date.now()}.${extension}`
      const file = new File([blob], fileName, { type: outputFormat.value })
      emit('save', file)
    })
}

const downloadImage = () => {
  if (!canvasRef.value) return

  const link = document.createElement('a')
  link.download = `edited_${Date.now()}.${outputFormat.value.split('/')[1]}`
  link.href = canvasRef.value.toDataURL(outputFormat.value, quality.value / 100)
  link.click()
}
</script>
