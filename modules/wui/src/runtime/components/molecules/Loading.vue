<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  loading?: boolean
  text?: string
  overlay?: boolean
  blur?: boolean
  size?: 'sm' | 'md' | 'lg'
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  loading: true,
  overlay: false,
  blur: false,
  size: 'md'
})

const _sizeClasses = computed(() => ({
  sm: 'h-6 w-6',
  md: 'h-10 w-10',
  lg: 'h-16 w-16'
}))
</script>

<template>
  <div
    v-if="loading"
    :class="[
      'flex items-center justify-center',
      overlay && 'absolute inset-0 z-50 bg-background/80',
      blur && 'backdrop-blur-sm',
      _props.class
    ]"
  >
    <div class="flex flex-col items-center gap-3">
      <div
        :class="['animate-spin rounded-full border-4 border-primary border-t-transparent', _sizeClasses[size]]"
      />
      <p v-if="text" class="text-sm text-muted-foreground">{{ text }}</p>
    </div>
  </div>
</template>
