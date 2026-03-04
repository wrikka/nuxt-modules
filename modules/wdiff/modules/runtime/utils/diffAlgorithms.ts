import type { DiffChunk, DiffLine } from '../types'

export type DiffAlgorithm = 'myers' | 'patience' | 'histogram' | 'minimal' | 'levenshtein'

export interface AlgorithmOptions {
  algorithm: DiffAlgorithm
  contextLines?: number
  ignoreWhitespace?: boolean
  ignoreCase?: boolean
  ignoreLineEndings?: boolean
  similarityThreshold?: number
}

export interface AlgorithmInfo {
  name: string
  description: string
  bestFor: string[]
  complexity: string
  stable: boolean
}

export const ALGORITHM_INFO: Record<DiffAlgorithm, AlgorithmInfo> = {
  myers: {
    name: 'Myers',
    description: 'Classic O(ND) diff algorithm, fast and efficient for most cases',
    bestFor: ['general-purpose', 'text-files', 'code'],
    complexity: 'O(ND)',
    stable: true,
  },
  patience: {
    name: 'Patience',
    description: 'Handles moved/copied lines better, great for refactored code',
    bestFor: ['refactoring', 'moved-code', 'large-files'],
    complexity: 'O(N log N)',
    stable: true,
  },
  histogram: {
    name: 'Histogram',
    description: 'Extended patience algorithm with better handling of repeated lines',
    bestFor: ['repetitive-content', 'logs', 'data-files'],
    complexity: 'O(N log N)',
    stable: true,
  },
  minimal: {
    name: 'Minimal',
    description: 'Produces smallest possible diff output at the cost of speed',
    bestFor: ['patch-generation', 'storage-optimization'],
    complexity: 'O(N²)',
    stable: true,
  },
  levenshtein: {
    name: 'Levenshtein',
    description: 'Character-level diff, useful for inline changes and spell checking',
    bestFor: ['inline-changes', 'spell-check', 'single-line'],
    complexity: 'O(N²)',
    stable: true,
  },
}

/**
 * Myers diff algorithm - Classic O(ND) implementation
 */
