<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  level: 2,
  size: 'lg',
  weight: 'semibold'
})

const tag = computed(() => `h${_props.level}`)

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl'
  }
  return sizes[_props.size]
})

const weightClasses = computed(() => {
  const weights = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }
  return weights[_props.weight]
})

const _classes = computed(() => [
  'leading-none tracking-tight',
  sizeClasses.value,
  weightClasses.value,
  _props.class
])
</script>

<template>
  <component :is="tag" :class="_classes">
    <slot />
  </component>
</template>
