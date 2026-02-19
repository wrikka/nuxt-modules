<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useCommandPaletteToggle } from './composables/facade/useCommandPaletteToggle'
import { useContextMenu } from './composables/facade/useContextMenu'
import { useAppCommands } from './composables/facade/useAppCommands'
import { useChatbot } from './composables/facade/useChatbot'
import { useWhiteboardPages } from './composables/facade/useWhiteboardPages'
import { useWhiteboardTemplates } from './composables/facade/useWhiteboardTemplates'
import { useWhiteboard } from '~/composables/useWhiteboard'
import RemoteCursors from '~/components/RemoteCursors.vue'
import TextEditor from '~/components/TextEditor.vue'
import CommentThread from '~/components/CommentThread.vue'
import { useWhiteboardStore } from '~/stores/whiteboard'
import { useHistoryStore } from '~/stores/history'

const canvas = ref<globalThis.HTMLCanvasElement | null>(null)
const store = useWhiteboardStore()
const historyStore = useHistoryStore()
const { doc, ui, camera, cursors } = storeToRefs(store)
const whiteboardApi = useWhiteboard(canvas)
const { setTool, setUiSettings, canvasCssSize, engine, mode, setMode, autoRotate3d, reset3d, toggleAutoRotate3d, zoomAt, exportAsPng } = whiteboardApi

const { pages, activePageId, activeTitle, switchToPage, addPage, renameActivePage } = useWhiteboardPages(store)
const { addPageFromTemplate } = useWhiteboardTemplates(store)

const { chatbotOpen, toggleChatbot, closeChatbot } = useChatbot()

const { ctxMenuOpen, ctxMenuX, ctxMenuY, contextMenuItems, onCanvasContextMenu, closeContextMenu, deleteSelected } =
  useContextMenu(store, whiteboardApi)


const canvasCursor =
  'url("data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20width=\'10\'%20height=\'10\'%20viewBox=\'0%200%2010%2010\'%3E%3Ccircle%20cx=\'5\'%20cy=\'5\'%20r=\'2.2\'%20fill=\'%23111827\'/%3E%3Ccircle%20cx=\'5\'%20cy=\'5\'%20r=\'3.6\'%20fill=\'none\'%20stroke=\'white\'%20stroke-width=\'1\'/%3E%3C/svg%3E") 5 5, auto'

const cmd = useCommandPaletteToggle()

const cmdOpen = computed(() => cmd.open.value)
const closeCommandPalette = cmd.close

const { commandItems } = useAppCommands(store, whiteboardApi, { deleteSelected })

onMounted(async () => {
  await store.initializeStore()

  // Mock remote cursor movement
  setInterval(() => {
    const cursor = cursors.value['mock-user-1']
    if (cursor) {
      store.setCursor({
        ...cursor,
        x: cursor.x + Math.random() * 20 - 10,
        y: cursor.y + Math.random() * 20 - 10,
      })
    }
  }, 1000)
})

const { canUndo, canRedo } = storeToRefs(historyStore)
const { undo, redo, removePage, togglePresentationMode, loadDoc } = store
</script>

<template>
  <NuxtLayout name="fullscreen">
    <div class="h-full w-full overflow-hidden bg-gray-50">
      <TopBar v-if="!ui.presentationMode"
        :engine="engine"
        :mode="mode"
        :title="activeTitle"
        :doc="doc"
        :settings="ui.settings"
        :chatbot-open="chatbotOpen"
        :can-undo="canUndo"
        :can-redo="canRedo"
        class="absolute top-0 left-0 right-0 z-20"
        @mode="setMode"
        @rename="renameActivePage"
        @settings="setUiSettings"
        @toggle-chatbot="toggleChatbot"
        @undo="undo"
        @redo="redo"
        @template="addPageFromTemplate"
        @toggle-presentation="togglePresentationMode"
        @export="exportAsPng"
        @load="loadDoc"
      />

      <div class="absolute inset-0 pt-14">
        <div class="absolute inset-0 flex">
          <PagesSidebar v-if="!ui.presentationMode"
            class="h-full"
            :pages="pages"
            :active-page-id="activePageId"
            @select="switchToPage"
            @add="addPage"
            @remove="removePage"
          />

          <div class="relative flex-1">
            <canvas
              ref="canvas"
              id="whiteboard-canvas"
              class="absolute inset-0 w-full h-full touch-none"
              :style="{ cursor: canvasCursor }"
              @contextmenu="onCanvasContextMenu"
            />

            <RemoteCursors :cursors="cursors" :camera="camera" />

            <TextEditor />

            <CommentThread
              v-for="comment in doc.comments"
              :key="comment.id"
              :comment="comment"
              :style="{
                position: 'absolute',
                left: `${(comment.x * camera.zoom) + camera.x}px`,
                top: `${(comment.y * camera.zoom) + camera.y}px`,
                transform: 'translate(-50%, -100%)',
              }"
            />

            <CanvasContextMenu
              :open="ctxMenuOpen"
              :x="ctxMenuX"
              :y="ctxMenuY"
              :items="contextMenuItems"
              @close="closeContextMenu"
            />

            <CommandPalette
              :open="cmdOpen"
              :items="commandItems"
              @close="closeCommandPalette"
            />

            <div class="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
              <ToolBar v-if="!ui.presentationMode"
                :state="{ doc, ui, camera, cursors }"
                :mode="mode"
                :auto-rotate3d="autoRotate3d"
                @tool="setTool"
                @settings="setUiSettings"
                @reset3d="reset3d"
                @toggleAutoRotate3d="toggleAutoRotate3d"
              />
            </div>

            <div class="absolute bottom-5 right-5 z-20">
              <Minimap :doc="doc" :camera="camera" :canvas-size="canvasCssSize" />
            </div>
          </div>

          <ChatbotPanel :open="chatbotOpen" @close="closeChatbot" />

          <button
            v-if="ui.presentationMode"
            class="absolute bottom-5 right-5 z-20 p-2 rounded-lg bg-white/90 backdrop-blur border border-gray-200 shadow-lg hover:bg-gray-100 text-gray-700"
            type="button"
            title="Exit Presentation"
            @click="togglePresentationMode"
          >
            <Icon name="mdi:exit-to-app" class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>