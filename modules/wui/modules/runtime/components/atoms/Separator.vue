<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  decorative: true
})

const _classes = computed(() => {
  const base = 'shrink-0 bg-border'
  const orientation = _props.orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]'
  
  return `${base} ${orientation} ${_props.class || ''}`
})
</script>

<template>
  <div
    :class="_classes"
    :role="!decorative ? 'separator' : undefined"
    :aria-orientation="orientation"
  />
</template>
