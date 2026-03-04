<script setup lang="ts">
import { ref, computed } from 'vue'

interface Option {
  value: string | number
  label: string
  disabled?: boolean
}

interface Props {
  modelValue: (string | number)[]
  options: Option[]
  placeholder?: string
  max?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select items...',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: (string | number)[]]
}>()

const open = ref(false)

const selectedLabels = computed(() => {
  return props.options
    .filter(opt => props.modelValue.includes(opt.value))
    .map(opt => opt.label)
})

const isSelected = (value: string | number) => props.modelValue.includes(value)

const toggle = (value: string | number) => {
  if (props.disabled) return
  
  const current = [...props.modelValue]
  const index = current.indexOf(value)
  
  if (index > -1) {
    current.splice(index, 1)
  } else if (!props.max || current.length < props.max) {
    current.push(value)
  }
  
  emit('update:modelValue', current)
}

const remove = (value: string | number) => {
  emit('update:modelValue', props.modelValue.filter(v => v !== value))
}
</script>

<template>
  <div class="relative">
    <button
      type="button"
      class="flex min-h-[38px] w-full flex-wrap items-center gap-1 rounded border border-gray-300 px-2 py-1.5 text-left hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
      :disabled="disabled"
      @click="open = !open"
    >
      <template v-if="modelValue.length === 0">
        <span class="text-gray-400">{{ placeholder }}</span>
      </template>
      <template v-else>
        <Tag
          v-for="label in selectedLabels"
          :key="label"
          :label="label"
          removable
          size="sm"
          @remove="remove(options.find(o => o.label === label)?.value as string | number)"
        />
      </template>
      <span class="i-lucide-chevron-down ml-auto transition-transform" :class="{ 'rotate-180': open }" />
    </button>
    
    <div
      v-if="open"
      class="absolute z-50 mt-1 w-full rounded border border-gray-200 bg-white shadow-lg"
    >
      <ul class="max-h-60 overflow-auto py-1">
        <li
          v-for="option in options"
          :key="option.value"
          class="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-100"
          :class="{ 'opacity-50': option.disabled }"
          @click="!option.disabled && toggle(option.value)"
        >
          <Checkbox :model-value="isSelected(option.value)" readonly />
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>
