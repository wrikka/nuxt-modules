<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  orientation?: 'horizontal' | 'vertical'
  thickness?: 'thin' | 'normal' | 'thick'
  variant?: 'solid' | 'dashed' | 'dotted'
  color?: 'border' | 'muted' | 'primary' | 'destructive'
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  thickness: 'normal',
  variant: 'solid',
  color: 'border'
})

const orientationClasses = computed(() => {
  const orientations = {
    horizontal: 'w-full h-px',
    vertical: 'h-full w-px'
  }
  return orientations[_props.orientation]
})

const thicknessClasses = computed(() => {
  const thicknesses = {
    thin: _props.orientation === 'horizontal' ? 'h-px' : 'w-px',
    normal: _props.orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
    thick: _props.orientation === 'horizontal' ? 'h-1' : 'w-1'
  }
  return thicknesses[_props.thickness]
})

const variantClasses = computed(() => {
  const variants = {
    solid: '',
    dashed: 'border-dashed',
    dotted: 'border-dotted'
  }
  return variants[_props.variant]
})

const colorClasses = computed(() => {
  const colors = {
    border: 'bg-border',
    muted: 'bg-muted',
    primary: 'bg-primary',
    destructive: 'bg-destructive'
  }
  return colors[_props.color]
})

const _classes = computed(() => [
  'shrink-0',
  orientationClasses.value,
  thicknessClasses.value,
  variantClasses.value,
  colorClasses.value,
  _props.class
])
</script>

<template>
  <div :class="_classes" role="separator" />
</template>
