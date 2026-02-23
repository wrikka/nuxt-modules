import * as Y from 'yjs'
import type { Note } from '#shared/types'

export const useInitialSync = () => {
  const { $yNotes } = useNuxtApp()
  const yNotes = $yNotes as Y.Map<Y.Map<YNoteValue>>

  onMounted(async () => {
    // Sync only if the local database is empty
    if (yNotes.size === 0) {
      console.log('Performing initial sync from server...')
      const { data: serverNotes } = await useFetch<Note[]>('/api/notes')

      if (serverNotes.value) {
        serverNotes.value.forEach((note) => {
          const ymap = new Y.Map<YNoteValue>()
          Object.entries(note).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              ymap.set(key, Y.Array.from(value))
            } else {
              ymap.set(key, value as YNoteValue)
            }
          })
          yNotes.set(note.id, ymap)
        })
        console.log(`Synced ${serverNotes.value.length} notes from server.`)
      }
    }
  })
}
