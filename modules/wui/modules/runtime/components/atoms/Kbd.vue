<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline'
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'default'
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }
  return sizes[_props.size]
})

const variantClasses = computed(() => {
  const variants = {
    default: 'bg-muted text-muted-foreground border border-border',
    outline: 'bg-background text-foreground border border-border'
  }
  return variants[_props.variant]
})

const _classes = computed(() => [
  'inline-flex items-center justify-center font-mono font-medium rounded-md shadow-sm',
  sizeClasses.value,
  variantClasses.value,
  _props.class
])
</script>

<template>
  <kbd :class="_classes">
    <slot />
  </kbd>
</template>
