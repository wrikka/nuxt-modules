import { inject, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWhiteboardStore } from '~/stores/whiteboard'
import { createId } from '~/utils/whiteboard/tools'
import type { GpuClient } from '~/composables/core/whiteboardRuntime'

export function useImageUpload() {
  const store = useWhiteboardStore()
  const gpuClient = inject<Ref<GpuClient | null>>('gpuClient')
  const { camera } = storeToRefs(store)

  const openImageDialog = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) return

      if (gpuClient?.value) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer
          if (arrayBuffer) {
            const imageBytes = new Uint8Array(arrayBuffer)
            gpuClient.value?.add_textured_quad?.(imageBytes)
          }
        }
        reader.readAsArrayBuffer(file)
      } else {
        const reader = new FileReader()
        reader.onload = (e) => {
          const src = e.target?.result as string
          if (src) {
            const img = new Image()
            img.onload = () => {
              const { width, height } = img
                            const centerX = (window.innerWidth / 2 - camera.value.x) / camera.value.zoom
              const centerY = (window.innerHeight / 2 - camera.value.y) / camera.value.zoom

              const aspectRatio = width / height
              const newWidth = 200
              const newHeight = newWidth / aspectRatio

              store.addShape({
                id: createId(),
                type: 'image',
                src,
                x: centerX - newWidth / 2,
                y: centerY - newHeight / 2,
                w: newWidth,
                h: newHeight,
                stroke: 'transparent',
                fill: null,
                strokeWidth: 0,
              })
            }
            img.src = src
          }
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  return {
    openImageDialog,
  }
}
