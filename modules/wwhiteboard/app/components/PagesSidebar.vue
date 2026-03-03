<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { render } from '../utils/whiteboard/renderer'
import { getDocBounds } from '../utils/whiteboard/geometry'
import type { Camera, Shape, WhiteboardDoc } from '../../shared/types/whiteboard'

export type PageModel = {
  id: string
  name: string
  doc: WhiteboardDoc
  camera: Camera
}

const props = defineProps<{
  pages: ReadonlyArray<PageModel>
  activePageId: string
}>()

const emit = defineEmits<{
  (e: 'select', pageId: string): unknown
  (e: 'add'): unknown
  (e: 'remove', pageId: string): unknown
}>()

const previewCanvasById = new Map<string, HTMLCanvasElement>()
let scheduled = -1

const activeIndex = computed(() => props.pages.findIndex((p) => p.id === props.activePageId))

const computePreviewCamera = (doc: WhiteboardDoc, cssW: number, cssH: number): Camera => {
  const b = getDocBounds(doc)
  if (!b) {
    return { x: cssW / 2, y: cssH / 2, zoom: 1 }
  }

  const zoom = Math.min(cssW / b.w, cssH / b.h)
  const centerX = b.x + b.w / 2
  const centerY = b.y + b.h / 2

  return {
    zoom,
    x: cssW / 2 - centerX * zoom,
    y: cssH / 2 - centerY * zoom,
  }
}

const drawPreviews = async () => {
  await nextTick()

  const dpr = globalThis.devicePixelRatio || 1
  const cssW = 160
  const cssH = 100

  for (const p of props.pages) {
    const canvas = previewCanvasById.get(p.id)
    if (!canvas) continue

    canvas.width = Math.floor(cssW * dpr)
    canvas.height = Math.floor(cssH * dpr)
    canvas.style.width = `${cssW}px`
    canvas.style.height = `${cssH}px`

    const ctx = canvas.getContext('2d')
    if (!ctx) continue

    const cam = computePreviewCamera(p.doc, cssW, cssH)
    render(
      ctx,
      p.doc,
      cam,
      {
        background: '#ffffff',
        showGrid: false,
      },
      [],
      null,
    )
  }
}

const scheduleDraw = () => {
  if (scheduled !== -1) return
  scheduled = requestAnimationFrame(() => {
    scheduled = -1
    drawPreviews().catch((error) => {
      console.error('[pages] preview draw failed', error)
    })
  })
}

onBeforeUnmount(() => {
  if (scheduled !== -1) cancelAnimationFrame(scheduled)
  scheduled = -1
})

watch(
  () => props.pages,
  () => {
    scheduleDraw()
  },
  { deep: true },
)

watch(
  () => props.activePageId,
  () => {
    scheduleDraw()
  },
)

const setPreviewRef = (pageId: string) => (el: Element | ComponentPublicInstance | null) => {
  if (!el) {
    previewCanvasById.delete(pageId)
    return
  }

  if (!(el instanceof HTMLCanvasElement)) return
  previewCanvasById.set(pageId, el)
  scheduleDraw()
}
</script>

<template>
  <aside class="pointer-events-auto h-full w-[240px] bg-white/90 backdrop-blur border-r border-gray-200 flex flex-col">
    <div class="h-14 px-3 flex items-center justify-between border-b border-gray-200">
      <div class="text-sm font-medium text-gray-900">Pages</div>
      <button
        class="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100"
        type="button"
        title="New page"
        @click="emit('add')"
      >
        <Icon name="mdi:plus" class="w-5 h-5 text-gray-700" />
      </button>
    </div>

    <div class="flex-1 overflow-auto p-2">
      <button
        v-for="(p, idx) in pages"
        :key="p.id"
        class="w-full mb-2 rounded-xl border text-left overflow-hidden group"
        :class="p.id === activePageId ? 'border-blue-300 ring-2 ring-blue-100 bg-blue-50/40' : 'border-gray-200 hover:bg-gray-50'"
        type="button"
        @click="emit('select', p.id)"
      >
        <div class="p-2">
          <div class="flex items-center gap-2">
            <div class="text-xs text-gray-500 w-6 text-right">{{ idx + 1 }}</div>
            <div class="text-sm font-medium text-gray-900 truncate">{{ p.name }}</div>
            <div class="flex-1" />
            <button class="w-6 h-6 rounded-md hover:bg-gray-200 text-gray-500 hover:text-gray-800 opacity-0 group-hover:opacity-100" type="button" @click.stop="emit('remove', p.id)">
              <Icon name="mdi:close" class="w-4 h-4" />
            </button>
            <div v-if="idx === activeIndex" class="text-[11px] text-blue-700 w-12 text-right">Active</div>
          </div>

          <div class="mt-2 rounded-lg border border-gray-200 bg-white">
            <canvas :ref="setPreviewRef(p.id)" class="block" />
          </div>
        </div>
      </button>
    </div>
  </aside>
</template>
