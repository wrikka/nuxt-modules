<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'inline' | 'block'
  language?: string
  size?: 'sm' | 'md' | 'lg'
  theme?: 'light' | 'dark'
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  variant: 'inline',
  size: 'md',
  theme: 'dark'
})

const _variantClasses = computed(() => {
  const variants = {
    inline: 'inline',
    block: 'block'
  }
  return variants[_props.variant]
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }
  return sizes[_props.size]
})

const themeClasses = computed(() => {
  const themes = {
    light: 'bg-gray-100 text-gray-800 border border-gray-200',
    dark: 'bg-gray-800 text-gray-100 border border-gray-700'
  }
  return themes[_props.theme]
})

const _classes = computed(() => {
  const base = 'font-mono'
  const variantSpecific = _props.variant === 'inline'
    ? 'px-1 py-0.5 rounded'
    : 'p-4 rounded-md overflow-x-auto'
  
  return `${base} ${variantSpecific} ${sizeClasses.value} ${themeClasses.value} ${_props.class || ''}`
})

const _tag = computed(() => {
  return _props.variant === 'inline' ? 'code' : 'pre'
})
</script>

<template>
  <component :is="tag" :class="_classes">
    <slot />
  </component>
</template>
