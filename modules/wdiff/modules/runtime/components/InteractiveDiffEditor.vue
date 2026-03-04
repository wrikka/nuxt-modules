<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

interface EditableLine {
  lineNumber: number
  originalContent: string
  currentContent: string
  isModified: boolean
  isDeleted: boolean
  isNew: boolean
}

interface Props {
  initialContent: string
  language?: string
  readOnly?: boolean
  lineNumbers?: boolean
  autoSave?: boolean
  autoSaveDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  language: 'text',
  readOnly: false,
  lineNumbers: true,
  autoSave: false,
  autoSaveDelay: 2000,
})

const emit = defineEmits<{
  (e: 'change', content: string): void
  (e: 'save', content: string): void
  (e: 'lineChange', line: EditableLine): void
  (e: 'lineAdd', afterLine: number): void
  (e: 'lineDelete', lineNumber: number): void
}>()

const lines = ref<EditableLine[]>([])
const activeLine = ref<number | null>(null)
const editMode = ref(false)
const editContent = ref('')
const selectionStart = ref(0)
const selectionEnd = ref(0)
const isMultiSelect = ref(false)
const selectedLines = ref<Set<number>>(new Set())
const history = ref<string[]>([])
const historyIndex = ref(-1)
const autoSaveTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const textareaRefs = ref<Map<number, HTMLTextAreaElement>>(new Map())

// Initialize lines from content
const initializeLines = (content: string) => {
  const contentLines = content.split('\n')
  lines.value = contentLines.map((content, index) => ({
    lineNumber: index + 1,
    originalContent: content,
    currentContent: content,
    isModified: false,
    isDeleted: false,
    isNew: false,
  }))
  saveToHistory()
}

watch(() => props.initialContent, initializeLines, { immediate: true })

const currentContent = computed(() =>
  lines.value
    .filter((line) => !line.isDeleted)
    .map((line) => line.currentContent)
    .join('\n')
)

const modifiedCount = computed(
  () => lines.value.filter((l) => l.isModified).length
)
const deletedCount = computed(
  () => lines.value.filter((l) => l.isDeleted).length
)
const addedCount = computed(() => lines.value.filter((l) => l.isNew).length)

const saveToHistory = () => {
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1)
  }
  history.value.push(currentContent.value)
  historyIndex.value++
}

const undo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--
    initializeLines(history.value[historyIndex.value])
  }
}

const redo = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    initializeLines(history.value[historyIndex.value])
  }
}

const updateLine = (lineNumber: number, newContent: string) => {
  const line = lines.value.find((l) => l.lineNumber === lineNumber)
  if (!line) return

  line.currentContent = newContent
  line.isModified = line.currentContent !== line.originalContent

  emit('lineChange', line)
  emit('change', currentContent.value)

  if (props.autoSave) {
    if (autoSaveTimer.value) clearTimeout(autoSaveTimer.value)
    autoSaveTimer.value = setTimeout(() => {
      emit('save', currentContent.value)
    }, props.autoSaveDelay)
  }
}

const addLine = (afterLine: number) => {
  const index = lines.value.findIndex((l) => l.lineNumber === afterLine)
  const newLine: EditableLine = {
    lineNumber: afterLine + 1,
    originalContent: '',
    currentContent: '',
    isModified: false,
    isDeleted: false,
    isNew: true,
  }
  
  lines.value.splice(index + 1, 0, newLine)
  
  // Renumber lines
  lines.value.forEach((line, idx) => {
    line.lineNumber = idx + 1
  })

  emit('lineAdd', afterLine)
  saveToHistory()

  // Focus new line
  nextTick(() => {
    focusLine(newLine.lineNumber)
  })
}

const deleteLine = (lineNumber: number) => {
  const line = lines.value.find((l) => l.lineNumber === lineNumber)
  if (!line) return

  if (line.isNew) {
    // Actually remove new lines
    const index = lines.value.indexOf(line)
    lines.value.splice(index, 1)
    lines.value.forEach((l, idx) => {
      l.lineNumber = idx + 1
    })
  } else {
    line.isDeleted = true
  }

  emit('lineDelete', lineNumber)
  saveToHistory()
}

