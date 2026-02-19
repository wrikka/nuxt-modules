<script setup lang="ts">
import { computed } from 'vue'
import type { Comment } from '~/../shared/types/whiteboard'

const props = defineProps<{
  comment: Comment
}>()

const formattedTimestamp = computed(() => {
  return new Date(props.comment.timestamp).toLocaleString()
})
</script>

<template>
  <div class="absolute p-3 rounded-lg bg-white shadow-lg border border-gray-200 w-64">
    <div class="flex items-center gap-2 mb-2">
      <div class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
        {{ comment.author.charAt(0).toUpperCase() }}
      </div>
      <div>
        <div class="font-semibold text-gray-900">{{ comment.author }}</div>
        <div class="text-xs text-gray-500">{{ formattedTimestamp }}</div>
      </div>
    </div>
    <p class="text-sm text-gray-800">{{ comment.text }}</p>
  </div>
</template>