const myersDiff = (
  oldLines: string[],
  newLines: string[],
  options: AlgorithmOptions
): DiffChunk[] => {
  const { ignoreWhitespace, ignoreCase, contextLines = 3 } = options

  const normalizeLine = (line: string): string => {
    let result = line
    if (ignoreWhitespace) result = result.trim().replace(/\s+/g, ' ')
    if (ignoreCase) result = result.toLowerCase()
    return result
  }

  const oldNormalized = oldLines.map(normalizeLine)
  const newNormalized = newLines.map(normalizeLine)

  const n = oldNormalized.length
  const m = newNormalized.length
  const maxD = n + m

  // Early exit for empty inputs
  if (n === 0 && m === 0) return []
  if (n === 0) {
    return [{
      oldStart: 1,
      oldLines: 0,
      newStart: 1,
      newLines: m,
      lines: newLines.map((content, i) => ({
        oldLineNumber: null,
        newLineNumber: i + 1,
        type: 'added',
        content,
      })),
    }]
  }
  if (m === 0) {
    return [{
      oldStart: 1,
      oldLines: n,
      newStart: 1,
      newLines: 0,
      lines: oldLines.map((content, i) => ({
        oldLineNumber: i + 1,
        newLineNumber: null,
        type: 'deleted',
        content,
      })),
    }]
  }

  // Myers algorithm core
  const v: Record<number, number> = { 1: 0 }
  const trace: Array<Record<number, number>> = []

  let x = 0
  let y = 0

  outer: for (let d = 0; d <= maxD; d++) {
    trace.push({ ...v })

    for (let k = -d; k <= d; k += 2) {
      const down = k === -d || (k !== d && v[k - 1] < v[k + 1])
      const kPrev = down ? k + 1 : k - 1

      x = down ? v[kPrev] : v[kPrev] + 1
      y = x - k

      while (
        x < n &&
        y < m &&
        oldNormalized[x] === newNormalized[y]
      ) {
        x++
        y++
      }

      v[k] = x

      if (x >= n && y >= m) {
        break outer
      }
    }
  }

  // Backtrack to build diff
  const chunks: DiffChunk[] = []
  let oldIndex = n - 1
  let newIndex = m - 1

  for (let d = trace.length - 1; d >= 0; d--) {
    const vD = trace[d]
    const k = oldIndex - newIndex
    const kPrev =
      k === -d || (k !== d && (vD[k - 1] ?? 0) < (vD[k + 1] ?? 0))
        ? k + 1
        : k - 1

    const xPrev = vD[kPrev] ?? 0
    const yPrev = xPrev - kPrev

    // Add unchanged lines
    while (oldIndex > xPrev && newIndex > yPrev) {
      const chunk = chunks[chunks.length - 1]
      const line: DiffLine = {
        oldLineNumber: oldIndex + 1,
        newLineNumber: newIndex + 1,
        type: 'unchanged',
        content: oldLines[oldIndex],
      }

      if (chunk && chunks.length > 0) {
        chunk.lines.unshift(line)
        chunk.oldStart = oldIndex + 1
        chunk.newStart = newIndex + 1
      } else {
        chunks.push({
          oldStart: oldIndex + 1,
          oldLines: 1,
          newStart: newIndex + 1,
          newLines: 1,
          lines: [line],
        })
      }

      oldIndex--
      newIndex--
    }

    // Add deleted lines
    while (oldIndex > xPrev) {
      const chunk = chunks[chunks.length - 1]
      const line: DiffLine = {
        oldLineNumber: oldIndex + 1,
        newLineNumber: null,
        type: 'deleted',
        content: oldLines[oldIndex],
      }

      if (chunk && chunk.lines[0]?.type === 'deleted') {
        chunk.lines.unshift(line)
        chunk.oldStart = oldIndex + 1
      } else {
        chunks.push({
          oldStart: oldIndex + 1,
          oldLines: 1,
          newStart: newIndex + 1,
          newLines: 0,
          lines: [line],
        })
      }

      oldIndex--
    }

    // Add added lines
    while (newIndex > yPrev) {
      const chunk = chunks[chunks.length - 1]
      const line: DiffLine = {
        oldLineNumber: null,
        newLineNumber: newIndex + 1,
        type: 'added',
        content: newLines[newIndex],
      }

      if (chunk && chunk.lines[0]?.type === 'added') {
        chunk.lines.unshift(line)
        chunk.newStart = newIndex + 1
      } else {
        chunks.push({
          oldStart: oldIndex + 1,
          oldLines: 0,
          newStart: newIndex + 1,
          newLines: 1,
          lines: [line],
        })
      }

      newIndex--
    }
  }

  // Merge small chunks with context
  return mergeChunks(chunks.reverse(), contextLines)
}

/**
 * Patience diff algorithm - Better for moved/copied lines
 */
const patienceDiff = (
  oldLines: string[],
  newLines: string[],
  options: AlgorithmOptions
): DiffChunk[] => {
  const { similarityThreshold = 0.8 } = options

  // Find unique common lines (simplified patience algorithm)
  const findUniqueCommon = (
    old: string[],
    newArr: string[]
  ): Array<{ oldIndex: number; newIndex: number; content: string }> => {
    const oldCount = new Map<string, number>()
    const newCount = new Map<string, number>()

    for (const line of old) {
      oldCount.set(line, (oldCount.get(line) ?? 0) + 1)
    }
    for (const line of newArr) {
      newCount.set(line, (newCount.get(line) ?? 0) + 1)
    }

    const commons: Array<{ oldIndex: number; newIndex: number; content: string }> = []

    for (let i = 0; i < old.length; i++) {
      const line = old[i]
      if (oldCount.get(line) === 1 && newCount.get(line) === 1) {
        const newIndex = newArr.indexOf(line)
        if (newIndex !== -1) {
          commons.push({ oldIndex: i, newIndex, content: line })
        }
      }
    }

    return commons.sort((a, b) => a.oldIndex - b.oldIndex)
  }

  const chunks: DiffChunk[] = []
  let oldIndex = 0
  let newIndex = 0

  const commons = findUniqueCommon(oldLines, newLines)

  for (const common of commons) {
    // Lines before common
    if (oldIndex < common.oldIndex || newIndex < common.newIndex) {
      const oldSlice = oldLines.slice(oldIndex, common.oldIndex)
      const newSlice = newLines.slice(newIndex, common.newIndex)

      // Use myers for sub-diff
      const subChunks = myersDiff(oldSlice, newSlice, options)
      for (const chunk of subChunks) {
        chunk.oldStart += oldIndex
        chunk.newStart += newIndex
        chunks.push(chunk)
      }
    }

    // Common line
    chunks.push({
      oldStart: common.oldIndex + 1,
      oldLines: 1,
      newStart: common.newIndex + 1,
      newLines: 1,
      lines: [{
        oldLineNumber: common.oldIndex + 1,
        newLineNumber: common.newIndex + 1,
        type: 'unchanged',
        content: common.content,
      }],
    })

    oldIndex = common.oldIndex + 1
    newIndex = common.newIndex + 1
  }

  // Remaining lines
  if (oldIndex < oldLines.length || newIndex < newLines.length) {
    const oldSlice = oldLines.slice(oldIndex)
    const newSlice = newLines.slice(newIndex)
    const subChunks = myersDiff(oldSlice, newSlice, options)
    for (const chunk of subChunks) {
      chunk.oldStart += oldIndex
      chunk.newStart += newIndex
      chunks.push(chunk)
    }
  }

  return mergeChunks(chunks, options.contextLines ?? 3)
}

