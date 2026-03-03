<template>
  <div class="conversations-sidebar w-64 border-r border-gray-200 flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <button
        @click="$emit('new-conversation')"
        class="w-full flex items-center justify-center px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
      >
        <Icon name="mdi:plus" class="w-4 h-4 mr-2" />
        การสนทนาใหม่
      </button>
    </div>

    <!-- Conversations List -->
    <div class="flex-1 overflow-y-auto">
      <div
        v-for="conversation in conversations"
        :key="conversation.id"
        @click="$emit('select-conversation', conversation.id)"
        :class="[
          'p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors',
          currentConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
        ]"
      >
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-gray-900 truncate">{{ conversation.title }}</h3>
              <p class="text-xs text-gray-500 mt-1">
                {{ conversation.messages.length }} ข้อความ
              </p>
              <p class="text-xs text-gray-400 mt-1">
                {{ _formatDate(conversation.updatedAt) }}
              </p>
            </div>
            <div class="flex gap-1">
              <button
                @click.stop="$emit('show-summary', conversation.id)"
                class="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                title="ดูสรุปการสนทนา"
              >
                <Icon name="mdi:text-box-outline" class="w-4 h-4" />
              </button>
              <button
                v-if="conversations.length > 1"
                @click.stop="$emit('delete-conversation', conversation.id)"
                class="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                title="ลบการสนทนา"
              >
                <Icon name="mdi:delete" class="w-4 h-4" />
              </button>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from '../../../shared/types/chat'

interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  updatedAt: Date
}

defineProps<{
  conversations: Conversation[]
  currentConversation: Conversation | null
}>()

defineEmits<{
  'new-conversation': []
  'select-conversation': [id: string]
  'show-summary': [id: string]
  'delete-conversation': [id: string]
}>()

const _formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('th-TH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
</style>
