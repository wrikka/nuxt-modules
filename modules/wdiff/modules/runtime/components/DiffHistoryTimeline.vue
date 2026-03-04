<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTimeAgo } from '@vueuse/core'

interface HistoryEntry {
  id: string
  timestamp: number
  author: string
  avatar?: string
  message: string
  description?: string
  chunks: DiffChunk[]
  stats: {
    added: number
    deleted: number
    modified: number
  }
  tags?: string[]
  rollbackTo?: boolean
}

interface DiffChunk {
  oldStart: number
  oldLines: number
  newStart: number
  newLines: number
  lines: DiffLine[]
}

interface DiffLine {
  oldLineNumber: number | null
  newLineNumber: number | null
  type: 'added' | 'deleted' | 'modified' | 'unchanged'
  content: string
}

interface Props {
  history: HistoryEntry[]
  currentEntryId?: string
  allowRollback?: boolean
  allowCompare?: boolean
  maxVisible?: number
}

const props = withDefaults(defineProps<Props>(), {
  allowRollback: true,
  allowCompare: true,
  maxVisible: 50,
})

const emit = defineEmits<{
  (e: 'select', entry: HistoryEntry): void
  (e: 'rollback', entryId: string): void
  (e: 'compare', entries: [HistoryEntry, HistoryEntry]): void
  (e: 'delete', entryId: string): void
  (e: 'tag', entryId: string, tags: string[]): void
}>()

const selectedEntries = ref<Set<string>>(new Set())
const expandedEntry = ref<string | null>(null)
const filterTag = ref<string | null>(null)
const searchQuery = ref('')

const filteredHistory = computed(() => {
  let filtered = props.history

  if (filterTag.value) {
    filtered = filtered.filter((entry) =>
      entry.tags?.includes(filterTag.value!)
    )
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (entry) =>
        entry.message.toLowerCase().includes(query) ||
        entry.author.toLowerCase().includes(query) ||
        entry.description?.toLowerCase().includes(query)
    )
  }

  return filtered.slice(0, props.maxVisible)
})

const allTags = computed(() => {
  const tags = new Set<string>()
  for (const entry of props.history) {
    entry.tags?.forEach((tag) => tags.add(tag))
  }
  return Array.from(tags)
})

const canCompare = computed(() => selectedEntries.value.size === 2)

const toggleEntrySelection = (entryId: string) => {
  if (selectedEntries.value.has(entryId)) {
    selectedEntries.value.delete(entryId)
  } else {
    if (selectedEntries.value.size < 2) {
      selectedEntries.value.add(entryId)
    }
  }
}

const handleCompare = () => {
  if (!canCompare.value) return

  const entries = Array.from(selectedEntries.value)
    .map((id) => props.history.find((h) => h.id === id))
    .filter(Boolean) as HistoryEntry[]

  if (entries.length === 2) {
    emit('compare', [entries[0], entries[1]])
    selectedEntries.value.clear()
  }
}

const toggleExpand = (entryId: string) => {
  expandedEntry.value = expandedEntry.value === entryId ? null : entryId
}

const formatTimeAgo = (timestamp: number) => {
  return useTimeAgo(timestamp).value
}

const getEntryIcon = (entry: HistoryEntry) => {
  if (entry.rollbackTo) return '↩️'
  if (entry.stats.added > entry.stats.deleted) return '📈'
  if (entry.stats.deleted > entry.stats.added) return '📉'
  return '📝'
}
</script>

