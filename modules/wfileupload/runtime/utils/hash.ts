export async function calculateFileHash(file: File, algorithm: 'SHA-256' | 'SHA-1' | 'MD5' = 'SHA-256'): Promise<string> {
  const buffer = await file.arrayBuffer()

  let digest: ArrayBuffer
  switch (algorithm) {
    case 'SHA-1':
      digest = await crypto.subtle.digest('SHA-1', buffer)
      break
    case 'SHA-256':
      digest = await crypto.subtle.digest('SHA-256', buffer)
      break
    default:
      throw new Error(`Unsupported hash algorithm: ${algorithm}`)
  }

  const hashArray = Array.from(new Uint8Array(digest))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function calculatePartialHash(file: File, bytes: number = 1024 * 1024): Promise<string> {
  const partial = file.slice(0, Math.min(bytes, file.size))
  return calculateFileHash(new File([partial], file.name, { type: file.type }), 'SHA-256')
}

export interface DuplicateChecker {
  seenHashes: Set<string>
  check(file: File): Promise<{ isDuplicate: boolean; hash: string }>
  add(hash: string): void
  clear(): void
}

export function createDuplicateChecker(): DuplicateChecker {
  const seenHashes = new Set<string>()

  return {
    seenHashes,
    async check(file: File): Promise<{ isDuplicate: boolean; hash: string }> {
      // Use combination of name, size, and partial hash for quick check
      const quickHash = `${file.name}_${file.size}_${await calculatePartialHash(file, 64 * 1024)}`

      if (seenHashes.has(quickHash)) {
        return { isDuplicate: true, hash: quickHash }
      }

      // Full hash check for more accuracy
      const fullHash = await calculateFileHash(file)
      if (seenHashes.has(fullHash)) {
        return { isDuplicate: true, hash: fullHash }
      }

      return { isDuplicate: false, hash: fullHash }
    },
    add(hash: string): void {
      seenHashes.add(hash)
    },
    clear(): void {
      seenHashes.clear()
    }
  }
}

export function generateContentHash(content: string): string {
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}
