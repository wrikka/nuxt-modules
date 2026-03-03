import Dexie, { type Table } from 'dexie'
import type { Note } from '#shared/types'

export class MySubClassedDexie extends Dexie {
  notes!: Table<Note>

  constructor() {
    super('myDatabase')
    this.version(1).stores({
      notes: '++id, filename, updatedAt, folderId, pinned, *tags, *categories', // Primary key and indexed props
    })
  }
}

export const db = new MySubClassedDexie()
