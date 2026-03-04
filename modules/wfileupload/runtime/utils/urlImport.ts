export interface URLImportOptions {
  maxSize?: number
  timeout?: number
  allowedTypes?: string[]
  onProgress?: (loaded: number, total: number) => void
}

export interface URLImportResult {
  success: boolean
  file?: File
  error?: string
  originalUrl: string
  fileName: string
  fileSize: number
  mimeType: string
}

export async function importFromURL(
  url: string,
  options: URLImportOptions = {}
): Promise<URLImportResult> {
  const { maxSize = 100 * 1024 * 1024, timeout = 30000, allowedTypes = [], onProgress } = options

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': '*/*'
      }
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        originalUrl: url,
        fileName: '',
        fileSize: 0,
        mimeType: ''
      }
    }

    const contentLength = response.headers.get('content-length')
    const total = contentLength ? parseInt(contentLength, 10) : 0

    if (total > maxSize) {
      return {
        success: false,
        error: `File size (${formatBytes(total)}) exceeds maximum (${formatBytes(maxSize)})`,
        originalUrl: url,
        fileName: '',
        fileSize: total,
        mimeType: response.headers.get('content-type') || ''
      }
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream'

    if (allowedTypes.length > 0 && !allowedTypes.some(type => contentType.includes(type))) {
      return {
        success: false,
        error: `Content type ${contentType} not allowed`,
        originalUrl: url,
        fileName: '',
        fileSize: 0,
        mimeType: contentType
      }
    }

    // Get filename from URL or Content-Disposition header
    let fileName = getFilenameFromURL(url)
    const disposition = response.headers.get('content-disposition')
    if (disposition) {
      const match = disposition.match(/filename[^;=\n]*=(["']?)([^"';\n]*)\1/)
      if (match) {
        fileName = match[2]
      }
    }

    if (!fileName) {
      fileName = `download_${Date.now()}`
    }

    // Read response with progress tracking
    const blob = await readResponseWithProgress(response, total, onProgress)

    const file = new File([blob], fileName, { type: contentType })

    return {
      success: true,
      file,
      originalUrl: url,
      fileName,
      fileSize: file.size,
      mimeType: contentType
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to import file',
      originalUrl: url,
      fileName: '',
      fileSize: 0,
      mimeType: ''
    }
  }
}

async function readResponseWithProgress(
  response: Response,
  total: number,
  onProgress?: (loaded: number, total: number) => void
): Promise<Blob> {
  if (!response.body || !total) {
    return response.blob()
  }

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let received = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    chunks.push(value)
    received += value.length
    onProgress?.(received, total)
  }

  // Combine chunks
  const allChunks = new Uint8Array(received)
  let position = 0
  for (const chunk of chunks) {
    allChunks.set(chunk, position)
    position += chunk.length
  }

  return new Blob([allChunks])
}

function getFilenameFromURL(url: string): string {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const segments = pathname.split('/')
    const lastSegment = segments[segments.length - 1]
    return lastSegment ? decodeURIComponent(lastSegment) : ''
  } catch {
    return ''
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / k ** i).toFixed(2)) + ' ' + sizes[i]
}

export function isValidURL(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

export async function importFromURLs(
  urls: string[],
  options: URLImportOptions = {}
): Promise<URLImportResult[]> {
  const results = await Promise.all(
    urls.filter(isValidURL).map(url => importFromURL(url, options))
  )
  return results
}