const restoreLine = (lineNumber: number) => {
  const line = lines.value.find((l) => l.lineNumber === lineNumber)
  if (line) {
    line.isDeleted = false
    saveToHistory()
  }
}

const startEditing = (lineNumber: number) => {
  if (props.readOnly) return
  
  activeLine.value = lineNumber
  const line = lines.value.find((l) => l.lineNumber === lineNumber)
  editContent.value = line?.currentContent ?? ''
  editMode.value = true
}

const finishEditing = () => {
  if (activeLine.value !== null) {
    updateLine(activeLine.value, editContent.value)
  }
  editMode.value = false
  activeLine.value = null
  saveToHistory()
}

const focusLine = (lineNumber: number) => {
  const textarea = textareaRefs.value.get(lineNumber)
  if (textarea) {
    textarea.focus()
    startEditing(lineNumber)
  }
}

const toggleLineSelection = (lineNumber: number, event: MouseEvent) => {
  if (event.shiftKey) {
    // Range selection
    if (selectionStart.value) {
      const start = Math.min(selectionStart.value, lineNumber)
      const end = Math.max(selectionStart.value, lineNumber)
      for (let i = start; i <= end; i++) {
        selectedLines.value.add(i)
      }
    }
  } else if (event.ctrlKey || event.metaKey) {
    // Toggle selection
    if (selectedLines.value.has(lineNumber)) {
      selectedLines.value.delete(lineNumber)
    } else {
      selectedLines.value.add(lineNumber)
      selectionStart.value = lineNumber
    }
  } else {
    // Single selection
    selectedLines.value.clear()
    selectedLines.value.add(lineNumber)
    selectionStart.value = lineNumber
  }
}

const deleteSelectedLines = () => {
  for (const lineNumber of selectedLines.value) {
    deleteLine(lineNumber)
  }
  selectedLines.value.clear()
}

const duplicateLine = (lineNumber: number) => {
  const line = lines.value.find((l) => l.lineNumber === lineNumber)
  if (!line) return

  const newLine: EditableLine = {
    lineNumber: lineNumber + 1,
    originalContent: line.currentContent,
    currentContent: line.currentContent,
    isModified: false,
    isDeleted: false,
    isNew: true,
  }

  const index = lines.value.findIndex((l) => l.lineNumber === lineNumber)
  lines.value.splice(index + 1, 0, newLine)

  // Renumber
  lines.value.forEach((l, idx) => {
    l.lineNumber = idx + 1
  })

  saveToHistory()
}

const moveLine = (lineNumber: number, direction: 'up' | 'down') => {
  const index = lines.value.findIndex((l) => l.lineNumber === lineNumber)
  if (index === -1) return

  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= lines.value.length) return

  // Swap
  ;[lines.value[index], lines.value[newIndex]] = [
    lines.value[newIndex],
    lines.value[index],
  ]

  // Renumber
  lines.value.forEach((l, idx) => {
    l.lineNumber = idx + 1
  })

  saveToHistory()
}

const handleKeydown = (event: KeyboardEvent, lineNumber: number) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    finishEditing()
    addLine(lineNumber)
  } else if (event.key === 'Escape') {
    event.preventDefault()
    finishEditing()
  } else if (event.key === 'Tab') {
    event.preventDefault()
    const line = lines.value.find((l) => l.lineNumber === lineNumber)
    if (line) {
      editContent.value = '  ' + editContent.value
    }
  }

  // Global shortcuts
  if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
    event.preventDefault()
    if (event.shiftKey) {
      redo()
    } else {
      undo()
    }
  }
}

