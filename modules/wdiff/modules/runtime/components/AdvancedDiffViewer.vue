<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useVirtualList } from '@vueuse/core'

interface DiffLine {
  oldLineNumber: number | null
  newLineNumber: number | null
  type: 'added' | 'deleted' | 'modified' | 'unchanged'
  content: string
  highlight?: string
}

interface DiffChunk {
  oldStart: number
  oldLines: number
  newStart: number
  newLines: number
  lines: DiffLine[]
}

interface Props {
  oldContent: string
  newContent: string
  oldLabel?: string
  newLabel?: string
  language?: string
  showLineNumbers?: boolean
  highlightSyntax?: boolean
  wrapLines?: boolean
  maxHeight?: number
  contextLines?: number
}

const props = withDefaults(defineProps<Props>(), {
  oldLabel: 'Before',
  newLabel: 'After',
  language: 'text',
  showLineNumbers: true,
  highlightSyntax: true,
  wrapLines: false,
  maxHeight: 600,
  contextLines: 3,
})

const emit = defineEmits<{
  (e: 'lineClick', line: DiffLine, side: 'old' | 'new'): void
  (e: 'chunkExpand', chunk: DiffChunk): void
}>()

// Core diff calculation using Myers algorithm
const calculateDiff = (oldStr: string, newStr: string): DiffChunk[] => {
  const oldLines = oldStr.split('\n')
  const newLines = newStr.split('\n')
  
  const chunks: DiffChunk[] = []
  let oldIndex = 0
  let newIndex = 0
  
  // Simplified LCS-based diff for demonstration
  // In production, use a proper diff library like 'diff'
  while (oldIndex < oldLines.length || newIndex < newLines.length) {
    const chunk: DiffChunk = {
      oldStart: oldIndex + 1,
      oldLines: 0,
      newStart: newIndex + 1,
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
        oldLineNumber: oldIndex + 1,
        newLineNumber: newIndex + 1,
        type: 'unchanged',
        content: oldLines[oldIndex],
      })
      oldIndex++
      newIndex++
      chunk.oldLines++
      chunk.newLines++
    }
    
    // Find deleted lines
    while (
      oldIndex < oldLines.length &&
      (newIndex >= newLines.length || oldLines[oldIndex] !== newLines[newIndex])
    ) {
      // Check if it's modified (exists in new but different)
      const newIndexOfOld = newLines.indexOf(oldLines[oldIndex], newIndex)
      if (newIndexOfOld !== -1) {
        break
      }
      
      chunk.lines.push({
        oldLineNumber: oldIndex + 1,
        newLineNumber: null,
        type: 'deleted',
        content: oldLines[oldIndex],
      })
      oldIndex++
      chunk.oldLines++
    }
    
    // Find added lines
    while (
      newIndex < newLines.length &&
      (oldIndex >= oldLines.length || oldLines[oldIndex] !== newLines[newIndex])
    ) {
      // Check if it's modified
      const oldIndexOfNew = oldLines.indexOf(newLines[newIndex], oldIndex)
      if (oldIndexOfNew !== -1) {
        break
      }
      
      chunk.lines.push({
        oldLineNumber: null,
        newLineNumber: newIndex + 1,
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

const chunks = computed(() =>
  calculateDiff(props.oldContent, props.newContent)
)

const flatLines = computed(() => {
  return chunks.value.flatMap((chunk) => chunk.lines)
})

const { list, containerProps, wrapperProps } = useVirtualList(flatLines, {
  itemHeight: 24,
  overscan: 10,
})

// Syntax highlighting (simplified)
const highlightCode = (content: string, type: DiffLine['type']): string => {
  if (!props.highlightSyntax) {
    return escapeHtml(content)
  }
  
  // Basic syntax highlighting
  let highlighted = escapeHtml(content)
  
  // Keywords
  highlighted = highlighted.replace(
    /\b(const|let|var|function|class|interface|type|import|export|from|return|if|else|for|while|switch|case|break|continue|try|catch|finally|throw|new|this|super|extends|implements|async|await|yield)\b/g,
    '<span class="syntax-keyword">$1</span>'
  )
  
  // Strings
  highlighted = highlighted.replace(
    /(['"`'])([^\\1]*?)\1/g,
    '<span class="syntax-string">$1$2$1</span>'
  )
  
  // Numbers
  highlighted = highlighted.replace(
    /\b(\d+(?:\.\d+)?)\b/g,
    '<span class="syntax-number">$1</span>'
  )
  
  // Comments
  highlighted = highlighted.replace(
    /(\/\/.*$|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->)/gm,
    '<span class="syntax-comment">$1</span>'
  )
  
  return highlighted
}

const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const getLineClass = (type: DiffLine['type']): string => {
  const baseClasses = 'diff-line'
  switch (type) {
    case 'added':
      return `${baseClasses} diff-line-added`
    case 'deleted':
      return `${baseClasses} diff-line-deleted`
    case 'modified':
      return `${baseClasses} diff-line-modified`
    default:
      return baseClasses
  }
}

const getGutterClass = (type: DiffLine['type']): string => {
  switch (type) {
    case 'added':
      return 'gutter-added'
    case 'deleted':
      return 'gutter-deleted'
    case 'modified':
      return 'gutter-modified'
    default:
      return 'gutter-unchanged'
  }
}

const handleLineClick = (line: DiffLine, side: 'old' | 'new') => {
  emit('lineClick', line, side)
}

const stats = computed(() => {
  const lines = flatLines.value
  return {
    added: lines.filter((l) => l.type === 'added').length,
    deleted: lines.filter((l) => l.type === 'deleted').length,
    modified: lines.filter((l) => l.type === 'modified').length,
    unchanged: lines.filter((l) => l.type === 'unchanged').length,
  }
})

const collapseUnchanged = ref(false)

const toggleCollapse = () => {
  collapseUnchanged.value = !collapseUnchanged.value
}

// Export for parent components
defineExpose({
  chunks,
  stats,
  flatLines,
  scrollToLine: (lineNumber: number) => {
    const index = flatLines.value.findIndex(
      (l) => l.oldLineNumber === lineNumber || l.newLineNumber === lineNumber
    )
    if (index !== -1) {
      // Scroll to the line
    }
  },
})
</script>

<template>
  <div class="advanced-diff-viewer">
    <!-- Header with stats -->
    <div class="diff-header">
      <div class="diff-stats">
        <span class="stat added">+{{ stats.added }} added</span>
        <span class="stat deleted">-{{ stats.deleted }} deleted</span>
        <span class="stat modified">~{{ stats.modified }} modified</span>
        <span class="stat unchanged">{{ stats.unchanged }} unchanged</span>
      </div>
      <div class="diff-actions">
        <button
          class="btn-toggle"
          :class="{ active: collapseUnchanged }"
          @click="toggleCollapse"
        >
          {{ collapseUnchanged ? 'Expand' : 'Collapse' }} unchanged
        </button>
      </div>
    </div>

    <!-- Side-by-side diff -->
    <div class="diff-container" :style="{ maxHeight: `${maxHeight}px` }">
      <div v-bind="containerProps" class="virtual-scroll-container">
        <div v-bind="wrapperProps" class="virtual-scroll-wrapper">
          <div
            v-for="{ index, data: line } in list"
            :key="index"
            :class="getLineClass(line.data.type)"
            @click="handleLineClick(line.data, 'old')"
          >
            <!-- Line numbers gutter -->
            <div v-if="showLineNumbers" class="line-gutter">
              <span :class="getGutterClass(line.data.type)">
                {{ line.data.oldLineNumber ?? '' }}
              </span>
              <span :class="getGutterClass(line.data.type)">
                {{ line.data.newLineNumber ?? '' }}
              </span>
            </div>

            <!-- Line content -->
            <div class="line-content" :class="{ wrap: wrapLines }">
              <span
                v-if="line.data.type === 'added'"
                class="line-marker"
              >+</span>
              <span
                v-else-if="line.data.type === 'deleted'"
                class="line-marker"
              >-</span>
              <span v-else class="line-marker"> </span>
              <code
                class="line-code"
                v-html="highlightCode(line.data.content, line.data.type)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chunk navigation -->
    <div class="diff-navigation">
      <span class="nav-info">{{ chunks.length }} chunks</span>
    </div>
  </div>
</template>

<style scoped>
.advanced-diff-viewer {
  @apply flex flex-col border border-gray-200 rounded-lg overflow-hidden;
  @apply dark:border-gray-700;
}

.diff-header {
  @apply flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800;
  @apply border-b border-gray-200 dark:border-gray-700;
}

.diff-stats {
  @apply flex gap-4 text-sm;
}

.stat {
  @apply font-medium;
}

.stat.added {
  @apply text-green-600 dark:text-green-400;
}

.stat.deleted {
  @apply text-red-600 dark:text-red-400;
}

.stat.modified {
  @apply text-yellow-600 dark:text-yellow-400;
}

.stat.unchanged {
  @apply text-gray-500 dark:text-gray-400;
}

.diff-actions {
  @apply flex gap-2;
}

.btn-toggle {
  @apply px-3 py-1 text-sm rounded;
  @apply bg-white dark:bg-gray-700;
  @apply border border-gray-300 dark:border-gray-600;
  @apply hover:bg-gray-100 dark:hover:bg-gray-600;
  @apply transition-colors;
}

.btn-toggle.active {
  @apply bg-blue-100 dark:bg-blue-900;
  @apply border-blue-300 dark:border-blue-700;
  @apply text-blue-700 dark:text-blue-300;
}

.diff-container {
  @apply overflow-auto;
}

.virtual-scroll-container {
  @apply w-full;
}

.diff-line {
  @apply flex min-h-6 font-mono text-sm;
  @apply hover:bg-gray-50 dark:hover:bg-gray-800/50;
  @apply cursor-pointer transition-colors;
}

.diff-line-added {
  @apply bg-green-50 dark:bg-green-900/20;
}

.diff-line-added:hover {
  @apply bg-green-100 dark:bg-green-900/30;
}

.diff-line-deleted {
  @apply bg-red-50 dark:bg-red-900/20;
}

.diff-line-deleted:hover {
  @apply bg-red-100 dark:bg-red-900/30;
}

.diff-line-modified {
  @apply bg-yellow-50 dark:bg-yellow-900/20;
}

.line-gutter {
  @apply flex shrink-0 select-none text-right;
  @apply bg-gray-100 dark:bg-gray-800;
  @apply border-r border-gray-200 dark:border-gray-700;
}

.line-gutter span {
  @apply w-12 px-2 py-0.5 text-gray-400 dark:text-gray-500 text-xs;
}

.gutter-added {
  @apply bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300;
}

.gutter-deleted {
  @apply bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300;
}

.gutter-modified {
  @apply bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300;
}

.line-content {
  @apply flex-1 flex items-center px-2 py-0.5;
  @apply overflow-x-auto;
}

.line-content.wrap {
  @apply whitespace-pre-wrap break-all;
}

.line-marker {
  @apply w-4 shrink-0 select-none font-bold;
}

.line-code {
  @apply whitespace-pre;
}

/* Syntax highlighting */
:deep(.syntax-keyword) {
  @apply text-purple-600 dark:text-purple-400 font-semibold;
}

:deep(.syntax-string) {
  @apply text-green-600 dark:text-green-400;
}

:deep(.syntax-number) {
  @apply text-blue-600 dark:text-blue-400;
}

:deep(.syntax-comment) {
  @apply text-gray-500 dark:text-gray-400 italic;
}

.diff-navigation {
  @apply px-4 py-2 bg-gray-50 dark:bg-gray-800;
  @apply border-t border-gray-200 dark:border-gray-700;
  @apply text-sm text-gray-600 dark:text-gray-400;
}
</style>
