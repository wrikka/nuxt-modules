<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

interface Suggestion {
  value: string
  label: string
  icon?: string
}

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  suggestions?: Suggestion[]
  debounce?: number
  error?: string
  maxSuggestions?: number
}

const _props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  suggestions: () => [],
  debounce: 300,
  maxSuggestions: 8
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [value: string]
  'select': [suggestion: Suggestion]
}>()

const _showSuggestions = ref(false)
const _highlightedIndex = ref(-1)
const _searchContainer = ref<HTMLElement | null>(null)
let _debounceTimer: ReturnType<typeof setTimeout> | null = null

const _filteredSuggestions = computed(() => {
  const query = _props.modelValue.toLowerCase()
  if (!query) return _props.suggestions.slice(0, _props.maxSuggestions)
  
  return _props.suggestions
    .filter(s => s.label.toLowerCase().includes(query) || s.value.toLowerCase().includes(query))
    .slice(0, _props.maxSuggestions)
})

const _hasSuggestions = computed(() => _filteredSuggestions.value.length > 0)

const _classes = computed(() => [
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  _props.error && 'border-destructive'
])

const _onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  emit('update:modelValue', value)
  _showSuggestions.value = true
  _highlightedIndex.value = -1
  
  if (_debounceTimer) {
    clearTimeout(_debounceTimer)
  }
  
  _debounceTimer = setTimeout(() => {
    emit('search', value)
  }, _props.debounce)
}

const _onFocus = () => {
  _showSuggestions.value = true
}

const _onBlur = () => {
  setTimeout(() => {
    _showSuggestions.value = false
    _highlightedIndex.value = -1
  }, 150)
}

const _onKeydown = (event: KeyboardEvent) => {
  if (!_showSuggestions.value || !_hasSuggestions.value) return
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      _highlightedIndex.value = (_highlightedIndex.value + 1) % _filteredSuggestions.value.length
      break
    case 'ArrowUp':
      event.preventDefault()
      _highlightedIndex.value = _highlightedIndex.value <= 0 
        ? _filteredSuggestions.value.length - 1 
        : _highlightedIndex.value - 1
      break
    case 'Enter':
      event.preventDefault()
      if (_highlightedIndex.value >= 0) {
        _selectSuggestion(_filteredSuggestions.value[_highlightedIndex.value])
      }
      break
    case 'Escape':
      _showSuggestions.value = false
      _highlightedIndex.value = -1
      break
  }
}

const _selectSuggestion = (suggestion: Suggestion) => {
  emit('update:modelValue', suggestion.label)
  emit('select', suggestion)
  _showSuggestions.value = false
  _highlightedIndex.value = -1
}

const _clearSearch = () => {
  emit('update:modelValue', '')
  emit('search', '')
  _showSuggestions.value = false
}

const _handleClickOutside = (event: MouseEvent) => {
  if (_searchContainer.value && !_searchContainer.value.contains(event.target as Node)) {
    _showSuggestions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', _handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', _handleClickOutside)
  if (_debounceTimer) {
    clearTimeout(_debounceTimer)
  }
})
</script>

<template>
  <div ref="_searchContainer" class="relative space-y-2">
    <div class="relative flex items-center">
      <span class="i-lucide-search absolute left-3 h-4 w-4 text-muted-foreground" />
      <input
        :class="_classes"
        type="search"
        :value="modelValue"
        :placeholder="placeholder || 'Search...'"
        :disabled="disabled"
        @input="_onInput"
        @focus="_onFocus"
        @blur="_onBlur"
        @keydown="_onKeydown"
      />
      <div v-if="loading" class="absolute right-3">
        <WSpinner size="sm" />
      </div>
      <button
        v-else-if="modelValue"
        type="button"
        class="absolute right-3 p-1 hover:bg-accent rounded"
        @click="_clearSearch"
      >
        <span class="i-lucide-x h-4 w-4 text-muted-foreground" />
      </button>
    </div>
    
    <div
      v-if="_showSuggestions && _hasSuggestions"
      class="absolute z-50 w-full mt-1 rounded-md border bg-popover shadow-md"
    >
      <ul class="max-h-60 overflow-auto py-1">
        <li
          v-for="(suggestion, index) in _filteredSuggestions"
          :key="suggestion.value"
          :class="[
            'px-3 py-2 cursor-pointer flex items-center gap-2',
            index === _highlightedIndex ? 'bg-accent' : 'hover:bg-accent/50'
          ]"
          @mousedown.prevent
          @click="_selectSuggestion(suggestion)"
        >
          <span v-if="suggestion.icon" :class="[suggestion.icon, 'h-4 w-4 text-muted-foreground']" />
          <span>{{ suggestion.label }}</span>
        </li>
      </ul>
    </div>
    
    <WFormError v-if="error" :message="error" />
  </div>
</template>
