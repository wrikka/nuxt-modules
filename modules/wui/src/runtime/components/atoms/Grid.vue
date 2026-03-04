<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto'
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  cols: 'auto',
  gap: 'md',
  align: 'stretch',
  justify: 'start'
})

const colsClasses = computed(() => {
  if (_props.cols === 'auto') return 'grid-cols-auto'
  return `grid-cols-${_props.cols}`
})

const gapClasses = computed(() => {
  const gaps = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }
  return gaps[_props.gap]
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
  'grid',
  colsClasses.value,
  gapClasses.value,
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