const getLineClass = (line: EditableLine): string => {
  const classes = ['editor-line']
  
  if (line.isDeleted) classes.push('deleted')
  if (line.isNew) classes.push('new')
  if (line.isModified) classes.push('modified')
  if (line.lineNumber === activeLine.value) classes.push('active')
  if (selectedLines.value.has(line.lineNumber)) classes.push('selected')
  
  return classes.join(' ')
}

defineExpose({
  lines,
  currentContent,
  undo,
  redo,
  saveToHistory,
  focusLine,
  addLine,
  deleteLine,
  modifiedCount,
  deletedCount,
  addedCount,
})
</script>

<template>
  <div class="interactive-diff-editor">
    <!-- Toolbar -->
    <div class="editor-toolbar">
      <div class="toolbar-group">
        <button class="toolbar-btn" :disabled="historyIndex <= 0" @click="undo">
          ↩ Undo
        </button>
        <button class="toolbar-btn" :disabled="historyIndex >= history.length - 1" @click="redo">
          ↪ Redo
        </button>
      </div>

      <div class="toolbar-stats">
        <span v-if="modifiedCount > 0" class="stat modified">
          {{ modifiedCount }} modified
        </span>
        <span v-if="addedCount > 0" class="stat added">
          {{ addedCount }} added
        </span>
        <span v-if="deletedCount > 0" class="stat deleted">
          {{ deletedCount }} deleted
        </span>
      </div>

      <div class="toolbar-group">
        <button
          v-if="selectedLines.size > 0"
          class="toolbar-btn danger"
          @click="deleteSelectedLines"
        >
          Delete Selected ({{ selectedLines.size }})
        </button>
      </div>
    </div>

    <!-- Editor -->
    <div class="editor-container">
      <div
        v-for="line in lines"
        :key="line.lineNumber"
        :class="getLineClass(line)"
        @click="toggleLineSelection(line.lineNumber, $event)"
      >
        <!-- Line number -->
        <div v-if="lineNumbers" class="line-gutter">
          <span class="line-number">{{ line.lineNumber }}</span>
          <div class="line-actions">
            <button class="action-btn" @click.stop="addLine(line.lineNumber)">+</button>
            <button class="action-btn" @click.stop="duplicateLine(line.lineNumber)">⎘</button>
            <button class="action-btn danger" @click.stop="deleteLine(line.lineNumber)">×</button>
          </div>
        </div>

        <!-- Line content -->
        <div class="line-content">
          <div v-if="line.isDeleted" class="deleted-indicator">
            <span class="deleted-label">Deleted</span>
            <button class="restore-btn" @click.stop="restoreLine(line.lineNumber)">
              Restore
            </button>
          </div>

          <template v-else>
            <div
              v-if="!editMode || activeLine !== line.lineNumber"
              class="line-text"
              @dblclick="startEditing(line.lineNumber)"
            >
              {{ line.currentContent || ' ' }}
            </div>

            <textarea
              v-else
              :ref="(el) => { if (el) textareaRefs.set(line.lineNumber, el as HTMLTextAreaElement) }"
              v-model="editContent"
              class="line-textarea"
              rows="1"
              @blur="finishEditing"
              @keydown="handleKeydown($event, line.lineNumber)"
            />
          </template>
        </div>

        <!-- Status indicator -->
        <div class="line-status">
          <span v-if="line.isNew" class="status-badge new">+</span>
          <span v-else-if="line.isModified" class="status-badge modified">~</span>
          <span v-else-if="line.isDeleted" class="status-badge deleted">−</span>
        </div>
      </div>
    </div>

    <!-- Keyboard shortcuts hint -->
    <div class="keyboard-hints">
      <span>Ctrl+Z: Undo</span>
      <span>Ctrl+Shift+Z: Redo</span>
      <span>Double-click: Edit</span>
      <span>Ctrl+Click: Multi-select</span>
    </div>
  </div>
</template>

<style scoped>
.interactive-diff-editor {
  @apply flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden;
}

.editor-toolbar {
  @apply flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800;
  @apply border-b border-gray-200 dark:border-gray-700;
}

