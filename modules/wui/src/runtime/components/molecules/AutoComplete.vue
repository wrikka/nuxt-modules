<script setup lang="ts">
interface Suggestion {
  id: string | number
  label: string
  icon?: string
  description?: string
}

interface Props {
  modelValue?: string
  suggestions: Suggestion[]
  placeholder?: string
  minChars?: number
  delay?: number
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Type to search...',
  minChars: 1,
  delay: 300,
  loading: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  select: [suggestion: Suggestion]
  search: [query: string]
}>()

const inputRef = ref<HTMLInputElement>()
const isOpen = ref(false)
const highlightedIndex = ref(-1)
const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

const value = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
    
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value)
    }
    
    searchTimeout.value = setTimeout(() => {
      if (val.length >= props.minChars) {
        emit('search', val)
        isOpen.value = true
        highlightedIndex.value = -1
      } else {
        isOpen.value = false
      }
    }, props.delay)
  }
})

const filteredSuggestions = computed(() => {
  return props.suggestions
})

const selectSuggestion = (suggestion: Suggestion) => {
  value.value = suggestion.label
  isOpen.value = false
  emit('select', suggestion)
}

const highlightNext = () => {
  if (highlightedIndex.value < filteredSuggestions.value.length - 1) {
    highlightedIndex.value++
  }
}

const highlightPrev = () => {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value--
  }
}

const selectHighlighted = () => {
  if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredSuggestions.value.length) {
    selectSuggestion(filteredSuggestions.value[highlightedIndex.value])
  }
}

const onKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value) return
  
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      highlightNext()
      break
    case 'ArrowUp':
      e.preventDefault()
      highlightPrev()
      break
    case 'Enter':
      e.preventDefault()
      selectHighlighted()
      break
    case 'Escape':
      isOpen.value = false
      break
  }
}

const onBlur = () => {
  setTimeout(() => {
    isOpen.value = false
  }, 200)
}
</script>

<template>
  <div class="relative">
    <div class="relative">
      <Input
        ref="inputRef"
        v-model="value"
        :placeholder="placeholder"
        :disabled="disabled"
        @keydown="onKeydown"
        @blur="onBlur"
      />
      <div class="absolute right-3 top-1/2 -translate-y-1/2">
        <Spinner v-if="loading" size="sm" />
        <span v-else class="i-lucide-search size-4 text-gray-400" />
      </div>
    </div>

    <div
      v-if="isOpen && filteredSuggestions.length > 0"
      class="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
    >
      <div
        v-for="(suggestion, index) in filteredSuggestions"
        :key="suggestion.id"
        class="cursor-pointer px-4 py-2 hover:bg-gray-100"
        :class="{ 'bg-blue-50': index === highlightedIndex }"
        @mousedown="selectSuggestion(suggestion)"
      >
        <div class="flex items-center gap-2">
          <span v-if="suggestion.icon" :class="suggestion.icon" />
          <div>
            <div class="font-medium">{{ suggestion.label }}</div>
            <div v-if="suggestion.description" class="text-sm text-gray-500">
              {{ suggestion.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
