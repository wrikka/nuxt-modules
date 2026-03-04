export interface FolderEntry {
  name: string
  path: string
  file: File
  isDirectory: boolean
}

export async function readFolderContents(dataTransferItem: DataTransferItem): Promise<FolderEntry[]> {
  const entries: FolderEntry[] = []
  const entry = dataTransferItem.webkitGetAsEntry()

  if (!entry) {
    // Fallback to file if entry not available
    const file = dataTransferItem.getAsFile()
    if (file) {
      entries.push({
        name: file.name,
        path: file.name,
        file,
        isDirectory: false
      })
    }
    return entries
  }

  await traverseEntry(entry, '', entries)
  return entries
}

async function traverseEntry(
  entry: FileSystemEntry,
  path: string,
  entries: FolderEntry[]
): Promise<void> {
  const fullPath = path ? `${path}/${entry.name}` : entry.name

  if (entry.isFile) {
    const fileEntry = entry as FileSystemFileEntry
    const file = await new Promise<File>((resolve, reject) => {
      fileEntry.file(resolve, reject)
    })
    entries.push({
      name: entry.name,
      path: fullPath,
      file,
      isDirectory: false
    })
  } else if (entry.isDirectory) {
    const dirEntry = entry as FileSystemDirectoryEntry
    entries.push({
      name: entry.name,
      path: fullPath,
      file: new File([], entry.name, { type: 'inode/directory' }),
      isDirectory: true
    })

    const reader = dirEntry.createReader()
    const readEntries = (): Promise<FileSystemEntry[]> => {
      return new Promise((resolve, reject) => {
        reader.readEntries(resolve, reject)
      })
    }

    let batch: FileSystemEntry[]
    do {
      batch = await readEntries()
      for (const childEntry of batch) {
        await traverseEntry(childEntry, fullPath, entries)
      }
    } while (batch.length > 0)
  }
}

export async function handleFolderDrop(
  event: DragEvent,
  onProgress?: (current: number, total: number) => void
): Promise<FolderEntry[]> {
  event.preventDefault()

  const items = event.dataTransfer?.items
  if (!items) return []

  const allEntries: FolderEntry[] = []
  const total = items.length

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.kind === 'file') {
      const entries = await readFolderContents(item)
      allEntries.push(...entries)
      onProgress?.(i + 1, total)
    }
  }

  return allEntries
}

export function getFolderStructure(entries: FolderEntry[]): string[] {
  const folders = new Set<string>()

  for (const entry of entries) {
    const parts = entry.path.split('/')
    parts.pop() // Remove filename
    let currentPath = ''
    for (const part of parts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part
      folders.add(currentPath)
    }
  }

  return Array.from(folders).sort()
}

export function flattenFolderEntries(entries: FolderEntry[]): File[] {
  return entries.filter(e => !e.isDirectory).map(e => {
    // Create new File with path metadata
    return new File([e.file], e.path, { type: e.file.type })
  })
}
