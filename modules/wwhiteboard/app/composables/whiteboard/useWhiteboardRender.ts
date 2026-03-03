import type { Ref } from 'vue'
import { createRenderLoop } from '~/composables/core/whiteboardRuntime'
import type { GpuClient } from '~/composables/core/whiteboardRuntime'
import type { WhiteboardState } from '../../../shared/types/whiteboard'
import type { WhiteboardMode } from '~/types/whiteboard'

export type UseWhiteboardRenderDeps = {
  ctx: Ref<CanvasRenderingContext2D | null>
  gpuClient: Ref<GpuClient | null>
  doc: Ref<WhiteboardState['doc']>
  ui: Ref<WhiteboardState['ui']>
  camera: Ref<WhiteboardState['camera']>
  cursors: Ref<WhiteboardState['cursors']>
  mode: Ref<WhiteboardMode>
  onEnsure2dReady: () => void
}

export function useWhiteboardRender(deps: UseWhiteboardRenderDeps) {
  const { ctx, gpuClient, doc, ui, camera, cursors, mode, onEnsure2dReady } = deps
  let hasLoggedFirstFrame = false

  const renderLoop = createRenderLoop({
    getCtx: () => ctx.value,
    getGpuClient: () => gpuClient.value,
    getState: () => ({
      doc: doc.value,
      ui: ui.value,
      camera: camera.value,
      cursors: cursors.value,
      pages: [], // These are not used by render loop, so we can mock them
      activePageId: '',
    }),
    onBeforeFrame: () => {
      if (mode.value !== '2d') return
      if (gpuClient.value) return
      if (ctx.value) return
      onEnsure2dReady()
    },
    onStarted: (info) => {
      if (import.meta.dev && !hasLoggedFirstFrame) {
        hasLoggedFirstFrame = true
        console.log('[whiteboard] renderLoop started', info)
      }
    },
  })

  return {
    startRenderLoop: renderLoop.start,
    stopRenderLoop: renderLoop.stop,
  }
}