.toolbar-group {
  @apply flex gap-2;
}

.toolbar-btn {
  @apply px-3 py-1.5 text-sm rounded;
  @apply bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600;
  @apply text-gray-700 dark:text-gray-300;
  @apply hover:bg-gray-100 dark:hover:bg-gray-600;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
  @apply transition-colors;
}

.toolbar-btn.danger {
  @apply bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300;
  @apply border-red-300 dark:border-red-700;
}

.toolbar-stats {
  @apply flex gap-4 text-sm;
}

.stat {
  @apply font-medium;
}

.stat.modified {
  @apply text-yellow-600 dark:text-yellow-400;
}

.stat.added {
  @apply text-green-600 dark:text-green-400;
}

.stat.deleted {
  @apply text-red-600 dark:text-red-400;
}

.editor-container {
  @apply flex-1 overflow-y-auto font-mono text-sm;
}

.editor-line {
  @apply flex items-stretch min-h-7;
  @apply hover:bg-gray-50 dark:hover:bg-gray-800/50;
  @apply cursor-pointer;
}

.editor-line.active {
  @apply bg-blue-50 dark:bg-blue-900/20;
}

.editor-line.selected {
  @apply bg-blue-100 dark:bg-blue-900/30;
}

.editor-line.deleted {
  @apply opacity-60;
}

.editor-line.new {
  @apply bg-green-50/50 dark:bg-green-900/10;
}

.editor-line.modified {
  @apply bg-yellow-50/50 dark:bg-yellow-900/10;
}

.line-gutter {
  @apply flex items-center shrink-0 w-24 bg-gray-100 dark:bg-gray-800;
  @apply border-r border-gray-200 dark:border-gray-700;
  @apply select-none;
}

.line-number {
  @apply w-10 px-2 text-right text-gray-400 dark:text-gray-500 text-xs;
}

.line-actions {
  @apply hidden items-center gap-1;
  @apply group-hover:flex;
}

.editor-line:hover .line-actions {
  @apply flex;
}

.action-btn {
  @apply w-5 h-5 flex items-center justify-center;
  @apply text-xs rounded;
  @apply text-gray-500 dark:text-gray-400;
  @apply hover:bg-gray-200 dark:hover:bg-gray-700;
  @apply transition-colors;
}

.action-btn.danger:hover {
  @apply bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400;
}

.line-content {
  @apply flex-1 min-w-0;
}

.line-text {
  @apply px-3 py-1 whitespace-pre;
  @apply text-gray-800 dark:text-gray-200;
}

.line-textarea {
  @apply w-full px-3 py-1 border-0 bg-transparent;
  @apply text-gray-800 dark:text-gray-200 resize-none;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset;
}

.deleted-indicator {
  @apply flex items-center justify-between px-3 py-1;
  @apply bg-red-50 dark:bg-red-900/20;
}

.deleted-label {
  @apply text-xs text-red-600 dark:text-red-400;
}

.restore-btn {
  @apply px-2 py-0.5 text-xs rounded;
  @apply bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700;
  @apply text-red-600 dark:text-red-400;
  @apply hover:bg-red-50 dark:hover:bg-red-900/30;
}

.line-status {
  @apply w-6 flex items-center justify-center shrink-0;
}

.status-badge {
  @apply w-4 h-4 flex items-center justify-center;
  @apply text-xs font-bold rounded;
}

.status-badge.new {
  @apply bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400;
}

.status-badge.modified {
  @apply bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400;
}

.status-badge.deleted {
  @apply bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400;
}

.keyboard-hints {
  @apply px-4 py-2 bg-gray-50 dark:bg-gray-800;
  @apply border-t border-gray-200 dark:border-gray-700;
  @apply text-xs text-gray-500 dark:text-gray-400;
  @apply flex gap-4;
}

.keyboard-hints span {
  @apply whitespace-nowrap;
}
</style>
