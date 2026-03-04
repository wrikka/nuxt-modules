<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: string[]
  placeholder?: string
  maxTags?: number
  separator?: string[]
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Add tag...',
  maxTags: Infinity,
  separator: () => [',', 'Enter'],
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const inputValue = ref('')

const canAdd = computed(() => props.modelValue.length < props.maxTags)

const addTag = () => {
  const trimmed = inputValue.value.trim()
  if (!trimmed || props.modelValue.includes(trimmed) || !canAdd.value) return
  
  emit('update:modelValue', [...props.modelValue, trimmed])
  inputValue.value = ''
}

const removeTag = (tag: string) => {
  emit('update:modelValue', props.modelValue.filter(t => t !== tag))
}

const handleKeydown = (e: KeyboardEvent) => {
  if (props.separator.includes(e.key) || (e.key === 'Enter' && !e.shiftKey)) {
    e.preventDefault()
    addTag()
  }
  if (e.key === 'Backspace' && !inputValue.value && props.modelValue.length > 0) {
    removeTag(props.modelValue[props.modelValue.length - 1])
  }
}

const handleBlur = () => {
  if (inputValue.value.trim()) {
    addTag()
  }
}
</script>

<template>
  <div
    class="flex min-h-[38px] flex-wrap items-center gap-1 rounded border border-gray-300 px-2 py-1.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 disabled:opacity-50"
    :class="{ 'opacity-50': disabled }"
  >
    <Tag
      v-for="tag in modelValue"
      :key="tag"
      :label="tag"
      removable
      size="sm"
      @remove="removeTag(tag)"
    />
    <input
      v-model="inputValue"
      type="text"
      :placeholder="canAdd ? placeholder : 'Max tags reached'"
      :disabled="disabled || !canAdd"
      class="min-w-[80px] flex-1 bg-transparent outline-none"
      @keydown="handleKeydown"
      @blur="handleBlur"
    />
  </div>
</template>
