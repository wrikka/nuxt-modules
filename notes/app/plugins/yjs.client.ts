import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'

export default defineNuxtPlugin(() => {
  const ydoc = new Y.Doc()
  new IndexeddbPersistence('notes-db', ydoc)

  const yNotes = ydoc.getMap<Y.Map<YNoteValue>>('notes')

  return {
    provide: {
      ydoc,
      yNotes,
    },
  }
})
