import type { DiffChunk, DiffLine } from '../types'

export interface StreamingOptions {
  chunkSize?: number
  delayMs?: number
  onProgress?: (progress: number) => void
  onChunk?: (chunk: DiffChunk) => void
  signal?: AbortSignal
}

export interface PaginatedResult {
  chunks: DiffChunk[]
  totalChunks: number
  currentPage: number
  totalPages: number
  hasMore: boolean
}

export class StreamingDiffProcessor {
  private chunkSize: number
  private delayMs: number
  private abortSignal?: AbortSignal

  constructor(options: StreamingOptions = {}) {
    this.chunkSize = options.chunkSize ?? 100
    this.delayMs = options.delayMs ?? 0
    this.abortSignal = options.signal
  }

  /**
   * Process large files in streaming fashion
   */
  async *streamDiff(
    oldContent: string,
    newContent: string,
    options: StreamingOptions = {}
  ): AsyncGenerator<DiffChunk[], void, unknown> {
    const oldLines = oldContent.split('\n')
    const newLines = newContent.split('\n')
    
    const totalLines = Math.max(oldLines.length, newLines.length)
    let processedLines = 0
    let currentChunk: DiffChunk[] = []
    let chunkLineCount = 0

    const oldIndex = 0
    const newIndex = 0

    // Process in batches
    for (let i = 0; i < totalLines; i += this.chunkSize) {
      if (this.abortSignal?.aborted) {
        throw new Error('Diff processing aborted')
      }

      const batchOld = oldLines.slice(i, i + this.chunkSize)
      const batchNew = newLines.slice(i, i + this.chunkSize)

      const batchDiff = this.calculateBatchDiff(batchOld, batchNew, i)
      
      for (const chunk of batchDiff) {
        currentChunk.push(chunk)
        chunkLineCount += chunk.lines.length

        // Yield when chunk is full
        if (chunkLineCount >= this.chunkSize) {
          yield currentChunk
          currentChunk = []
          chunkLineCount = 0
        }
      }

      processedLines += batchOld.length
      
      if (options.onProgress) {
        options.onProgress(processedLines / totalLines)
      }

      if (this.delayMs > 0) {
        await this.sleep(this.delayMs)
      }
    }

    // Yield remaining chunks
    if (currentChunk.length > 0) {
      yield currentChunk
    }
  }

  /**
   * Calculate diff for a batch of lines
   */
  private calculateBatchDiff(
    oldLines: string[],
    newLines: string[],
    offset: number
  ): DiffChunk[] {
    const chunks: DiffChunk[] = []
    let oldIndex = 0
    let newIndex = 0

    while (oldIndex < oldLines.length || newIndex < newLines.length) {
      const chunk: DiffChunk = {
        oldStart: offset + oldIndex + 1,
        oldLines: 0,
        newStart: offset + newIndex + 1,
        newLines: 0,
        lines: [],
      }

      // Find unchanged lines
      while (
        oldIndex < oldLines.length &&
        newIndex < newLines.length &&
        oldLines[oldIndex] === newLines[newIndex]
      ) {
        chunk.lines.push({
          oldLineNumber: offset + oldIndex + 1,
          newLineNumber: offset + newIndex + 1,
          type: 'unchanged',
          content: oldLines[oldIndex],
        })
        oldIndex++
        newIndex++
        chunk.oldLines++
        chunk.newLines++
      }

      // Find deleted lines
      while (oldIndex < oldLines.length) {
        const lineInNew = newLines.indexOf(oldLines[oldIndex], newIndex)
        if (lineInNew !== -1 && lineInNew < newIndex + 5) break

        chunk.lines.push({
          oldLineNumber: offset + oldIndex + 1,
          newLineNumber: null,
          type: 'deleted',
          content: oldLines[oldIndex],
        })
        oldIndex++
        chunk.oldLines++
      }

      // Find added lines
      while (newIndex < newLines.length) {
        const lineInOld = oldLines.indexOf(newLines[newIndex], oldIndex)
        if (lineInOld !== -1 && lineInOld < oldIndex + 5) break

        chunk.lines.push({
          oldLineNumber: null,
          newLineNumber: offset + newIndex + 1,
          type: 'added',
          content: newLines[newIndex],
        })
        newIndex++
        chunk.newLines++
      }

      if (chunk.lines.length > 0) {
        chunks.push(chunk)
      }
    }

    return chunks
  }

