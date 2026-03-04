<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface ConflictChunk {
  id: string
  oldStart: number
  oldLines: number
  newStart: number
  newLines: number
  baseContent: string[]
  incomingContent: string[]
  currentContent: string[]
  isResolved: boolean
  resolution?: 'base' | 'incoming' | 'both' | 'custom'
  customContent?: string
}

interface Props {
  conflicts: ConflictChunk[]
  baseLabel?: string
  incomingLabel?: string
  allowEdit?: boolean
  autoMerge?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  baseLabel: 'Base',
  incomingLabel: 'Incoming',
  allowEdit: true,
  autoMerge: false,
})

const emit = defineEmits<{
  (
    e: 'resolve',
    resolution: {
      chunkId: string
      strategy: 'base' | 'incoming' | 'both' | 'custom'
      content?: string
    }
  ): void
  (e: 'resolveAll', resolutions: Map<string, ConflictChunk>): void
  (e: 'cancel'): void
}>()

const resolvedChunks = ref<Map<string, ConflictChunk>>(new Map())
const editingChunk = ref<string | null>(null)
const editContent = ref('')

// Initialize resolved chunks
watch(
  () => props.conflicts,
  (newConflicts) => {
    for (const conflict of newConflicts) {
      if (!resolvedChunks.value.has(conflict.id)) {
        resolvedChunks.value.set(conflict.id, { ...conflict })
      }
    }
  },
  { immediate: true }
)

const resolutionProgress = computed(() => {
  const total = props.conflicts.length
  const resolved = Array.from(resolvedChunks.value.values()).filter(
    (c) => c.isResolved
  ).length
  return { resolved, total, percentage: Math.round((resolved / total) * 100) }
})

const allResolved = computed(
  () => resolutionProgress.value.resolved === resolutionProgress.value.total
)

const resolveConflict = (
  chunkId: string,
  strategy: 'base' | 'incoming' | 'both' | 'custom'
) => {
  const chunk = resolvedChunks.value.get(chunkId)
  if (!chunk) return

  let finalContent: string[] = []

  switch (strategy) {
    case 'base':
      finalContent = chunk.baseContent
      break
    case 'incoming':
      finalContent = chunk.incomingContent
      break
    case 'both':
      finalContent = [...chunk.baseContent, ...chunk.incomingContent]
      break
    case 'custom':
      finalContent = editContent.value.split('\n')
      break
  }

  chunk.isResolved = true
  chunk.resolution = strategy
  chunk.currentContent = finalContent
  if (strategy === 'custom') {
    chunk.customContent = editContent.value
  }

  resolvedChunks.value.set(chunkId, chunk)
  editingChunk.value = null

  emit('resolve', {
    chunkId,
    strategy,
    content: strategy === 'custom' ? editContent.value : undefined,
  })

  // Auto merge if all resolved and autoMerge enabled
  if (props.autoMerge && allResolved.value) {
    handleResolveAll()
  }
}

const startEditing = (chunkId: string) => {
  const chunk = resolvedChunks.value.get(chunkId)
  if (!chunk) return

  editingChunk.value = chunkId
  editContent.value = chunk.currentContent.join('\n')
}

const cancelEditing = () => {
  editingChunk.value = null
  editContent.value = ''
}

const handleResolveAll = () => {
  emit('resolveAll', resolvedChunks.value)
}

const handleCancel = () => {
  emit('cancel')
}

const getResolutionIcon = (strategy?: string) => {
  switch (strategy) {
    case 'base':
      return '✓ Base'
    case 'incoming':
      return '✓ Incoming'
    case 'both':
      return '✓ Both'
    case 'custom':
      return '✓ Custom'
    default:
      return '?'
  }
}

