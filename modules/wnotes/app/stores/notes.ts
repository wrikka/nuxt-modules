import { defineStore } from 'pinia'
import * as Y from 'yjs'
import { v4 as uuidv4 } from 'uuid'
import type { Note } from '#shared/types'

export const useNotesStore = defineStore('notes', () => {
  const { $yNotes } = useNuxtApp()
  const yNotes = $yNotes as Y.Map<Y.Map<YNoteValue>>
  const notesMap = ref(new Map<string, Note>())

  // Function to convert Y.Map to a plain JS object
  const ymapToObject = (ymap: Y.Map<YNoteValue>): Note => {
    const obj = ymap.toJSON()
    // Convert Y.Array to plain array
    if (obj.tags) obj.tags = Array.from(obj.tags)
    if (obj.categories) obj.categories = Array.from(obj.categories)
    return obj as Note
  }

  // Sync Yjs map to local ref
  const syncNotes = () => {
    const newMap = new Map<string, Note>()
    yNotes.forEach((ymap, id) => {
      newMap.set(id, ymapToObject(ymap))
    })
    notesMap.value = newMap
  }

  // Initial sync and listen for changes
  yNotes.observeDeep(syncNotes)
  syncNotes() // Initial sync

  const notes = computed(() => Array.from(notesMap.value.values()).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()))

  const selectedNote = ref<Note | null>(null)
  const isEditorOpen = ref(false)

  function openEditor(note: Note | null = null) {
    selectedNote.value = note
    isEditorOpen.value = true
  }

  function closeEditor() {
    isEditorOpen.value = false
    selectedNote.value = null
  }

  function addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
    const id = uuidv4()
    const newNote: Note = {
      ...note,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'local',
    }
    const ymap = new Y.Map<YNoteValue>()
    Object.entries(newNote).forEach(([key, value]) => {
      if (key === 'tags' || key === 'categories') {
        const yarray = Y.Array.from(value as string[])
        ymap.set(key, yarray)
      } else {
        ymap.set(key, value)
      }
    })
    yNotes.set(id, ymap)
  }

  function updateNote(note: Note) {
    const ymap = yNotes.get(note.id)
    if (ymap) {
      Object.entries(note).forEach(([key, value]) => {
        if (key !== 'id') {
          ymap.set(key, value)
        }
      })
      ymap.set('updatedAt', new Date())
      ymap.set('status', 'local')
    }
  }

  function deleteNote(id: string) {
    yNotes.delete(id)
  }

  return { notes, selectedNote, isEditorOpen, openEditor, closeEditor, addNote, updateNote, deleteNote }
})
