<script setup lang="ts">
const notesStore = useNotesStore()
const searchQuery = ref('')

const _filteredNotes = computed(() => {
  if (!searchQuery.value) {
    return notesStore.notes
  }
  return notesStore.notes.filter(note => 
    note.filename.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<template>
  <div class="p-4">
        <Toolbar v-model="searchQuery" />
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">My Notes</h1>
      <button @click="notesStore.openEditor()" class="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
        <div class="i-mdi-plus"></div>
        New Note
      </button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <NoteCard v-for="note in _filteredNotes" :key="note.id" :note="note" />
    </div>
    <LazyNoteEditorModal />
  </div>
</template>
