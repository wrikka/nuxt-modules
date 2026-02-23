<script setup lang="ts">
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import * as Y from 'yjs'

const notesStore = useNotesStore()
const { selectedNote } = storeToRefs(notesStore)
const { $ydoc } = useNuxtApp()
const ydoc = $ydoc as Y.Doc

const modal = ref<HTMLElement | null>(null)
const localNote = ref<{ filename: string, content?: Y.XmlFragment } | null>(null)

watch(selectedNote, (note) => {
  if (note) {
    const yNote = ydoc.getMap('notes').get(note.id) as Y.Map<YNoteValue>
    if (yNote) {
      let content = yNote.get('content') as Y.XmlFragment
      if (!content) {
        content = new Y.XmlFragment()
        yNote.set('content', content)
      }
      localNote.value = {
        filename: yNote.get('filename') as string,
        content,
      }
    } else {
      // Handle new note case
      localNote.value = { filename: '' }
    }
  } else {
    localNote.value = null
  }
}, { immediate: true })

function closeModal() {
  notesStore.closeEditor()
}

function _saveNote() {
  if (selectedNote.value && localNote.value) {
    notesStore.updateNote({
      ...selectedNote.value,
      filename: localNote.value.filename,
      // Content is already synced via Yjs
    })
  } else if (localNote.value) {
    notesStore.addNote({ filename: localNote.value.filename, content: '' })
  }
  closeModal()
}

// Close modal on 'Escape' key press
onKeyStroke('Escape', closeModal)
// Close modal on click outside
onClickOutside(modal, closeModal)
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300 ease"
    leave-active-class="transition-opacity duration-300 ease"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="notesStore.isEditorOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div ref="modal" class="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">{{ selectedNote ? 'Edit Note' : 'New Note' }}</h2>
          <button
            @click="closeModal"
            class="rounded-full p-1 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <div class="i-mdi-close text-2xl"></div>
          </button>
        </div>
                <div v-if="localNote" class="flex flex-col gap-2 h-[70vh]">
          <input
            v-model="localNote.filename"
            type="text"
            placeholder="Filename.md"
            class="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <RichMarkdownEditor v-if="localNote.content" :ydoc="ydoc" :y-xml-fragment="localNote.content" />
        </div>
        <div class="mt-6 flex justify-end space-x-2">
          <button @click="closeModal" class="rounded px-4 py-2 bg-gray-200 transition hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">Cancel</button>
          <button @click="_saveNote" class="rounded px-4 py-2 bg-blue-500 text-white transition hover:bg-blue-600">Save</button>
        </div>
      </div>
    </div>
  </Transition>
</template>
