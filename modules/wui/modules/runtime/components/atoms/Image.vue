<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  src: string
  alt?: string
  width?: number | string
  height?: number | string
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'full'
  loading?: 'lazy' | 'eager'
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  alt: '',
  fit: 'cover',
  rounded: false,
  loading: 'lazy'
})

const fitClasses = computed(() => {
  const fits = {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down'
  }
  return fits[_props.fit]
})

const roundedClasses = computed(() => {
  if (_props.rounded === false) return ''
  if (_props.rounded === true) return 'rounded-md'
  const rounded = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  }
  return rounded[_props.rounded]
})

const _style = computed(() => {
  const style: Record<string, string> = {}
  if (_props.width) style.width = typeof _props.width === 'number' ? `${_props.width}px` : _props.width
  if (_props.height) style.height = typeof _props.height === 'number' ? `${_props.height}px` : _props.height
  return style
})

const _classes = computed(() => [
  'block',
  fitClasses.value,
  roundedClasses.value,
  _props.class
])
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    :loading="loading"
    :class="_classes"
    :style="style"
  />
</template>
