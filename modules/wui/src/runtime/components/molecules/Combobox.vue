<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Option {
  value: string | number
  label: string
  disabled?: boolean
}

interface Props {
  modelValue?: string | number
  options: Option[]
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  loading?: boolean
  clearable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select...',
  searchPlaceholder: 'Search...',
  disabled: false,
  loading: false,
  clearable: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const open = ref(false)
const search = ref('')
const inputRef = ref<HTMLInputElement>()

const filteredOptions = computed(() => {
  if (!search.value) return props.options
  return props.options.filter(opt => 
    opt.label.toLowerCase().includes(search.value.toLowerCase())
  )
})

const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected?.label || props.placeholder
})

const select = (value: string | number) => {
  emit('update:modelValue', value)
  open.value = false
  search.value = ''
}

const clear = () => {
  emit('update:modelValue', '')
}

watch(open, (val) => {
  if (val) {
    setTimeout(() => inputRef.value?.focus(), 100)
  }
})
</script>

<template>
  <div class="relative">
    <button
      type="button"
      class="flex w-full items-center justify-between rounded border border-gray-300 px-3 py-2 text-left hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
      :disabled="disabled || loading"
      @click="open = !open"
    >
      <span :class="{ 'text-gray-400': !modelValue }">{{ selectedLabel }}</span>
      <span class="i-lucide-chevron-down transition-transform" :class="{ 'rotate-180': open }" />
    </button>
    
    <div
      v-if="open"
      class="absolute z-50 mt-1 w-full rounded border border-gray-200 bg-white shadow-lg"
    >
      <div class="border-b border-gray-100 p-2">
        <div class="relative">
          <span class="i-lucide-search absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            ref="inputRef"
            v-model="search"
            type="text"
            :placeholder="searchPlaceholder"
            class="w-full rounded border border-gray-200 py-1.5 pl-8 pr-3 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
      
      <ul class="max-h-60 overflow-auto py-1">
        <li
          v-for="option in filteredOptions"
          :key="option.value"
          class="cursor-pointer px-3 py-2 hover:bg-gray-100"
          :class="{ 'bg-blue-50 text-blue-600': option.value === modelValue, 'opacity-50': option.disabled }"
          @click="!option.disabled && select(option.value)"
        >
          {{ option.label }}
        </li>
        <li v-if="filteredOptions.length === 0" class="px-3 py-2 text-gray-400">
          No results found
        </li>
      </ul>
    </div>
    
    <button
      v-if="clearable && modelValue"
      type="button"
      class="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      @click="clear"
    >
      <span class="i-lucide-x size-4" />
    </button>
  </div>
</template>
