<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const _sizeClasses = computed(() => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }
  return sizes[props.size]
})
</script>

<template>
  <div :class="['animate-spin', _sizeClasses, props.class]">
    <div class="i-lucide-loader-2 h-full w-full" />
  </div>
</template>
