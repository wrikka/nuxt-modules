<script setup lang="ts">
interface Option {
  id: string | number
  label: string
  children?: Option[]
  disabled?: boolean
}

interface Props {
  modelValue?: string | number | null
  options: Option[]
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'Select...',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  change: [option: Option | null]
}>()

const isOpen = ref(false)
const activePath = ref<(string | number)[]>([])
const containerRef = ref<HTMLDivElement>()

const selectedOption = computed(() => {
  const findOption = (options: Option[], path: (string | number)[]): Option | null => {
    const [id, ...rest] = path
    const option = options.find(o => o.id === id)
    if (!option) return null
    if (rest.length === 0) return option
    if (!option.children) return null
    return findOption(option.children, rest)
  }
  return activePath.value.length > 0 ? findOption(props.options, activePath.value) : null
})

const selectOption = (option: Option, level: number) => {
  activePath.value = [...activePath.value.slice(0, level), option.id]
  
  if (!option.children || option.children.length === 0) {
    emit('update:modelValue', option.id)
    emit('change', option)
    isOpen.value = false
  }
}

const getOptionsAtLevel = (level: number): Option[] => {
  let current = props.options
  for (let i = 0; i < level && i < activePath.value.length; i++) {
    const option = current.find(o => o.id === activePath.value[i])
    current = option?.children || []
  }
  return current
}

const clearSelection = () => {
  activePath.value = []
  emit('update:modelValue', null)
  emit('change', null)
}

const goBack = () => {
  if (activePath.value.length > 0) {
    activePath.value = activePath.value.slice(0, -1)
  }
}

onClickOutside(containerRef, () => {
  isOpen.value = false
})
</script>

<template>
  <div ref="containerRef" class="relative">
    <button
      type="button"
      class="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-left hover:bg-gray-50"
      :disabled="disabled"
      @click="isOpen = !isOpen"
    >
      <span :class="{ 'text-gray-400': !selectedOption }">
        {{ selectedOption?.label || placeholder }}
      </span>
      <span class="i-lucide-chevron-down size-4 text-gray-400" />
    </button>

    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 w-full min-w-[200px] rounded-lg border border-gray-200 bg-white shadow-lg"
    >
      <div v-if="activePath.length > 0" class="border-b border-gray-100 px-4 py-2">
        <button
          type="button"
          class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          @click="goBack"
        >
          <span class="i-lucide-arrow-left size-4" />
          Back
        </button>
      </div>

      <div class="flex">
        <div
          v-for="level in activePath.length + 1"
          :key="level - 1"
          class="min-w-[150px] border-r border-gray-100 last:border-0"
        >
          <div
            v-for="option in getOptionsAtLevel(level - 1)"
            :key="option.id"
            class="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-100"
            :class="{
              'bg-blue-50': activePath[level - 1] === option.id,
              'opacity-50': option.disabled
            }"
            @click="!option.disabled && selectOption(option, level - 1)"
          >
            {{ option.label }}
            <span
              v-if="option.children && option.children.length > 0"
              class="i-lucide-chevron-right size-4 text-gray-400"
            />
          </div>
        </div>
      </div>

      <div v-if="selectedOption" class="border-t border-gray-100 px-4 py-2">
        <button
          type="button"
          class="text-sm text-red-600 hover:text-red-700"
          @click="clearSelection"
        >
          Clear selection
        </button>
      </div>
    </div>
  </div>
</template>
