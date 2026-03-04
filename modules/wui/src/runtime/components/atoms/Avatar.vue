<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const _sizeClasses = computed(() => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }
  return sizes[props.size]
})

const _fallbackInitial = computed(() => {
  return props.fallback ? props.fallback.charAt(0).toUpperCase() : ''
})
</script>

<template>
  <div :class="['relative inline-flex shrink-0 overflow-hidden rounded-full', sizeClasses, props.class]">
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      class="aspect-square h-full w-full object-cover"
    />
    <div
      v-else-if="fallback"
      class="flex h-full w-full items-center justify-center bg-muted text-muted-foreground"
    >
      {{ fallbackInitial }}
    </div>
    <div
      v-else
      class="flex h-full w-full items-center justify-center bg-muted"
    >
      <div class="i-lucide-user h-1/2 w-1/2 text-muted-foreground" />
    </div>
  </div>
</template>
