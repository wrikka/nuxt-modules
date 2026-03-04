<template>
  <div class="thread-view">
    <div
      v-for="thread in threadedMessages"
      :key="thread.id"
      class="thread-item mb-4"
    >
      <div class="message p-3 rounded-lg" :class="thread.role === 'user' ? 'bg-blue-50' : 'bg-gray-50'">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium" :class="thread.role === 'user' ? 'text-blue-600' : 'text-gray-600'">
            {{ thread.role === 'user' ? 'คุณ' : 'AI' }}
          </span>
          <span class="text-xs text-gray-400">{{ formatDate(thread.timestamp) }}</span>
        </div>
        <div class="text-sm">{{ thread.content }}</div>

        <button
          v-if="thread.replies.length > 0"
          @click="toggleThread(thread.id.toString())"
          class="mt-2 text-xs flex items-center gap-1 text-blue-500 hover:text-blue-700"
        >
          <Icon :name="isExpanded(thread.id.toString()) ? 'mdi:chevron-down' : 'mdi:chevron-right'" class="w-4 h-4" />
          {{ thread.replies.length }} การตอบกลับ
        </button>
      </div>

      <div
        v-if="isExpanded(thread.id.toString())"
        class="thread-replies ml-8 mt-2 pl-4 border-l-2 border-gray-200"
      >
        <ThreadView
          v-if="thread.replies.length > 0"
          :threaded-messages="thread.replies"
          :expanded-threads="expandedThreads"
          @toggle="toggleThread"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ThreadMessage } from '../../../wcomposables/packages/composables/src/chat/useMessageThreading'

const props = defineProps<{
  threadedMessages: ThreadMessage[]
  expandedThreads: Set<string>
}>()

const emit = defineEmits<{
  toggle: [threadId: string]
}>()

const isExpanded = (threadId: string): boolean => {
  return props.expandedThreads.has(threadId)
}

const toggleThread = (threadId: string) => {
  emit('toggle', threadId)
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleString('th-TH', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
