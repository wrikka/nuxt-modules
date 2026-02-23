<template>
  <div class="chat-search">
    <!-- Search Input -->
    <div class="search-input-container">
      <div class="search-input-wrapper">
        <Icon name="lucide:search" class="search-icon" />
        <input
          v-model="searchQuery"
          @input="handleSearchInput"
          @focus="showSuggestions = true"
          @keydown.down="highlightNextSuggestion"
          @keydown.up="highlightPreviousSuggestion"
          @keydown.enter="selectSuggestion"
          @keydown.escape="showSuggestions = false"
          type="text"
          placeholder="Search messages..."
          class="search-input"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="clear-button"
        >
          <Icon name="lucide:x" class="w-4 h-4" />
        </button>
      </div>

      <!-- Search Suggestions -->
      <div v-if="showSuggestions && suggestions.length > 0" class="search-suggestions">
        <div
          v-for="(suggestion, index) in suggestions"
          :key="suggestion"
          @click="selectSuggestion(suggestion)"
          :class="[
            'suggestion-item',
            { 'is-highlighted': highlightedIndex === index }
          ]"
        >
          <Icon name="lucide:clock" class="w-4 h-4 text-gray-400" />
          <span>{{ suggestion }}</span>
        </div>
      </div>
    </div>

    <!-- Search Filters -->
    <div class="search-filters">
      <button
        @click="showFilterPanel = !showFilterPanel"
        :class="['filter-toggle', { 'has-active-filters': hasActiveFilters }]"
      >
        <Icon name="lucide:filter" class="w-4 h-4" />
        <span>Filters</span>
      </button>

      <div v-if="showFilterPanel" class="filter-panel">
        <!-- Date Range Filter -->
        <div class="filter-group">
          <label class="filter-label">Date Range</label>
          <div class="date-range-inputs">
            <input
              v-model="dateRange.start"
              type="date"
              class="date-input"
            />
            <span class="date-separator">to</span>
            <input
              v-model="dateRange.end"
              type="date"
              class="date-input"
            />
          </div>
        </div>

        <!-- Message Type Filter -->
        <div class="filter-group">
          <label class="filter-label">Message Type</label>
          <div class="checkbox-group">
            <label v-for="type in messageTypes" :key="type" class="checkbox-label">
              <input
                v-model="selectedMessageTypes"
                :value="type"
                type="checkbox"
                class="checkbox"
              />
              <span class="checkbox-text">{{ capitalizeFirst(type) }}</span>
            </label>
          </div>
        </div>

        <!-- Has Attachments Filter -->
        <div class="filter-group">
          <label class="checkbox-label">
            <input
              v-model="hasAttachments"
              type="checkbox"
              class="checkbox"
            />
            <span class="checkbox-text">Has attachments</span>
          </label>
        </div>

        <!-- Filter Actions -->
        <div class="filter-actions">
          <button
            @click="applyFilters"
            class="apply-filters-button"
          >
            Apply Filters
          </button>
          <button
            @click="clearFilters"
            class="clear-filters-button"
          >
            Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="isSearching" class="search-loading">
      <Icon name="lucide:loader-2" class="animate-spin w-5 h-5" />
      <span>Searching...</span>
    </div>

    <div v-else-if="hasResults" class="search-results">
      <div class="results-header">
        <span class="results-count">{{ resultCount }} results found</span>
        <button
          @click="clearSearch"
          class="clear-results-button"
        >
          Clear
        </button>
      </div>

      <div class="results-list">
        <div
          v-for="result in searchResults"
          :key="result.message.id"
          class="result-item"
          @click="goToMessage(result)"
        >
          <!-- Result Header -->
          <div class="result-header">
            <span class="result-session">{{ result.sessionTitle }}</span>
            <span class="result-time">{{ formatMessageTime(result.message.timestamp) }}</span>
          </div>

          <!-- Result Content -->
          <div class="result-content">
            <div v-html="highlightText(result.message.content, searchQuery)"></div>
          </div>

          <!-- Result Context -->
          <div v-if="showContext && (result.context.before || result.context.after)" class="result-context">
            <div v-if="result.context.before" class="context-before">
              <span class="context-label">Before:</span>
              <div class="context-text">{{ result.context.before }}</div>
            </div>
            <div v-if="result.context.after" class="context-after">
              <span class="context-label">After:</span>
              <div class="context-text">{{ result.context.after }}</div>
            </div>
          </div>

          <!-- Relevance Indicator -->
          <div class="relevance-indicator">
            <div class="relevance-bar" :style="{ width: result.relevance + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="searchQuery && !isSearching" class="no-results">
      <Icon name="lucide:search-x" class="w-8 h-8 text-gray-400" />
      <span>No results found for "{{ searchQuery }}"</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useChatSearch } from '../../composables/features'
import type { ChatSearchResult } from '../../types/domain'

interface Props {
  showContext?: boolean
  autoFocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showContext: true,
  autoFocus: false
})

const emit = defineEmits<{
  messageSelected: [result: ChatSearchResult]
}>()

const {
  searchQuery,
  searchResults,
  isSearching,
  hasResults,
  resultCount,
  searchMessages,
  highlightText,
  clearSearch,
  searchByDateRange,
  getSearchSuggestions
} = useChatSearch()

// UI State
const showSuggestions = ref(false)
const showFilterPanel = ref(false)
const highlightedIndex = ref(-1)
const suggestions = ref<string[]>([])

