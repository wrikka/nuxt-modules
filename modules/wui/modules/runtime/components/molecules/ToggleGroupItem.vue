<script setup lang="ts">
import { inject, computed } from 'vue'

interface Props {
  value: string
  disabled?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const toggleGroup = inject('toggleGroup') as {
  isSelected: (value: string) => boolean
  select: (value: string) => void
  disabled: boolean
  variant: 'default' | 'outline'
  size: 'default' | 'sm' | 'lg'
}

const isSelected = computed(() => toggleGroup.isSelected(_props.value))

const _classes = computed(() => {
  const base = 'inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
  
  const variants = {
    default: isSelected.value
      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
      : 'hover:bg-accent hover:text-accent-foreground',
    outline: isSelected.value
      ? 'bg-accent text-accent-foreground border border-input'
      : 'hover:bg-accent hover:text-accent-foreground'
  }
  
  const sizes = {
    default: 'h-10 px-3',
    sm: 'h-9 px-2.5',
    lg: 'h-11 px-5'
  }
  
  const _firstChild = 'rounded-l-md'
  const _lastChild = 'rounded-r-md'
  const _middle = 'rounded-none border-l-0'
  
  return `${base} ${variants[toggleGroup.variant]} ${sizes[toggleGroup.size]} ${_props.class || ''}`
})

const _onClick = () => {
  if (!_props.disabled && !toggleGroup.disabled) {
    toggleGroup.select(_props.value)
  }
}
</script>

<template>
  <button
    type="button"
    :class="_classes"
    :disabled="_props.disabled || toggleGroup.disabled"
    :aria-pressed="isSelected"
    @click="_onClick"
  >
    <slot />
  </button>
</template>
