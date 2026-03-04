<script setup lang="ts">
import { computed, ref } from 'vue'

interface FilterCriteria {
  type?: ('added' | 'deleted' | 'modified' | 'unchanged')[]
  author?: string[]
  dateRange?: { start: Date; end: Date }
  filePattern?: string
  contentPattern?: string
  lineRange?: { start: number; end: number }
  sizeRange?: { min: number; max: number }
  tags?: string[]
}

interface FilterPreset {
  id: string
  name: string
  criteria: FilterCriteria
  icon?: string
}

interface Props {
  availableAuthors?: string[]
  availableTags?: string[]
  presets?: FilterPreset[]
  showPresets?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showPresets: true,
})

const emit = defineEmits<{
  (e: 'filter', criteria: FilterCriteria): void
  (e: 'filterChange', criteria: FilterCriteria): void
  (e: 'savePreset', preset: Omit<FilterPreset, 'id'>): void
  (e: 'loadPreset', presetId: string): void
  (e: 'clear'): void
}>()

const activeCriteria = ref<FilterCriteria>({})
const showAdvanced = ref(false)
const selectedTypes = ref<string[]>([])
const selectedAuthors = ref<string[]>([])
const dateStart = ref('')
const dateEnd = ref('')
const filePattern = ref('')
const contentPattern = ref('')
const lineStart = ref<number | null>(null)
const lineEnd = ref<number | null>(null)
const selectedTags = ref<string[]>([])
const presetName = ref('')
const isSavingPreset = ref(false)

const hasActiveFilters = computed(() => {
  return (
    selectedTypes.value.length > 0 ||
    selectedAuthors.value.length > 0 ||
    dateStart.value ||
    dateEnd.value ||
    filePattern.value ||
    contentPattern.value ||
    lineStart.value !== null ||
    lineEnd.value !== null ||
    selectedTags.value.length > 0
  )
})

const activeFilterCount = computed(() => {
  let count = 0
  if (selectedTypes.value.length > 0) count++
  if (selectedAuthors.value.length > 0) count++
  if (dateStart.value || dateEnd.value) count++
  if (filePattern.value) count++
  if (contentPattern.value) count++
  if (lineStart.value !== null || lineEnd.value !== null) count++
  if (selectedTags.value.length > 0) count++
  return count
})

const applyFilters = () => {
  const criteria: FilterCriteria = {}

  if (selectedTypes.value.length > 0) {
    criteria.type = selectedTypes.value as FilterCriteria['type']
  }

  if (selectedAuthors.value.length > 0) {
    criteria.author = selectedAuthors.value
  }

  if (dateStart.value || dateEnd.value) {
    criteria.dateRange = {
      start: dateStart.value ? new Date(dateStart.value) : new Date(0),
      end: dateEnd.value ? new Date(dateEnd.value) : new Date(),
    }
  }

  if (filePattern.value) {
    criteria.filePattern = filePattern.value
  }

  if (contentPattern.value) {
    criteria.contentPattern = contentPattern.value
  }

  if (lineStart.value !== null || lineEnd.value !== null) {
    criteria.lineRange = {
      start: lineStart.value ?? 1,
      end: lineEnd.value ?? Infinity,
    }
  }

  if (selectedTags.value.length > 0) {
    criteria.tags = selectedTags.value
  }

  activeCriteria.value = criteria
  emit('filter', criteria)
  emit('filterChange', criteria)
}

const clearFilters = () => {
  selectedTypes.value = []
  selectedAuthors.value = []
  dateStart.value = ''
  dateEnd.value = ''
  filePattern.value = ''
  contentPattern.value = ''
  lineStart.value = null
  lineEnd.value = null
  selectedTags.value = []
  activeCriteria.value = {}
  emit('clear')
}

const saveAsPreset = () => {
  if (!presetName.value.trim()) return

  const preset = {
    name: presetName.value,
    criteria: { ...activeCriteria.value },
    icon: '🔖',
  }

  emit('savePreset', preset)
  isSavingPreset.value = false
  presetName.value = ''
}

const loadPreset = (preset: FilterPreset) => {
  selectedTypes.value = preset.criteria.type ?? []
  selectedAuthors.value = preset.criteria.author ?? []
  if (preset.criteria.dateRange) {
    dateStart.value = preset.criteria.dateRange.start.toISOString().split('T')[0]
    dateEnd.value = preset.criteria.dateRange.end.toISOString().split('T')[0]
  }
  filePattern.value = preset.criteria.filePattern ?? ''
  contentPattern.value = preset.criteria.contentPattern ?? ''
  if (preset.criteria.lineRange) {
    lineStart.value = preset.criteria.lineRange.start
    lineEnd.value = preset.criteria.lineRange.end
  }
  selectedTags.value = preset.criteria.tags ?? []

  applyFilters()
  emit('loadPreset', preset.id)
}

