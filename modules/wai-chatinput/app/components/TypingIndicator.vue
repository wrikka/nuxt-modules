<template>
  <div v-if="typingUsers.length > 0" class="typing-indicator flex items-center gap-2 text-sm text-gray-500">
    <span class="flex gap-1">
      <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0s" />
      <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s" />
      <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s" />
    </span>
    <span>{{ typingText }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  typingUsers: string[]
}>()

const typingText = computed(() => {
  if (props.typingUsers.length === 0) return ''
  if (props.typingUsers.length === 1) return `${props.typingUsers[0]} กำลังพิมพ์...`
  if (props.typingUsers.length === 2) return `${props.typingUsers[0]} และ ${props.typingUsers[1]} กำลังพิมพ์...`
  return `${props.typingUsers[0]} และอีก ${props.typingUsers.length - 1} คน กำลังพิมพ์...`
})
</script>
