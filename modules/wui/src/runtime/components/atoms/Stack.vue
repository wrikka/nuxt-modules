<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  direction?: 'vertical' | 'horizontal'
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  direction: 'vertical',
  spacing: 'md',
  align: 'stretch',
  justify: 'start'
})

const directionClasses = computed(() => {
  const directions = {
    vertical: 'flex-col',
    horizontal: 'flex-row'
  }
  return directions[_props.direction]
})

const spacingClasses = computed(() => {
  const spacings = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }
  return spacings[_props.spacing]
})

const alignClasses = computed(() => {
  const aligns = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  }
  return aligns[_props.align]
})

const justifyClasses = computed(() => {
  const justifies = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }
  return justifies[_props.justify]
})

const _classes = computed(() => [
  'flex',
  directionClasses.value,
  spacingClasses.value,
  alignClasses.value,
  justifyClasses.value,
  _props.class
])
</script>

<template>
  <div :class="_classes">
    <slot />
  </div>
</template>