const toggleType = (type: string) => {
  const index = selectedTypes.value.indexOf(type)
  if (index > -1) {
    selectedTypes.value.splice(index, 1)
  } else {
    selectedTypes.value.push(type)
  }
  applyFilters()
}

const typeColors: Record<string, string> = {
  added: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  deleted: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  modified: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  unchanged: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

const typeIcons: Record<string, string> = {
  added: '+',
  deleted: '−',
  modified: '~',
  unchanged: '=',
}
</script>

<template>
  <div class="diff-filter-panel">
    <!-- Header -->
    <div class="filter-header">
      <div class="filter-title">
        <span class="title-icon">🔍</span>
        Filters
        <span v-if="activeFilterCount > 0" class="filter-badge">
          {{ activeFilterCount }}
        </span>
      </div>
      <div class="filter-actions">
        <button
          v-if="hasActiveFilters"
          class="btn-clear"
          @click="clearFilters"
        >
          Clear all
        </button>
        <button
          class="btn-advanced"
          :class="{ active: showAdvanced }"
          @click="showAdvanced = !showAdvanced"
        >
          Advanced
        </button>
      </div>
    </div>

    <!-- Quick filters -->
    <div class="quick-filters">
      <div class="filter-group">
        <label class="group-label">Change Type</label>
        <div class="type-toggles">
          <button
            v-for="type in ['added', 'deleted', 'modified', 'unchanged']"
            :key="type"
            :class="[
              'type-btn',
              typeColors[type],
              { active: selectedTypes.includes(type) },
            ]"
            @click="toggleType(type)"
          >
            <span class="type-icon">{{ typeIcons[type] }}</span>
            <span class="type-label">{{ type }}</span>
          </button>
        </div>
      </div>

      <div v-if="availableTags?.length" class="filter-group">
        <label class="group-label">Tags</label>
        <div class="tag-chips">
          <button
            v-for="tag in availableTags"
            :key="tag"
            :class="['tag-chip', { active: selectedTags.includes(tag) }]"
            @click="
              selectedTags.includes(tag)
                ? selectedTags.splice(selectedTags.indexOf(tag), 1)
                : selectedTags.push(tag);
              applyFilters()
            "
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <div v-if="availableAuthors?.length" class="filter-group">
        <label class="group-label">Authors</label>
        <select
          v-model="selectedAuthors"
          multiple
          class="author-select"
          @change="applyFilters"
        >
          <option
            v-for="author in availableAuthors"
            :key="author"
            :value="author"
          >
            {{ author }}
          </option>
        </select>
      </div>
    </div>

    <!-- Advanced filters -->
    <div v-if="showAdvanced" class="advanced-filters">
      <div class="filter-group">
        <label class="group-label">Date Range</label>
        <div class="date-inputs">
          <input
            v-model="dateStart"
            type="date"
            class="date-input"
            @change="applyFilters"
          />
          <span class="date-separator">to</span>
          <input
            v-model="dateEnd"
            type="date"
            class="date-input"
            @change="applyFilters"
          />
        </div>
      </div>

      <div class="filter-group">
        <label class="group-label">File Pattern</label>
        <input
          v-model="filePattern"
          type="text"
          class="text-input"
          placeholder="e.g., *.ts, src/**"
          @input="applyFilters"
        />
      </div>

      <div class="filter-group">
        <label class="group-label">Content Pattern</label>
        <input
          v-model="contentPattern"
          type="text"
          class="text-input"
          placeholder="Search in diff content..."
          @input="applyFilters"
        />
      </div>

      <div class="filter-group">
        <label class="group-label">Line Range</label>
        <div class="range-inputs">
          <input
            v-model.number="lineStart"
            type="number"
            class="number-input"
            placeholder="From"
            @input="applyFilters"
          />
          <span class="range-separator">-</span>
          <input
            v-model.number="lineEnd"
            type="number"
            class="number-input"
            placeholder="To"
            @input="applyFilters"
          />
        </div>
      </div>
    </div>

    <!-- Presets -->
    <div v-if="showPresets && presets?.length" class="filter-presets">
      <label class="group-label">Saved Presets</label>
      <div class="preset-list">
        <button
          v-for="preset in presets"
          :key="preset.id"
          class="preset-btn"
          @click="loadPreset(preset)"
        >
          <span class="preset-icon">{{ preset.icon || '🔖' }}</span>
          <span class="preset-name">{{ preset.name }}</span>
        </button>
      </div>
    </div>

    <!-- Save preset -->
    <div class="save-preset-section">
      <button
        v-if="!isSavingPreset && hasActiveFilters"
        class="btn-save-preset"
        @click="isSavingPreset = true"
      >
        + Save current as preset
      </button>
      <div v-else-if="isSavingPreset" class="save-preset-form">
        <input
          v-model="presetName"
          type="text"
          class="text-input"
          placeholder="Preset name..."
          @keyup.enter="saveAsPreset"
        />
        <button class="btn-confirm" @click="saveAsPreset">Save</button>
        <button class="btn-cancel" @click="isSavingPreset = false">Cancel</button>
      </div>
    </div>

    <!-- Active filters summary -->
    <div v-if="hasActiveFilters" class="active-filters">
      <label class="group-label">Active Filters</label>
      <div class="filter-chips">
        <span
          v-for="type in selectedTypes"
          :key="type"
          class="filter-chip"
        >
          {{ typeIcons[type] }} {{ type }}
          <button @click="toggleType(type)">×</button>
        </span>
        <span
          v-for="author in selectedAuthors"
          :key="author"
          class="filter-chip"
        >
          👤 {{ author }}
          <button
            @click="
              selectedAuthors.splice(selectedAuthors.indexOf(author), 1);
              applyFilters()
            "
          >
            ×
          </button>
        </span>
        <span v-if="dateStart || dateEnd" class="filter-chip">
          📅 {{ dateStart || '...' }} - {{ dateEnd || '...' }}
          <button
            @click="
              dateStart = '';
              dateEnd = '';
              applyFilters()
            "
          >
            ×
          </button>
        </span>
        <span v-if="filePattern" class="filter-chip">
          📁 {{ filePattern }}
          <button
            @click="
              filePattern = '';
              applyFilters()
            "
          >
            ×
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.diff-filter-panel {
  @apply bg-white dark:bg-gray-900 rounded-lg p-4 space-y-4;
}

