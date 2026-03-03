<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'primary' | 'secondary' | 'destructive'
  speed?: 'slow' | 'normal' | 'fast'
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'default',
  speed: 'normal'
})

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }
  return sizes[_props.size]
})

const variantClasses = computed(() => {
  const variants = {
    default: 'text-foreground',
    primary: 'text-primary',
    secondary: 'text-muted-foreground',
    destructive: 'text-destructive'
  }
  return variants[_props.variant]
})

const speedClasses = computed(() => {
  const speeds = {
    slow: 'animate-spin-slow',
    normal: 'animate-spin',
    fast: 'animate-spin-fast'
  }
  return speeds[_props.speed]
})

const _classes = computed(() => [
  'inline-block',
  sizeClasses.value,
  variantClasses.value,
  speedClasses.value,
  _props.class
])
</script>

<template>
  <div :class="_classes">
    <div class="i-lucide-loader-2 h-full w-full" />
  </div>
</template>
