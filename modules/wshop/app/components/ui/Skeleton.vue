<script setup lang="ts">
interface Props {
  lines?: number
  avatar?: boolean
  class?: string
}

withDefaults(defineProps<Props>(), {
  lines: 3,
  avatar: false
})
</script>

<template>
  <div
    role="status"
    aria-label="Loading content"
    class="animate-pulse"
    :class="$props.class"
  >
    <div class="flex items-center space-x-4" v-if="avatar">
      <div class="h-12 w-12 rounded-full bg-secondary-200" />
      <div class="flex-1 space-y-2">
        <div class="h-4 w-3/4 rounded bg-secondary-200" />
        <div class="h-3 w-1/2 rounded bg-secondary-200" />
      </div>
    </div>
    <div class="space-y-3" :class="avatar ? 'mt-4' : ''">
      <div
        v-for="i in lines"
        :key="i"
        class="h-4 rounded bg-secondary-200"
        :class="i === lines ? 'w-2/3' : 'w-full'"
      />
    </div>
    <span class="sr-only">Loading...</span>
  </div>
</template>
