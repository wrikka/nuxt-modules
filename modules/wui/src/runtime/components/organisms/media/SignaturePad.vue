<script setup lang="ts">
interface Props {
  modelValue?: string
  width?: number
  height?: number
  penColor?: string
  backgroundColor?: string
  disabled?: boolean
  clearOnResize?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  width: 400,
  height: 200,
  penColor: '#000000',
  backgroundColor: '#ffffff',
  disabled: false,
  clearOnResize: true
})

const emit = defineEmits<{
  'update:modelValue': [signature: string]
  begin: []
  end: []
}>()

const canvasRef = ref<HTMLCanvasElement>()
const isDrawing = ref(false)
const hasSignature = ref(false)

onMounted(() => {
  initCanvas()
})

const initCanvas = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = props.width
  canvas.height = props.height

  ctx.fillStyle = props.backgroundColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = props.penColor
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

const getPos = (e: MouseEvent | TouchEvent) => {
  if (!canvasRef.value) return { x: 0, y: 0 }
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()

  if ('touches' in e) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    }
  }
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
}

const startDrawing = (e: MouseEvent | TouchEvent) => {
  if (props.disabled) return
  isDrawing.value = true
  hasSignature.value = true
  emit('begin')

  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) return

  const pos = getPos(e)
  ctx.beginPath()
  ctx.moveTo(pos.x, pos.y)
}

const draw = (e: MouseEvent | TouchEvent) => {
  if (!isDrawing.value || props.disabled) return

  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) return

  const pos = getPos(e)
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()
}

const stopDrawing = () => {
  if (!isDrawing.value) return
  isDrawing.value = false
  emit('end')
  saveSignature()
}

const saveSignature = () => {
  if (!canvasRef.value) return
  const dataUrl = canvasRef.value.toDataURL('image/png')
  emit('update:modelValue', dataUrl)
}

const clear = () => {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = props.backgroundColor
  ctx.fillRect(0, 0, props.width, props.height)

  ctx.strokeStyle = props.penColor
  hasSignature.value = false
  emit('update:modelValue', '')
}

defineExpose({ clear, saveSignature })
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white overflow-hidden">
    <div class="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
      <span class="text-sm font-medium text-gray-700">Signature</span>
      <Button size="sm" variant="ghost" @click="clear">
        <span class="i-lucide-trash-2 size-4 mr-1" />
        Clear
      </Button>
    </div>
    <canvas
      ref="canvasRef"
      class="block cursor-crosshair touch-none"
      :class="{ 'cursor-not-allowed opacity-50': disabled }"
      :width="width"
      :height="height"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
      @touchstart.prevent="startDrawing"
      @touchmove.prevent="draw"
      @touchend="stopDrawing"
    />
  </div>
</template>