// Filter State
const dateRange = ref({ start: '', end: '' })
const selectedMessageTypes = ref<string[]>(['user', 'assistant'])
const hasAttachments = ref(false)
const messageTypes = ['user', 'assistant', 'system']

const hasActiveFilters = computed(() => {
  return dateRange.value.start || 
         dateRange.value.end || 
         selectedMessageTypes.value.length < messageTypes.length ||
         hasAttachments.value
})

let searchTimeout: NodeJS.Timeout

function handleSearchInput() {
  clearTimeout(searchTimeout)
  
  // Update suggestions
  if (searchQuery.value.length > 0) {
    suggestions.value = getSearchSuggestions(searchQuery.value)
  } else {
    suggestions.value = []
  }
  
  // Debounced search
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim()) {
      performSearch()
    }
  }, 300)
}

async function performSearch() {
  const filter = {
    dateRange: dateRange.value.start && dateRange.value.end ? {
      start: new Date(dateRange.value.start),
      end: new Date(dateRange.value.end)
    } : undefined,
    messageTypes: selectedMessageTypes.value.length > 0 ? 
      selectedMessageTypes.value as ('user' | 'assistant' | 'system')[] : undefined,
    hasAttachments: hasAttachments.value || undefined
  }

  await searchMessages(searchQuery.value, filter)
}

function selectSuggestion(suggestion?: string) {
  if (suggestion) {
    searchQuery.value = suggestion
  }
  showSuggestions.value = false
  highlightedIndex.value = -1
  performSearch()
}

function highlightNextSuggestion() {
  if (suggestions.value.length === 0) return
  highlightedIndex.value = (highlightedIndex.value + 1) % suggestions.value.length
}

function highlightPreviousSuggestion() {
  if (suggestions.value.length === 0) return
  highlightedIndex.value = highlightedIndex.value <= 0 ? 
    suggestions.value.length - 1 : highlightedIndex.value - 1
}

function applyFilters() {
  showFilterPanel.value = false
  performSearch()
}

function clearFilters() {
  dateRange.value = { start: '', end: '' }
  selectedMessageTypes.value = ['user', 'assistant']
  hasAttachments.value = false
  showFilterPanel.value = false
  performSearch()
}

function goToMessage(result: ChatSearchResult) {
  emit('messageSelected', result)
}

function formatMessageTime(timestamp: Date): string {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (days === 1) {
    return 'Yesterday'
  } else if (days < 7) {
    return timestamp.toLocaleDateString([], { weekday: 'short' })
  } else {
    return timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
  if (!(e.target as HTMLElement).closest('.chat-search')) {
    showSuggestions.value = false
  }
})
</script>

<style scoped>
.chat-search {
  @apply space-y-4;
}

.search-input-container {
  @apply relative;
}

.search-input-wrapper {
  @apply relative flex items-center;
}

.search-icon {
  @apply absolute left-3 text-gray-400 w-5 h-5;
}

.search-input {
  @apply w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.clear-button {
  @apply absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors;
}

.search-suggestions {
  @apply absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10;
}

.suggestion-item {
  @apply flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors;
}

.suggestion-item.is-highlighted {
  @apply bg-gray-100 dark:bg-gray-800;
}

.search-filters {
  @apply space-y-2;
}

.filter-toggle {
  @apply flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors;
}

.filter-toggle.has-active-filters {
  @apply border-blue-500 bg-blue-50 dark:bg-blue-900/20;
}

.filter-panel {
  @apply bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4 border border-gray-200 dark:border-gray-700;
}

.filter-group {
  @apply space-y-2;
}

.filter-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.date-range-inputs {
  @apply flex items-center gap-2;
}

.date-input {
  @apply flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900;
}

.date-separator {
  @apply text-sm text-gray-500;
}

.checkbox-group {
  @apply space-y-1;
}

.checkbox-label {
  @apply flex items-center gap-2 text-sm cursor-pointer;
}

.checkbox {
  @apply rounded border-gray-300 text-blue-600 focus:ring-blue-500;
}

.checkbox-text {
  @apply text-gray-700 dark:text-gray-300;
}

.filter-actions {
  @apply flex gap-2 pt-2;
}

.apply-filters-button {
  @apply px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors;
}

.clear-filters-button {
  @apply px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
}

.search-loading {
  @apply flex items-center gap-2 text-gray-500;
}

.results-header {
  @apply flex items-center justify-between mb-3;
}

.results-count {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.clear-results-button {
  @apply text-sm text-blue-500 hover:text-blue-600 transition-colors;
}

.results-list {
  @apply space-y-3;
}

.result-item {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer;
}

.result-header {
  @apply flex items-center justify-between mb-2;
}

.result-session {
  @apply text-sm font-medium text-gray-900 dark:text-gray-100;
}

.result-time {
  @apply text-xs text-gray-500;
}

.result-content {
  @apply text-sm text-gray-700 dark:text-gray-300 mb-2;
}

.result-context {
  @apply space-y-2 text-xs text-gray-600 dark:text-gray-400;
}

.context-before,
.context-after {
  @apply space-y-1;
}

.context-label {
  @apply font-medium;
}

.context-text {
  @apply italic;
}

.relevance-indicator {
  @apply mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden;
}

.relevance-bar {
  @apply h-full bg-blue-500 transition-all duration-300;
}

.no-results {
  @apply flex flex-col items-center gap-2 text-gray-500 py-8;
}
</style>
