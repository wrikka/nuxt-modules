<script setup lang="ts">
interface Props {
  modelValue?: string
  format?: 'hex' | 'rgb' | 'hsl'
  showAlpha?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '#3b82f6',
  format: 'hex',
  showAlpha: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const isOpen = ref(false)
const colorInputRef = ref<HTMLInputElement>()

const currentColor = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
})

const presetColors = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
  '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
  '#000000', '#6b7280', '#9ca3af', '#ffffff'
]

const selectPreset = (color: string) => {
  currentColor.value = color
}

const onColorInput = (e: Event) => {
  currentColor.value = (e.target as HTMLInputElement).value
}

const togglePicker = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}
</script>

<template>
  <div class="relative inline-flex items-center gap-2">
    <button
      type="button"
      class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 hover:bg-gray-50"
      :disabled="disabled"
      @click="togglePicker"
    >
      <span
        class="h-6 w-6 rounded border border-gray-200"
        :style="{ backgroundColor: currentColor }"
      />
      <span class="text-sm font-mono uppercase">{{ currentColor }}</span>
    </button>
    
    <div
      v-if="isOpen"
      class="absolute top-full left-0 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg"
    >
      <div class="mb-3">
        <input
          ref="colorInputRef"
          type="color"
          :value="currentColor"
          class="h-10 w-full cursor-pointer rounded border-0"
          @input="onColorInput"
        />
      </div>
      
      <div class="grid grid-cols-5 gap-1">
        <button
          v-for="color in presetColors"
          :key="color"
          type="button"
          class="h-6 w-full rounded border border-gray-200 transition-transform hover:scale-110"
          :style="{ backgroundColor: color }"
          @click="selectPreset(color)"
        />
      </div>
      
      <div class="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
        <span class="text-xs text-gray-500">{{ format.toUpperCase() }}</span>
        <input
          v-model="currentColor"
          type="text"
          class="flex-1 rounded border border-gray-200 px-2 py-1 text-sm"
        />
      </div>
    </div>
  </div>
</template>
