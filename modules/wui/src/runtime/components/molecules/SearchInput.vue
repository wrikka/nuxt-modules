<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  clearable?: boolean
  debounce?: number
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  disabled: false,
  loading: false,
  clearable: true,
  debounce: 300
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
  clear: []
}>()

const searchValue = ref(_props.modelValue || '')
const timeoutRef = ref<NodeJS.Timeout>()

watch(() => _props.modelValue, (newValue) => {
  searchValue.value = newValue || ''
})

const _onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchValue.value = target.value
  
  if (timeoutRef.value) clearTimeout(timeoutRef.value)
  
  timeoutRef.value = setTimeout(() => {
    emit('update:modelValue', searchValue.value)
    emit('search', searchValue.value)
  }, _props.debounce)
}

const _onClear = () => {
  searchValue.value = ''
  emit('update:modelValue', '')
  emit('clear')
}

const _showClearButton = computed(() => {
  return _props.clearable && searchValue.value && !_props.disabled && !_props.loading
})

const _classes = computed(() => [
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  _props.class
])
</script>

<template>
  <div class="relative">
    <div class="absolute left-3 top-1/2 -translate-y-1/2">
      <div class="i-lucide-search h-4 w-4 text-muted-foreground" />
    </div>
    
    <input
      :class="_classes"
      :value="searchValue"
      :placeholder="_props.placeholder"
      :disabled="_props.disabled"
      @input="_onInput"
    />
    
    <div v-if="_props.loading" class="absolute right-3 top-1/2 -translate-y-1/2">
      <div class="i-lucide-loader-2 h-4 w-4 animate-spin text-muted-foreground" />
    </div>
    
    <button
      v-else-if="_showClearButton"
      type="button"
      class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      @click="_onClear"
    >
      <div class="i-lucide-x h-4 w-4" />
    </button>
  </div>
</template>
