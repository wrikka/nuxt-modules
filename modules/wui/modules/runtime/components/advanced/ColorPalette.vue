<script setup lang="ts">
import { computed } from 'vue'

interface ColorOption {
  value: string
  label?: string
}

interface Props {
  modelValue?: string
  colors?: ColorOption[]
  size?: 'sm' | 'md' | 'lg'
  allowCustom?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  colors: () => [
    { value: '#ef4444', label: 'Red' },
    { value: '#f97316', label: 'Orange' },
    { value: '#f59e0b', label: 'Amber' },
    { value: '#84cc16', label: 'Lime' },
    { value: '#22c55e', label: 'Green' },
    { value: '#10b981', label: 'Emerald' },
    { value: '#06b6d4', label: 'Cyan' },
    { value: '#3b82f6', label: 'Blue' },
    { value: '#6366f1', label: 'Indigo' },
    { value: '#8b5cf6', label: 'Violet' },
    { value: '#d946ef', label: 'Fuchsia' },
    { value: '#f43f5e', label: 'Rose' },
    { value: '#78716c', label: 'Stone' },
    { value: '#1c1917', label: 'Black' }
  ],
  size: 'md',
  allowCustom: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const _sizeClasses = computed(() => ({
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10'
}))

const _selectColor = (color: string) => {
  emit('update:modelValue', color)
}

const _handleCustomColor = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div :class="['flex flex-wrap gap-2', _props.class]">
    <button
      v-for="color in colors"
      :key="color.value"
      type="button"
      :class="[
        'rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
        _sizeClasses[size],
        modelValue === color.value && 'ring-2 ring-offset-2 ring-primary scale-110'
      ]"
      :style="{ backgroundColor: color.value }"
      :title="color.label || color.value"
      @click="_selectColor(color.value)"
    />
    
    <label
      v-if="allowCustom"
      class="relative flex items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 cursor-pointer transition-colors"
      :class="_sizeClasses[size]"
    >
      <span class="i-lucide-plus h-4 w-4 text-muted-foreground" />
      <input
        type="color"
        class="absolute inset-0 opacity-0 cursor-pointer"
        :value="modelValue || '#000000'"
        @input="_handleCustomColor"
      >
    </label>
  </div>
</template>