/**
 * Histogram diff - Extended patience with histogram
 */
const histogramDiff = (
  oldLines: string[],
  newLines: string[],
  options: AlgorithmOptions
): DiffChunk[] => {
  // For now, use patience diff with histogram-like improvements
  // In a full implementation, this would use histogram bucketing
  return patienceDiff(oldLines, newLines, options)
}

/**
 * Minimal diff - Smallest possible output
 */
const minimalDiff = (
  oldLines: string[],
  newLines: string[],
  options: AlgorithmOptions
): DiffChunk[] => {
  // Use dynamic programming for minimal edit script
  const n = oldLines.length
  const m = newLines.length

  // LCS table
  const dp: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(m + 1).fill(0))

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // Backtrack
  const chunks: DiffChunk[] = []
  let i = n
  let j = m

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      // Unchanged
      chunks.unshift({
        oldStart: i,
        oldLines: 1,
        newStart: j,
        newLines: 1,
        lines: [{
          oldLineNumber: i,
          newLineNumber: j,
          type: 'unchanged',
          content: oldLines[i - 1],
        }],
      })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      // Added
      chunks.unshift({
        oldStart: i + 1,
        oldLines: 0,
        newStart: j,
        newLines: 1,
        lines: [{
          oldLineNumber: null,
          newLineNumber: j,
          type: 'added',
          content: newLines[j - 1],
        }],
      })
      j--
    } else {
      // Deleted
      chunks.unshift({
        oldStart: i,
        oldLines: 1,
        newStart: j + 1,
        newLines: 0,
        lines: [{
          oldLineNumber: i,
          newLineNumber: null,
          type: 'deleted',
          content: oldLines[i - 1],
        }],
      })
      i--
    }
  }

  return mergeChunks(chunks, options.contextLines ?? 3)
}

/**
 * Levenshtein distance for character-level diff
 */
const levenshteinDiff = (
  oldText: string,
  newText: string,
  options: AlgorithmOptions
): DiffChunk[] => {
  // For inline diff, treat as single lines
  const oldLines = [oldText]
  const newLines = [newText]

  const m = oldText.length
  const n = newText.length

  // Calculate Levenshtein distance matrix
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldText[i - 1] === newText[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + 1 // substitution
        )
      }
    }
  }

  // Backtrack to find operations
  const operations: Array<{ type: 'added' | 'deleted' | 'unchanged'; char: string }> = []
  let i = m
  let j = n

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldText[i - 1] === newText[j - 1]) {
      operations.unshift({ type: 'unchanged', char: oldText[i - 1] })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] <= dp[i - 1][j])) {
      operations.unshift({ type: 'added', char: newText[j - 1] })
      j--
    } else {
      operations.unshift({ type: 'deleted', char: oldText[i - 1] })
      i--
    }
  }

  // Group operations into lines
  const lines: DiffLine[] = []
  let currentLine = ''
  let lastType: 'added' | 'deleted' | 'unchanged' | null = null

  for (const op of operations) {
    if (op.char === '\n') {
      lines.push({
        oldLineNumber: lastType === 'added' ? null : 1,
        newLineNumber: lastType === 'deleted' ? null : 1,
        type: lastType ?? 'unchanged',
        content: currentLine,
      })
      currentLine = ''
      lastType = null
    } else {
      currentLine += op.char
      if (lastType === null || (lastType === 'unchanged' && op.type === 'unchanged')) {
        lastType = op.type
      } else if (op.type !== 'unchanged') {
        lastType = op.type
      }
    }
  }

  if (currentLine) {
    lines.push({
      oldLineNumber: lastType === 'added' ? null : 1,
      newLineNumber: lastType === 'deleted' ? null : 1,
      type: lastType ?? 'unchanged',
      content: currentLine,
    })
  }

  return [{
    oldStart: 1,
    oldLines: oldLines.length,
    newStart: 1,
    newLines: newLines.length,
    lines,
  }]
}

