<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'primary' | 'secondary' | 'muted' | 'destructive' | 'foreground'
  align?: 'left' | 'center' | 'right' | 'justify'
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  size: 'md',
  weight: 'normal',
  color: 'foreground',
  align: 'left'
})

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
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

const colorClasses = computed(() => {
  const colors = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    muted: 'text-muted-foreground',
    destructive: 'text-destructive',
    foreground: 'text-foreground'
  }
  return colors[_props.color]
})

const alignClasses = computed(() => {
  const aligns = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  }
  return aligns[_props.align]
})

const _classes = computed(() => [
  'leading-relaxed',
  sizeClasses.value,
  weightClasses.value,
  colorClasses.value,
  alignClasses.value,
  _props.class
])
</script>

<template>
  <p :class="_classes">
    <slot />
  </p>
</template>
