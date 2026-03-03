import type * as Y from 'yjs'

export type SyncStatus = 'local' | 'syncing' | 'synced' | 'error'

export type YNoteValue = string | number | boolean | Date | Y.Array<string> | Y.XmlFragment | null | undefined

export interface Note {
  id: string
  filename: string
  content: string
  createdAt: Date
  updatedAt: Date
  // New fields
  categories?: string[]
  tags?: string[]
  pinned?: boolean
  folderId?: string | null
  status?: SyncStatus
}
