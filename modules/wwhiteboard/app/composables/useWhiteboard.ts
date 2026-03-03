import { provide, ref, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWhiteboardStore } from '../stores/whiteboard'
import type { Point, ToolId, UiSettings } from '../../shared/types/whiteboard'
import type { GpuClient } from './core/whiteboardRuntime'
import type { WhiteboardEngine, WhiteboardMode } from '~/types/whiteboard'
import { createWasmModeManager } from './whiteboard/createWasmModeManager'
import { useWhiteboardCanvas } from './whiteboard/useWhiteboardCanvas'
import { useWhiteboardInput } from './whiteboard/useWhiteboardInput'
import { useWhiteboardRender } from './whiteboard/useWhiteboardRender'

export type { WhiteboardEngine, WhiteboardMode } from '~/types/whiteboard'

export type UseWhiteboardApi = {
  canvasCssSize: Ref<{ width: number; height: number }>
  engine: Ref<WhiteboardEngine>
  mode: Ref<WhiteboardMode>
  setMode: (nextMode: WhiteboardMode) => Promise<unknown>
  autoRotate3d: Ref<boolean>
  reset3d: () => unknown
  toggleAutoRotate3d: () => unknown
  setTool: (tool: ToolId) => void
  setUiSettings: (patch: Partial<UiSettings>) => void
  removeShape: (id: ShapeId) => void
  clearSelection: () => void
  zoomAt: (screen: Point, delta: number) => void
  exportAsPng: (title: string) => void
}

export function useWhiteboard(canvasRef: Ref<globalThis.HTMLCanvasElement | null>): UseWhiteboardApi {
  const store = useWhiteboardStore()
  const { doc, ui, camera, cursors } = storeToRefs(store)
  const { setTool, setUiSettings, removeShape, clearSelection, zoomAt } = store

  function exportAsPng(title: string) {
    const canvas = canvasRef.value
    if (!canvas) {
      console.error('Canvas element not found for export.')
      return
    }

    const link = document.createElement('a')
    link.download = `${title.replace(/\s+/g, '_') || 'whiteboard'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const engine = ref<WhiteboardEngine>('fallback-2d')
  const mode = ref<WhiteboardMode>('2d')
  const autoRotate3d = ref(true)
  const gpuClient = ref<GpuClient | null>(null)
  let hasInitialized = false

  provide('gpuClient', gpuClient)

  const { rebindCanvas, bindInputEvents, unbindInputEvents } = useWhiteboardInput({
    canvasRef,
    doc,
    ui,
    camera,
    cursors,
    actions: store,
    gpuClient,
    onResize: () => {
      resizeCanvas()
      if (gpuClient.value) {
        const canvas = canvasRef.value
        if (!canvas) return
        gpuClient.value.resize(canvas.width, canvas.height)
      }
    },
  })

  const { canvasCssSize, ctx, ensure2dCanvasContext, resizeCanvas, recreateCanvasElement, ensure2dReady, initCanvas } =
    useWhiteboardCanvas({
      canvasRef,
      onRebindCanvas: rebindCanvas,
    })

  const { startRenderLoop, stopRenderLoop } = useWhiteboardRender({
    ctx,
    gpuClient,
    doc,
    ui,
    camera,
    cursors,
    mode,
    onEnsure2dReady: ensure2dReady,
  })

  const wasmManager = createWasmModeManager({
    canvasRef,
    mode,
    engine,
    autoRotate3d,
    ctx,
    gpuClient,
    ensure2dCanvasContext,
    ensure2dReady,
    resizeCanvas: () => {
      resizeCanvas()
    },
    recreateCanvasElement,
  })

  const init = async () => {
    if (hasInitialized) return
    hasInitialized = true

    await initCanvas()
    bindInputEvents()
    startRenderLoop()

    const params = new URLSearchParams(globalThis.location?.search ?? '')
    const disableWebGpu = params.get('webgpu') === '0'
    if (disableWebGpu) {
      wasmManager.markNotTryingWasm()
      engine.value = 'fallback-2d'
      ensure2dCanvasContext()
      return
    }

    const initialMode = (params.get('mode') === '3d' ? '3d' : '2d') as WhiteboardMode
    mode.value = initialMode

    if (initialMode === '2d') {
      wasmManager.markNotTryingWasm()
      engine.value = 'fallback-2d'
      ensure2dCanvasContext()
      return
    }

    await wasmManager.initWasmForInitialMode(initialMode)
  }

  onMounted(() => {
    init().catch((error) => {
      console.error('[whiteboard] init failed', error)
    })
  })

  onUnmounted(() => {
    stopRenderLoop()
    unbindInputEvents()
  })

  watch(canvasRef, (newCanvas: HTMLCanvasElement | null) => {
    if (newCanvas && !ctx.value) {
      init().catch((error) => {
        console.error('[whiteboard] init failed', error)
      })
    }
  })

  return {
    canvasCssSize,
    engine,
    mode,
    setMode: wasmManager.setMode,
    autoRotate3d,
    reset3d: wasmManager.reset3d,
    toggleAutoRotate3d: wasmManager.toggleAutoRotate3d,
    setTool,
    setUiSettings,
    removeShape,
    clearSelection,
    zoomAt,
    exportAsPng,
  }
}

