import { readonly, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export interface QuickNote {
  id: string
  content: string
  createdAt: number
  updatedAt: number
  tags: string[]
  pinned?: boolean
}

/**
 * Quick Notes - Take notes directly from palette
 */
export function useQuickNotes() {
  const notes = useLocalStorage<QuickNote[]>('palette:quick-notes', [])
  const isEditing = ref(false)
  const currentNote = ref<QuickNote | null>(null)

  const createNote = (content: string, tags: string[] = []): QuickNote => {
    const note: QuickNote = {
      id: `note-${Date.now()}`,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags,
      pinned: false
    }
    notes.value = [note, ...notes.value]
    return note
  }

  const updateNote = (id: string, updates: Partial<Omit<QuickNote, 'id' | 'createdAt'>>): boolean => {
    const index = notes.value.findIndex(n => n.id === id)
    if (index === -1) return false

    notes.value[index] = {
      ...notes.value[index],
      ...updates,
      updatedAt: Date.now()
    }
    return true
  }

  const deleteNote = (id: string): boolean => {
    const initialLength = notes.value.length
    notes.value = notes.value.filter(n => n.id !== id)
    return notes.value.length < initialLength
  }

  const pinNote = (id: string, pinned = true): boolean => {
    return updateNote(id, { pinned })
  }

  const searchNotes = (query: string): QuickNote[] => {
    const q = query.toLowerCase()
    return notes.value.filter(n =>
      n.content.toLowerCase().includes(q) ||
      n.tags.some(t => t.toLowerCase().includes(q))
    )
  }

  const getPinnedNotes = (): QuickNote[] => {
    return notes.value.filter(n => n.pinned)
  }

  const getRecentNotes = (count = 5): QuickNote[] => {
    return notes.value
      .filter(n => !n.pinned)
      .slice(0, count)
  }

  const copyToClipboard = async (note: QuickNote): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(note.content)
      return true
    }
    catch {
      return false
    }
  }

  const exportNotes = (): string => {
    return JSON.stringify(notes.value, null, 2)
  }

  const importNotes = (json: string): boolean => {
    try {
      const imported = JSON.parse(json) as QuickNote[]
      notes.value = [...imported, ...notes.value]
      return true
    }
    catch {
      return false
    }
  }

  return {
    notes: readonly(notes),
    isEditing: readonly(isEditing),
    currentNote: readonly(currentNote),
    createNote,
    updateNote,
    deleteNote,
    pinNote,
    searchNotes,
    getPinnedNotes,
    getRecentNotes,
    copyToClipboard,
    exportNotes,
    importNotes
  }
}