/**
 * Merge small chunks with context lines
 */
const mergeChunks = (chunks: DiffChunk[], contextLines: number): DiffChunk[] => {
  if (chunks.length === 0) return []

  const merged: DiffChunk[] = []
  let current: DiffChunk | null = null

  for (const chunk of chunks) {
    if (!current) {
      current = { ...chunk }
    } else {
      // Check if should merge
      const gap = Math.max(
        chunk.oldStart - (current.oldStart + current.oldLines),
        chunk.newStart - (current.newStart + current.newLines)
      )

      if (gap <= contextLines) {
        // Merge chunks
        current.lines.push(...chunk.lines)
        current.oldLines = chunk.oldStart + chunk.oldLines - current.oldStart
        current.newLines = chunk.newStart + chunk.newLines - current.newStart
      } else {
        merged.push(current)
        current = { ...chunk }
      }
    }
  }

  if (current) {
    merged.push(current)
  }

  return merged
}

/**
 * Main diff function with algorithm selection
 */
export const calculateDiffWithAlgorithm = (
  oldContent: string,
  newContent: string,
  options: AlgorithmOptions
): DiffChunk[] => {
  const { algorithm, ignoreLineEndings = true } = options

  let oldLines = oldContent.split('\n')
  let newLines = newContent.split('\n')

  if (ignoreLineEndings) {
    oldLines = oldLines.map((line) => line.replace(/\r$/, ''))
    newLines = newLines.map((line) => line.replace(/\r$/, ''))
  }

  switch (algorithm) {
    case 'patience':
      return patienceDiff(oldLines, newLines, options)
    case 'histogram':
      return histogramDiff(oldLines, newLines, options)
    case 'minimal':
      return minimalDiff(oldLines, newLines, options)
    case 'levenshtein':
      return levenshteinDiff(oldContent, newContent, options)
    case 'myers':
    default:
      return myersDiff(oldLines, newLines, options)
  }
}

/**
 * Auto-select best algorithm based on content
 */
export const autoSelectAlgorithm = (
  oldContent: string,
  newContent: string
): DiffAlgorithm => {
  const oldLines = oldContent.split('\n')
  const newLines = newContent.split('\n')
  const maxLines = Math.max(oldLines.length, newLines.length)

  // Small files - use minimal for best results
  if (maxLines < 100) {
    return 'minimal'
  }

  // Large files - use patience for performance
  if (maxLines > 10000) {
    return 'patience'
  }

  // Check for repetitive content (logs, data)
  const uniqueOld = new Set(oldLines).size
  const uniqueNew = new Set(newLines).size
  const repetitionRatio = (uniqueOld + uniqueNew) / (oldLines.length + newLines.length)

  if (repetitionRatio < 0.3) {
    return 'histogram'
  }

  // Check for single line changes (inline)
  if (oldLines.length === 1 && newLines.length === 1) {
    return 'levenshtein'
  }

  // Default to Myers
  return 'myers'
}

/**
 * Benchmark different algorithms
 */
export const benchmarkAlgorithms = async (
  oldContent: string,
  newContent: string
): Promise<
  Array<{
    algorithm: DiffAlgorithm
    duration: number
    chunks: number
    lines: number
  }>
> => {
  const algorithms: DiffAlgorithm[] = ['myers', 'patience', 'histogram', 'minimal']
  const results = []

  for (const algorithm of algorithms) {
    const start = performance.now()
    const chunks = calculateDiffWithAlgorithm(oldContent, newContent, {
      algorithm,
      contextLines: 3,
    })
    const duration = performance.now() - start

    results.push({
      algorithm,
      duration,
      chunks: chunks.length,
      lines: chunks.reduce((sum, c) => sum + c.lines.length, 0),
    })
  }

  return results.sort((a, b) => a.duration - b.duration)
}
