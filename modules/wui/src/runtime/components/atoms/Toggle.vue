<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  pressed?: boolean
  disabled?: boolean
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  pressed: false,
  disabled: false,
  variant: 'default',
  size: 'default'
})

const emit = defineEmits<{
  'update:pressed': [pressed: boolean]
}>()

const _classes = computed(() => {
  const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
  
  const variants = {
    default: _props.pressed 
      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
      : 'bg-transparent hover:bg-accent hover:text-accent-foreground',
    outline: _props.pressed
      ? 'bg-accent text-accent-foreground border border-input'
      : 'bg-transparent hover:bg-accent hover:text-accent-foreground border border-input'
  }
  
  const sizes = {
    default: 'h-10 px-3',
    sm: 'h-9 px-2.5',
    lg: 'h-11 px-5'
  }
  
  return `${base} ${variants[_props.variant]} ${sizes[_props.size]} ${_props.class || ''}`
})

const _onClick = () => {
  if (!_props.disabled) {
    emit('update:pressed', !_props.pressed)
  }
}
</script>

<template>
  <button
    type="button"
    :class="_classes"
    :disabled="_props.disabled"
    :aria-pressed="_props.pressed"
    @click="_onClick"
  >
    <slot />
  </button>
</template>