const getResolutionClass = (strategy?: string) => {
  switch (strategy) {
    case 'base':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
    case 'incoming':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    case 'both':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
    case 'custom':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}
</script>

<template>
  <div class="merge-conflict-resolver">
    <!-- Header -->
    <div class="resolver-header">
      <div class="resolver-title">
        <h3>Resolve Merge Conflicts</h3>
        <span class="resolver-progress">
          {{ resolutionProgress.resolved }} / {{ resolutionProgress.total }} resolved
          ({{ resolutionProgress.percentage }}%)
        </span>
      </div>
      <div class="resolver-actions">
        <button
          class="btn-resolve-all"
          :disabled="!allResolved"
          @click="handleResolveAll"
        >
          Resolve All
        </button>
        <button class="btn-cancel" @click="handleCancel">Cancel</button>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="progress-bar">
      <div
        class="progress-fill"
        :style="{ width: `${resolutionProgress.percentage}%` }"
      />
    </div>

    <!-- Conflict list -->
    <div class="conflicts-container">
      <div
        v-for="[id, chunk] in resolvedChunks"
        :key="id"
        :class="['conflict-card', { resolved: chunk.isResolved }]"
      >
        <!-- Conflict header -->
        <div class="conflict-header">
          <span class="conflict-location">
            Lines {{ chunk.oldStart }}-{{ chunk.oldStart + chunk.oldLines - 1 }}
          </span>
          <span :class="['resolution-badge', getResolutionClass(chunk.resolution)]">
            {{ getResolutionIcon(chunk.resolution) }}
          </span>
        </div>

        <!-- Editing mode -->
        <div v-if="editingChunk === id" class="edit-mode">
          <textarea
            v-model="editContent"
            class="edit-textarea"
            rows="10"
            placeholder="Enter custom resolution..."
          />
          <div class="edit-actions">
            <button class="btn-save" @click="resolveConflict(id, 'custom')">
              Save Custom
            </button>
            <button class="btn-cancel-edit" @click="cancelEditing">
              Cancel
            </button>
          </div>
        </div>

        <!-- Comparison view -->
        <div v-else class="comparison-view">
          <div class="comparison-side">
            <div class="side-header">
              <span class="side-label">{{ baseLabel }}</span>
            </div>
            <div class="side-content">
              <pre><code v-for="(line, idx) in chunk.baseContent" :key="`base-${idx}`">{{ line }}</code></pre>
            </div>
            <button
              class="btn-accept"
              :disabled="chunk.isResolved"
              @click="resolveConflict(id, 'base')"
            >
              Accept Base
            </button>
          </div>

          <div class="comparison-divider">
            <span class="vs-label">VS</span>
          </div>

          <div class="comparison-side">
            <div class="side-header">
              <span class="side-label">{{ incomingLabel }}</span>
            </div>
            <div class="side-content">
              <pre><code v-for="(line, idx) in chunk.incomingContent" :key="`incoming-${idx}`">{{ line }}</code></pre>
            </div>
            <button
              class="btn-accept"
              :disabled="chunk.isResolved"
              @click="resolveConflict(id, 'incoming')"
            >
              Accept Incoming
            </button>
          </div>
        </div>

        <!-- Action buttons -->
        <div v-if="!editingChunk" class="conflict-actions">
          <button
            class="btn-both"
            :disabled="chunk.isResolved"
            @click="resolveConflict(id, 'both')"
          >
            Accept Both
          </button>
          <button
            v-if="allowEdit"
            class="btn-custom"
            :disabled="chunk.isResolved"
            @click="startEditing(id)"
          >
            Edit Custom
          </button>
        </div>

        <!-- Current resolution preview -->
        <div v-if="chunk.isResolved" class="resolution-preview">
          <div class="preview-header">Resolved Content:</div>
          <pre class="preview-content"><code>{{ chunk.currentContent.join('\n') }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.merge-conflict-resolver {
  @apply flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden;
}

.resolver-header {
  @apply flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700;
}

.resolver-title {
  @apply flex flex-col gap-1;
}

.resolver-title h3 {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.resolver-progress {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.resolver-actions {
  @apply flex gap-3;
}

.btn-resolve-all {
  @apply px-4 py-2 bg-blue-600 text-white rounded-md font-medium;
  @apply hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed;
  @apply transition-colors;
}

.btn-cancel {
  @apply px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium;
  @apply hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300;
  @apply dark:hover:bg-gray-700 transition-colors;
}

.progress-bar {
  @apply h-1 bg-gray-200 dark:bg-gray-700;
}

.progress-fill {
  @apply h-full bg-blue-600 transition-all duration-300;
}

.conflicts-container {
  @apply flex-1 overflow-y-auto p-4 space-y-4;
}

.conflict-card {
  @apply border border-gray-200 dark:border-gray-700 rounded-lg p-4;
  @apply bg-gray-50 dark:bg-gray-800/50;
}

.conflict-card.resolved {
  @apply border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10;
}

.conflict-header {
  @apply flex items-center justify-between mb-4;
}

.conflict-location {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300;
}

.resolution-badge {
  @apply px-3 py-1 rounded-full text-xs font-semibold;
}

.comparison-view {
  @apply grid grid-cols-[1fr_auto_1fr] gap-4;
}

.comparison-side {
  @apply flex flex-col;
}

.side-header {
  @apply px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-t-md;
}

.side-label {
  @apply text-sm font-semibold text-gray-700 dark:text-gray-300;
}

.side-content {
  @apply flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700;
  @apply p-3 font-mono text-sm overflow-x-auto;
  @apply rounded-b-md;
  max-height: 200px;
}

.side-content pre {
  @apply whitespace-pre-wrap;
}

.btn-accept {
  @apply mt-3 px-3 py-2 rounded text-sm font-medium;
  @apply bg-blue-100 text-blue-700 hover:bg-blue-200;
  @apply dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
  @apply transition-colors;
}

.comparison-divider {
  @apply flex items-center justify-center;
}

.vs-label {
  @apply text-xs font-semibold text-gray-400;
}

.conflict-actions {
  @apply flex gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700;
}

.btn-both {
  @apply px-4 py-2 bg-purple-100 text-purple-700 rounded text-sm font-medium;
  @apply hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300;
  @apply dark:hover:bg-purple-900/50 disabled:opacity-50 disabled:cursor-not-allowed;
  @apply transition-colors;
}

.btn-custom {
  @apply px-4 py-2 bg-yellow-100 text-yellow-700 rounded text-sm font-medium;
  @apply hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300;
  @apply dark:hover:bg-yellow-900/50 disabled:opacity-50 disabled:cursor-not-allowed;
  @apply transition-colors;
}

.edit-mode {
  @apply space-y-3;
}

.edit-textarea {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md;
  @apply bg-white dark:bg-gray-800 text-gray-900 dark:text-white;
  @apply font-mono text-sm resize-y;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.edit-actions {
  @apply flex gap-3;
}

.btn-save {
  @apply px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium;
  @apply hover:bg-green-700 transition-colors;
}

.btn-cancel-edit {
  @apply px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium;
  @apply hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300;
  @apply dark:hover:bg-gray-700 transition-colors;
}

.resolution-preview {
  @apply mt-4 pt-4 border-t border-gray-200 dark:border-gray-700;
}

.preview-header {
  @apply text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2;
}

.preview-content {
  @apply bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800;
  @apply rounded-md p-3 font-mono text-sm overflow-x-auto;
}
</style>
