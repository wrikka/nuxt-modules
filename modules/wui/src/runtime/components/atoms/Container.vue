<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  centered?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  size: 'lg',
  padding: 'md',
  centered: true
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  }
  return sizes[_props.size]
})

const paddingClasses = computed(() => {
  const paddings = {
    none: '',
    sm: 'px-4 sm:px-6',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-4 sm:px-6 lg:px-8 xl:px-12'
  }
  return paddings[_props.padding]
})

const centeredClasses = computed(() => {
  return _props.centered ? 'mx-auto' : ''
})

const _classes = computed(() => [
  'w-full',
  sizeClasses.value,
  paddingClasses.value,
  centeredClasses.value,
  _props.class
])
</script>

<template>
  <div :class="_classes">
    <slot />
  </div>
</template>
