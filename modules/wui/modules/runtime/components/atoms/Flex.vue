<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  direction: 'row',
  wrap: 'nowrap',
  gap: 'none',
  align: 'stretch',
  justify: 'start'
})

const directionClasses = computed(() => {
  const directions = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse'
  }
  return directions[_props.direction]
})

const wrapClasses = computed(() => {
  const wraps = {
    nowrap: 'flex-nowrap',
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse'
  }
  return wraps[_props.wrap]
})

const gapClasses = computed(() => {
  const gaps = {
    none: '',
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
    stretch: 'items-stretch',
    baseline: 'items-baseline'
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
  wrapClasses.value,
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
