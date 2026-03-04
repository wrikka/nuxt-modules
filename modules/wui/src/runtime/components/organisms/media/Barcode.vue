<script setup lang="ts">
interface Props {
  value: string
  format?: 'CODE128' | 'EAN' | 'EAN13' | 'EAN8' | 'UPC' | 'UPCE' | 'CODE39'
  width?: number
  height?: number
  displayValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  format: 'CODE128',
  width: 2,
  height: 100,
  displayValue: true
})

const canvasRef = ref<HTMLCanvasElement>()

// Simple barcode rendering using canvas
onMounted(() => {
  if (!canvasRef.value || !props.value) return
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return
  
  const canvas = canvasRef.value
  canvas.width = props.value.length * props.width * 10
  canvas.height = props.height + (props.displayValue ? 20 : 0)
  
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Draw simple barcode pattern (for CODE128 simulation)
  ctx.fillStyle = 'black'
  let x = 10
  for (let i = 0; i < props.value.length; i++) {
    const char = props.value.charCodeAt(i)
    const barWidth = (char % 5 + 1) * props.width
    const spaceWidth = ((char >> 3) % 3 + 1) * props.width
    
    ctx.fillRect(x, 0, barWidth, props.height)
    x += barWidth + spaceWidth
  }
  
  if (props.displayValue) {
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(props.value, canvas.width / 2, props.height + 15)
  }
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="rounded-lg"
  />
</template>