<template>
  <div class="diff-history-timeline">
    <!-- Header -->
    <div class="timeline-header">
      <h3 class="timeline-title">
        <span class="title-icon">📜</span>
        History Timeline
        <span class="entry-count">({{ filteredHistory.length }})</span>
      </h3>

      <div class="timeline-filters">
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="Search history..."
        />

        <select v-model="filterTag" class="tag-filter">
          <option :value="null">All tags</option>
          <option v-for="tag in allTags" :key="tag" :value="tag">
            {{ tag }}
          </option>
        </select>

        <button
          v-if="allowCompare"
          class="btn-compare"
          :disabled="!canCompare"
          @click="handleCompare"
        >
          Compare Selected ({{ selectedEntries.size }})
        </button>
      </div>
    </div>

    <!-- Timeline -->
    <div class="timeline-container">
      <div
        v-for="(entry, index) in filteredHistory"
        :key="entry.id"
        :class="[
          'timeline-entry',
          { current: entry.id === currentEntryId },
          { expanded: expandedEntry === entry.id },
          { selected: selectedEntries.has(entry.id) },
        ]"
      >
        <!-- Timeline connector -->
        <div class="timeline-connector">
          <div class="connector-line" />
          <div class="connector-dot" :class="`entry-type-${entry.stats.added > entry.stats.deleted ? 'add' : entry.stats.deleted > entry.stats.added ? 'delete' : 'neutral'}`">
            {{ getEntryIcon(entry) }}
          </div>
        </div>

        <!-- Entry content -->
        <div class="entry-content" @click="toggleExpand(entry.id)">
          <div class="entry-header">
            <div class="entry-meta">
              <img
                v-if="entry.avatar"
                :src="entry.avatar"
                :alt="entry.author"
                class="author-avatar"
              />
              <div v-else class="author-avatar placeholder">
                {{ entry.author.charAt(0).toUpperCase() }}
              </div>

              <div class="meta-info">
                <span class="author-name">{{ entry.author }}</span>
                <span class="entry-time" :title="new Date(entry.timestamp).toLocaleString()">
                  {{ formatTimeAgo(entry.timestamp) }}
                </span>
              </div>
            </div>

            <div class="entry-stats">
              <span v-if="entry.stats.added > 0" class="stat-add">
                +{{ entry.stats.added }}
              </span>
              <span v-if="entry.stats.deleted > 0" class="stat-delete">
                -{{ entry.stats.deleted }}
              </span>
              <span v-if="entry.stats.modified > 0" class="stat-modify">
                ~{{ entry.stats.modified }}
              </span>
            </div>
          </div>

          <div class="entry-message">
            {{ entry.message }}
            <span v-if="entry.description" class="entry-description">
              — {{ entry.description }}
            </span>
          </div>

          <!-- Tags -->
          <div v-if="entry.tags?.length" class="entry-tags">
            <span v-for="tag in entry.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>

          <!-- Expanded content -->
          <div v-if="expandedEntry === entry.id" class="entry-details">
            <div class="details-section">
              <h4>Changes Preview</h4>
              <div class="changes-preview">
                <div
                  v-for="(chunk, cIdx) in entry.chunks.slice(0, 3)"
                  :key="cIdx"
                  class="preview-chunk"
                >
                  <div class="chunk-header">
                    @@ -{{ chunk.oldStart }},{{ chunk.oldLines }} +{{ chunk.newStart }},{{ chunk.newLines }}
                  </div>
                  <div class="chunk-lines">
                    <div
                      v-for="(line, lIdx) in chunk.lines.slice(0, 5)"
                      :key="lIdx"
                      :class="['preview-line', `line-${line.type}`]"
                    >
                      <span class="line-marker">
                        {{ line.type === 'added' ? '+' : line.type === 'deleted' ? '-' : ' ' }}
                      </span>
                      <span class="line-content">{{ line.content.slice(0, 80) }}</span>
                    </div>
                    <div v-if="chunk.lines.length > 5" class="more-lines">
                      ... {{ chunk.lines.length - 5 }} more lines
                    </div>
                  </div>
                </div>
                <div v-if="entry.chunks.length > 3" class="more-chunks">
                  ... {{ entry.chunks.length - 3 }} more chunks
                </div>
              </div>
            </div>

            <div class="entry-actions">
              <button class="btn-select" @click.stop="toggleEntrySelection(entry.id)">
                {{ selectedEntries.has(entry.id) ? 'Deselect' : 'Select' }}
              </button>
              <button
                v-if="allowRollback && entry.id !== currentEntryId"
                class="btn-rollback"
                @click.stop="$emit('rollback', entry.id)"
              >
                Rollback to this
              </button>
              <button class="btn-view" @click.stop="$emit('select', entry)">
                View Full Diff
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredHistory.length === 0" class="empty-state">
        <span class="empty-icon">🔍</span>
        <p>No history entries found</p>
        <span v-if="searchQuery || filterTag" class="empty-hint">
          Try adjusting your filters
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.diff-history-timeline {
  @apply flex flex-col bg-white dark:bg-gray-900 rounded-lg overflow-hidden;
}

.timeline-header {
  @apply flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4;
  @apply border-b border-gray-200 dark:border-gray-700;
}

.timeline-title {
  @apply flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white;
}

.title-icon {
  @apply text-xl;
}

.entry-count {
  @apply text-sm font-normal text-gray-500 dark:text-gray-400;
}

.timeline-filters {
  @apply flex flex-wrap items-center gap-3;
}