.filter-header {
  @apply flex items-center justify-between;
}

.filter-title {
  @apply flex items-center gap-2 font-semibold text-gray-900 dark:text-white;
}

.title-icon {
  @apply text-lg;
}

.filter-badge {
  @apply px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300;
  @apply text-xs rounded-full font-medium;
}

.filter-actions {
  @apply flex gap-2;
}

.btn-clear,
.btn-advanced {
  @apply px-3 py-1 text-sm rounded-md;
  @apply transition-colors;
}

.btn-clear {
  @apply text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20;
}

.btn-advanced {
  @apply text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800;
}

.btn-advanced.active {
  @apply bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300;
}

.quick-filters {
  @apply space-y-4;
}

.filter-group {
  @apply space-y-2;
}

.group-label {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300;
}

.type-toggles {
  @apply flex flex-wrap gap-2;
}

.type-btn {
  @apply flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium;
  @apply opacity-60 hover:opacity-100 transition-opacity;
}

.type-btn.active {
  @apply opacity-100 ring-2 ring-offset-2 ring-blue-500;
}

.type-icon {
  @apply font-bold;
}

.type-label {
  @apply capitalize;
}

.tag-chips {
  @apply flex flex-wrap gap-2;
}

.tag-chip {
  @apply px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300;
  @apply text-sm rounded-full cursor-pointer transition-colors;
  @apply hover:bg-gray-200 dark:hover:bg-gray-700;
}

.tag-chip.active {
  @apply bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300;
}

.author-select {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md;
  @apply bg-white dark:bg-gray-800 text-sm;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
  min-height: 100px;
}

.advanced-filters {
  @apply pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4;
}

.date-inputs,
.range-inputs {
  @apply flex items-center gap-3;
}

.date-input,
.text-input,
.number-input {
  @apply px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md;
  @apply bg-white dark:bg-gray-800 text-sm;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.date-input {
  @apply flex-1;
}

.date-separator,
.range-separator {
  @apply text-gray-500 dark:text-gray-400;
}

.number-input {
  @apply w-24;
}

.filter-presets {
  @apply pt-4 border-t border-gray-200 dark:border-gray-700;
}

.preset-list {
  @apply flex flex-wrap gap-2;
}

.preset-btn {
  @apply flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800;
  @apply border border-gray-200 dark:border-gray-700 rounded-md;
  @apply text-sm hover:bg-gray-100 dark:hover:bg-gray-700;
  @apply transition-colors;
}

.preset-icon {
  @apply text-sm;
}

.save-preset-section {
  @apply pt-4 border-t border-gray-200 dark:border-gray-700;
}

.btn-save-preset {
  @apply w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300;
  @apply rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700;
  @apply transition-colors;
}

.save-preset-form {
  @apply flex items-center gap-2;
}

.btn-confirm {
  @apply px-3 py-2 bg-blue-600 text-white rounded-md text-sm;
  @apply hover:bg-blue-700 transition-colors;
}

.btn-cancel {
  @apply px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300;
  @apply rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-700;
  @apply transition-colors;
}

.active-filters {
  @apply pt-4 border-t border-gray-200 dark:border-gray-700;
}

.filter-chips {
  @apply flex flex-wrap gap-2;
}

.filter-chip {
  @apply inline-flex items-center gap-1 px-3 py-1;
  @apply bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300;
  @apply text-sm rounded-full;
}

.filter-chip button {
  @apply ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800;
}
</style>
