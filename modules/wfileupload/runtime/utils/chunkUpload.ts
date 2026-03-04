export interface ChunkUploadOptions {
  chunkSize?: number
  parallelChunks?: number
  retryAttempts?: number
  retryDelay?: number
  onChunkProgress?: (chunkIndex: number, totalChunks: number, progress: number) => void
  onChunkComplete?: (chunkIndex: number) => void
  onChunkError?: (chunkIndex: number, error: Error) => void
}

export interface ChunkInfo {
  index: number
  start: number
  end: number
  data: Blob
  uploaded: boolean
  attempts: number
  checksum?: string
}

export interface ResumableUploadState {
  fileId: string
  fileName: string
  fileSize: number
  mimeType: string
  totalChunks: number
  completedChunks: number
  chunks: ChunkInfo[]
  uploadUrl?: string
  createdAt: number
  updatedAt: number
}

export const STORAGE_KEY = 'wfileupload_resumable'

export function generateFileId(file: File): string {
  return `${file.name}_${file.size}_${file.lastModified}_${Date.now()}`
}

export function calculateChunks(file: File, chunkSize: number): ChunkInfo[] {
  const chunks: ChunkInfo[] = []
  const totalChunks = Math.ceil(file.size / chunkSize)

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    chunks.push({
      index: i,
      start,
      end,
      data: file.slice(start, end),
      uploaded: false,
      attempts: 0
    })
  }

  return chunks
}

export async function calculateChecksum(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export function saveResumableState(state: ResumableUploadState): void {
  try {
    const existing = getResumableStates()
    const index = existing.findIndex(s => s.fileId === state.fileId)
    if (index >= 0) {
      existing[index] = { ...state, updatedAt: Date.now() }
    } else {
      existing.push({ ...state, updatedAt: Date.now() })
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
  } catch {
    // Ignore storage errors
  }
}

export function getResumableStates(): ResumableUploadState[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const states = JSON.parse(stored) as ResumableUploadState[]
    // Filter out expired states (7 days old)
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    return states.filter(s => s.updatedAt > weekAgo)
  } catch {
    return []
  }
}

export function getResumableState(fileId: string): ResumableUploadState | undefined {
  return getResumableStates().find(s => s.fileId === fileId)
}

export function removeResumableState(fileId: string): void {
  try {
    const states = getResumableStates().filter(s => s.fileId !== fileId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states))
  } catch {
    // Ignore storage errors
  }
}

export function cleanupExpiredStates(): void {
  const states = getResumableStates()
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states))
  } catch {
    // Ignore storage errors
  }
}
