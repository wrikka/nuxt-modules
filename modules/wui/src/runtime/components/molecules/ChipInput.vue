<script setup lang="ts">
interface Chip {
  id: string
  label: string
  color?: string
}

interface Props {
  modelValue?: Chip[]
  placeholder?: string
  maxChips?: number
  allowDuplicates?: boolean
  separator?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: 'Type and press Enter...',
  allowDuplicates: false,
  separator: () => [',', 'Enter']
})

const emit = defineEmits<{
  'update:modelValue': [chips: Chip[]]
  add: [chip: Chip]
  remove: [chip: Chip]
}>()

const inputValue = ref('')
const inputRef = ref<HTMLInputElement>()

const chips = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const canAddMore = computed(() => {
  if (!props.maxChips) return true
  return chips.value.length < props.maxChips
})

const addChip = () => {
  const value = inputValue.value.trim()
  if (!value) return
  if (!canAddMore.value) return
  
  if (!props.allowDuplicates && chips.value.some(c => c.label === value)) {
    inputValue.value = ''
    return
  }
  
  const newChip: Chip = {
    id: Math.random().toString(36).substr(2, 9),
    label: value
  }
  
  chips.value = [...chips.value, newChip]
  emit('add', newChip)
  inputValue.value = ''
}

const removeChip = (chip: Chip) => {
  chips.value = chips.value.filter(c => c.id !== chip.id)
  emit('remove', chip)
}

const removeLastChip = () => {
  if (inputValue.value === '' && chips.value.length > 0) {
    const lastChip = chips.value[chips.value.length - 1]
    removeChip(lastChip)
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || props.separator.includes(e.key)) {
    e.preventDefault()
    addChip()
  } else if (e.key === 'Backspace') {
    removeLastChip()
  }
}

const onBlur = () => {
  if (inputValue.value.trim()) {
    addChip()
  }
}
</script>

<template>
  <div
    class="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"
    @click="inputRef?.focus()"
  >
    <span
      v-for="chip in chips"
      :key="chip.id"
      class="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
      :class="chip.color"
    >
      {{ chip.label }}
      <button
        type="button"
        class="rounded-full p-0.5 hover:bg-blue-200"
        @click.stop="removeChip(chip)"
      >
        <span class="i-lucide-x size-3" />
      </button>
    </span>
    
    <input
      ref="inputRef"
      v-model="inputValue"
      type="text"
      class="min-w-[120px] flex-1 border-0 bg-transparent p-1 text-sm outline-none"
      :placeholder="chips.length === 0 ? placeholder : ''"
      :disabled="!canAddMore"
      @keydown="handleKeydown"
      @blur="onBlur"
    />
  </div>
</template>
