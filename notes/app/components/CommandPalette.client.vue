<script setup lang="ts">
import type { Note } from '#shared/types'

const commandPalette = useCommandPalette()
const notesStore = useNotesStore()
const { render } = useMarkdownRenderer()

const palette = ref<HTMLElement | null>(null)
const searchQuery = ref('')
const selectedNote = ref<Note | null>(null)

const filteredNotes = computed(() => {
  if (!searchQuery.value) {
    return notesStore.notes
  }
  return notesStore.notes.filter(
    note =>
      note.filename.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const _renderedPreview = computedAsync(async () => {
  if (selectedNote.value) {
    return await render(selectedNote.value.content)
  }
  return ''
}, '')

watch(filteredNotes, (notes) => {
  if (notes.length > 0) {
    selectedNote.value = notes[0] ?? null
  } else {
    selectedNote.value = null
  }
}, { immediate: true })

onClickOutside(palette, commandPalette.close)
function _handleKeyDown(event: KeyboardEvent) {
  if (!selectedNote.value || filteredNotes.value.length === 0) return

  const currentIndex = filteredNotes.value.findIndex(note => note.id === selectedNote.value?.id)

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    const nextIndex = (currentIndex + 1) % filteredNotes.value.length
    selectedNote.value = filteredNotes.value[nextIndex] ?? null
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    const prevIndex = (currentIndex - 1 + filteredNotes.value.length) % filteredNotes.value.length
    selectedNote.value = filteredNotes.value[prevIndex] ?? null
  } else if (event.key === 'Enter') {
    event.preventDefault()
    notesStore.openEditor(selectedNote.value)
    commandPalette.close()
  }
}

onKeyStroke('Escape', commandPalette.close)
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200 ease-out"
    leave-active-class="transition-opacity duration-200 ease-in"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div v-if="commandPalette.isOpen" class="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20 backdrop-blur-sm">
      <div ref="palette" class="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-black/5 dark:bg-gray-800">
        <div class="relative">
          <div class="i-mdi-magnify pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"></div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search notes..."
            class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 dark:text-gray-100 focus:ring-0 sm:text-sm"
            @keydown="_handleKeyDown"
          />
        </div>
        <div class="grid grid-cols-2 border-t border-gray-200 dark:border-gray-700 h-[50vh]">
          <ul class="overflow-y-auto p-2">
            <li
              v-for="note in filteredNotes"
              :key="note.id"
              class="cursor-pointer rounded-md p-2"
              :class="{ 'bg-blue-500 text-white': selectedNote?.id === note.id }"
              @mouseover="selectedNote = note"
              @click="notesStore.openEditor(note); commandPalette.close()"
            >
              <div class="font-semibold">{{ note.filename }}</div>
              <div class="text-sm opacity-75 line-clamp-1">{{ note.content }}</div>
            </li>
          </ul>
          <div class="prose dark:prose-invert overflow-y-auto border-l border-gray-200 p-4 dark:border-gray-700" v-html="_renderedPreview"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>
