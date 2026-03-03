<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  message?: string
  icon?: string
  retry?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  title: 'Error',
  message: 'Something went wrong. Please try again.',
  icon: 'i-lucide-alert-circle'
})

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div
    :class="[
      'flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive',
      _props.class
    ]"
    role="alert"
  >
    <span :class="[icon, 'h-5 w-5 shrink-0 mt-0.5']" />
    
    <div class="flex-1">
      <h3 class="font-semibold">{{ title }}</h3>
      <p class="mt-1 text-sm opacity-90">
        <slot>{{ message }}</slot>
      </p>
      
      <button
        v-if="retry"
        class="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
        @click="$emit('retry')"
      >
        <span class="i-lucide-refresh-cw h-4 w-4" />
        Try again
      </button>
    </div>
  </div>
</template>