  /**
   * Paginated diff for very large files
   */
  async getPaginatedDiff(
    oldContent: string,
    newContent: string,
    page: number = 1,
    pageSize: number = 50
  ): Promise<PaginatedResult> {
    const allChunks = await this.getAllChunks(oldContent, newContent)
    
    const totalChunks = allChunks.length
    const totalPages = Math.ceil(totalChunks / pageSize)
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      chunks: allChunks.slice(start, end),
      totalChunks,
      currentPage: page,
      totalPages,
      hasMore: end < totalChunks,
    }
  }

  /**
   * Get all chunks (for smaller files)
   */
  private async getAllChunks(
    oldContent: string,
    newContent: string
  ): Promise<DiffChunk[]> {
    const chunks: DiffChunk[] = []
    
    for await (const batch of this.streamDiff(oldContent, newContent)) {
      chunks.push(...batch)
    }
    
    return chunks
  }

  /**
   * Memory-efficient diff for files > 100MB
   */
  async *streamLargeFileDiff(
    oldFile: File | Blob,
    newFile: File | Blob,
    options: StreamingOptions = {}
  ): AsyncGenerator<{ chunks: DiffChunk[]; progress: number }, void, unknown> {
    const readerOld = oldFile.stream().getReader()
    const readerNew = newFile.stream().getReader()

    const decoder = new TextDecoder()
    let oldBuffer = ''
    let newBuffer = ''
    let totalProcessed = 0
    const totalSize = oldFile.size + newFile.size

    while (true) {
      if (this.abortSignal?.aborted) {
        throw new Error('Large file diff aborted')
      }

      const [resultOld, resultNew] = await Promise.all([
        readerOld.read(),
        readerNew.read(),
      ])

      if (resultOld.done && resultNew.done) break

      if (resultOld.value) {
        oldBuffer += decoder.decode(resultOld.value, { stream: true })
      }
      if (resultNew.value) {
        newBuffer += decoder.decode(resultNew.value, { stream: true })
      }

      // Process complete lines
      const oldLines = oldBuffer.split('\n')
      const newLines = newBuffer.split('\n')

      // Keep last line in buffer if not complete
      oldBuffer = oldLines.pop() || ''
      newBuffer = newLines.pop() || ''

      if (oldLines.length > 0 || newLines.length > 0) {
        const chunks = this.calculateBatchDiff(oldLines, newLines, totalProcessed)
        
        totalProcessed += oldLines.length + newLines.length
        const progress = totalProcessed / (totalSize / 100) // Approximate

        yield { chunks, progress }

        if (options.onProgress) {
          options.onProgress(progress)
        }
      }
    }

    // Process remaining buffer
    if (oldBuffer || newBuffer) {
      const chunks = this.calculateBatchDiff(
        oldBuffer ? [oldBuffer] : [],
        newBuffer ? [newBuffer] : [],
        totalProcessed
      )
      yield { chunks, progress: 100 }
    }

    readerOld.releaseLock()
    readerNew.releaseLock()
  }

  /**
   * Estimate memory usage
   */
  estimateMemoryUsage(fileSizeBytes: number): {
    estimatedMB: number
    recommendedChunkSize: number
    canStream: boolean
  } {
    const estimatedMB = fileSizeBytes / (1024 * 1024)
    
    // If file > 100MB, recommend streaming
    const canStream = estimatedMB > 100
    
    // Calculate recommended chunk size based on file size
    let recommendedChunkSize = 1000
    if (estimatedMB > 500) {
      recommendedChunkSize = 500
    } else if (estimatedMB > 1000) {
      recommendedChunkSize = 200
    }

    return {
      estimatedMB,
      recommendedChunkSize,
      canStream,
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

/**
 * Create a web worker for offloading diff calculations
 */
export const createDiffWorker = (): Worker => {
  const workerCode = `
    self.onmessage = function(e) {
      const { oldContent, newContent, chunkSize } = e.data;
      
      // Simple diff algorithm for worker
      const oldLines = oldContent.split('\\n');
      const newLines = newContent.split('\\n');
      const chunks = [];
      
      // Process in chunks
      for (let i = 0; i < Math.max(oldLines.length, newLines.length); i += chunkSize) {
        const batchOld = oldLines.slice(i, i + chunkSize);
        const batchNew = newLines.slice(i, i + chunkSize);
        
        // Simple line-by-line comparison
        const chunk = {
          oldStart: i + 1,
          oldLines: batchOld.length,
          newStart: i + 1,
          newLines: batchNew.length,
          lines: []
        };
        
        for (let j = 0; j < Math.max(batchOld.length, batchNew.length); j++) {
          const oldLine = batchOld[j];
          const newLine = batchNew[j];
          
          if (oldLine === newLine) {
            chunk.lines.push({
              oldLineNumber: i + j + 1,
              newLineNumber: i + j + 1,
              type: 'unchanged',
              content: oldLine
            });
          } else if (oldLine !== undefined && newLine !== undefined) {
            chunk.lines.push(
              { oldLineNumber: i + j + 1, newLineNumber: null, type: 'deleted', content: oldLine },
              { oldLineNumber: null, newLineNumber: i + j + 1, type: 'added', content: newLine }
            );
          } else if (oldLine !== undefined) {
            chunk.lines.push({
              oldLineNumber: i + j + 1,
              newLineNumber: null,
              type: 'deleted',
              content: oldLine
            });
          } else if (newLine !== undefined) {
            chunk.lines.push({
              oldLineNumber: null,
              newLineNumber: i + j + 1,
              type: 'added',
              content: newLine
            });
          }
        }
        
        chunks.push(chunk);
        
        // Report progress every 10 chunks
        if (chunks.length % 10 === 0) {
          self.postMessage({
            type: 'progress',
            progress: i / Math.max(oldLines.length, newLines.length)
          });
        }
      }
      
      self.postMessage({ type: 'complete', chunks });
    };
  `

  const blob = new Blob([workerCode], { type: 'application/javascript' })
  return new Worker(URL.createObjectURL(blob))
}

/**
 * Use worker for heavy diff calculations
 */
export const diffWithWorker = (
  oldContent: string,
  newContent: string,
  chunkSize: number = 1000
): Promise<DiffChunk[]> => {
  return new Promise((resolve, reject) => {
    const worker = createDiffWorker()
    
    worker.onmessage = (e) => {
      if (e.data.type === 'complete') {
        resolve(e.data.chunks)
        worker.terminate()
      } else if (e.data.type === 'error') {
        reject(new Error(e.data.error))
        worker.terminate()
      }
    }

    worker.onerror = (err) => {
      reject(err)
      worker.terminate()
    }

    worker.postMessage({ oldContent, newContent, chunkSize })
  })
}

/**
 * Memory monitoring
 */
export const getMemoryStats = (): {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
  usedMB: number
} => {
  const memory = (performance as Performance & { memory?: MemoryInfo }).memory
  
  if (!memory) {
    return {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0,
      usedMB: 0,
    }
  }

  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    usedMB: Math.round(memory.usedJSHeapSize / 1024 / 1024),
  }
}

/**
 * Check if should use streaming based on file size
 */
export const shouldUseStreaming = (fileSizeBytes: number): boolean => {
  const MB = fileSizeBytes / (1024 * 1024)
  return MB > 10 // Use streaming for files > 10MB
}

/**
 * Debounced diff calculation
 */
export const createDebouncedDiff = (
  callback: (chunks: DiffChunk[]) => void,
  delay: number = 300
) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let abortController: AbortController | null = null

  return (oldContent: string, newContent: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    if (abortController) {
      abortController.abort()
    }
    
    abortController = new AbortController()

    timeoutId = setTimeout(async () => {
      const processor = new StreamingDiffProcessor({
        signal: abortController?.signal,
      })

      const chunks: DiffChunk[] = []
      
      for await (const batch of processor.streamDiff(oldContent, newContent)) {
        chunks.push(...batch)
      }

      callback(chunks)
    }, delay)
  }
}