.search-input {
  @apply px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md;
  @apply bg-white dark:bg-gray-800 text-sm;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
  @apply w-48;
}

.tag-filter {
  @apply px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md;
  @apply bg-white dark:bg-gray-800 text-sm;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.btn-compare {
  @apply px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium;
  @apply hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed;
  @apply transition-colors;
}

.timeline-container {
  @apply flex-1 overflow-y-auto px-6 py-4;
}

.timeline-entry {
  @apply flex gap-4 mb-6 relative;
}

.timeline-entry.current {
  @apply bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-3 -mx-3;
}

.timeline-entry.selected {
  @apply bg-green-50/50 dark:bg-green-900/10;
}

.timeline-connector {
  @apply flex flex-col items-center shrink-0 w-8;
}

.connector-line {
  @apply w-0.5 flex-1 bg-gray-300 dark:bg-gray-600;
}

.timeline-entry:first-child .connector-line:first-child {
  @apply bg-transparent;
}

.timeline-entry:last-child .connector-line:last-child {
  @apply bg-transparent;
}

.connector-dot {
  @apply w-8 h-8 rounded-full flex items-center justify-center text-sm;
  @apply bg-white dark:bg-gray-800 border-2;
  @apply shrink-0 z-10;
}

.entry-type-add {
  @apply border-green-500 text-green-600;
}

.entry-type-delete {
  @apply border-red-500 text-red-600;
}

.entry-type-neutral {
  @apply border-gray-400 text-gray-600;
}

.entry-content {
  @apply flex-1 min-w-0 cursor-pointer;
}

.entry-header {
  @apply flex items-center justify-between gap-4 mb-2;
}

.entry-meta {
  @apply flex items-center gap-3;
}

.author-avatar {
  @apply w-8 h-8 rounded-full object-cover;
}

.author-avatar.placeholder {
  @apply bg-blue-600 text-white flex items-center justify-center font-semibold text-sm;
}

.meta-info {
  @apply flex flex-col;
}

.author-name {
  @apply text-sm font-medium text-gray-900 dark:text-white;
}

.entry-time {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

.entry-stats {
  @apply flex gap-2 text-xs font-medium;
}

.stat-add {
  @apply text-green-600 dark:text-green-400;
}

.stat-delete {
  @apply text-red-600 dark:text-red-400;
}

.stat-modify {
  @apply text-yellow-600 dark:text-yellow-400;
}

.entry-message {
  @apply text-sm text-gray-700 dark:text-gray-300 mb-2;
}

.entry-description {
  @apply text-gray-500 dark:text-gray-400;
}

.entry-tags {
  @apply flex flex-wrap gap-1 mb-2;
}

.tag {
  @apply px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400;
  @apply text-xs rounded-full;
}

.entry-details {
  @apply mt-4 pt-4 border-t border-gray-200 dark:border-gray-700;
}

.details-section h4 {
  @apply text-sm font-medium text-gray-900 dark:text-white mb-3;
}

.changes-preview {
  @apply bg-gray-50 dark:bg-gray-800 rounded-lg p-3 font-mono text-xs;
  @apply overflow-x-auto;
}

.preview-chunk {
  @apply mb-3 last:mb-0;
}

.chunk-header {
  @apply text-gray-500 dark:text-gray-400 mb-1;
}

.preview-line {
  @apply flex;
}

.line-add {
  @apply bg-green-100/50 dark:bg-green-900/20;
}

.line-delete {
  @apply bg-red-100/50 dark:bg-red-900/20;
}

.line-marker {
  @apply w-4 shrink-0;
}

.line-content {
  @apply truncate;
}

.more-lines,
.more-chunks {
  @apply text-gray-500 dark:text-gray-400 italic mt-2;
}

.entry-actions {
  @apply flex gap-3 mt-4;
}

.btn-select {
  @apply px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300;
  @apply rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700;
  @apply transition-colors;
}

.btn-rollback {
  @apply px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300;
  @apply rounded text-sm hover:bg-yellow-200 dark:hover:bg-yellow-900/50;
  @apply transition-colors;
}

.btn-view {
  @apply px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300;
  @apply rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50;
  @apply transition-colors;
}

.empty-state {
  @apply flex flex-col items-center justify-center py-12 text-center;
}

.empty-icon {
  @apply text-4xl mb-4;
}

.empty-state p {
  @apply text-gray-600 dark:text-gray-400 mb-2;
}

.empty-hint {
  @apply text-sm text-gray-500 dark:text-gray-500;
}
</style>
