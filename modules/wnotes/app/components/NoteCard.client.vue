<script setup lang="ts">
import type { Note } from '#shared/types'

const props = defineProps<{ note: Note }>()
const notesStore = useNotesStore()
const showContextMenu = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })

function _openContextMenu(event: MouseEvent) {
  event.preventDefault()
  showContextMenu.value = true
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
}

const closeContextMenu = () => {
  showContextMenu.value = false
}

const _contextOptions = [
  {
    label: 'Delete',
    action: () => {
      notesStore.deleteNote(props.note.id)
      const { $toast } = useNuxtApp()
      $toast.success('Note deleted successfully!')
      closeContextMenu()
    },
  },
]

const { render } = useMarkdownRenderer()

const _renderedContent = computedAsync(async () => {
  return await render(props.note.content)
}, '')
</script>

<template>
  <div
    class="group relative cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-all duration-200 ease-in-out hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    @click="notesStore.openEditor(note)" @contextmenu.prevent="_openContextMenu"
  >
    <h2 class="mb-2 truncate text-lg font-bold text-gray-800 dark:text-gray-100">{{ note.filename }}</h2>
    <div
      class="prose prose-sm text-gray-600 dark:prose-invert dark:text-gray-300 max-h-48 overflow-hidden"
      v-html="_renderedContent"
    ></div>
        <div class="mt-4 flex items-center justify-between text-xs text-gray-500">
      <div class="flex items-center gap-1">
        <div v-if="note.status === 'local'" class="i-mdi-cloud-upload-outline text-orange-500" title="Local changes"></div>
        <div v-else-if="note.status === 'syncing'" class="i-mdi-sync animate-spin" title="Syncing..."></div>
        <div v-else-if="note.status === 'synced'" class="i-mdi-cloud-check-outline text-green-500" title="Synced"></div>
        <span>{{ new Date(note.updatedAt).toLocaleDateString() }}</span>
      </div>
      <div class="flex gap-1">
        <span v-for="tag in note.tags?.slice(0, 2)" :key="tag" class="bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5">
          {{ tag }}
        </span>
      </div>
    </div>
    <div class="i-mdi-pencil absolute right-2 top-2 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100"></div>
    <ContextMenu
      v-if="showContextMenu"
      :style="{ top: `${contextMenuPosition.y}px`, left: `${contextMenuPosition.x}px` }"
      :options="_contextOptions"
      @close="closeContextMenu"
      class="fixed"
    />
  </div>
</template>
