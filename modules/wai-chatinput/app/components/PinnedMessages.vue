<template>
  <div class="pinned-messages">
    <div class="flex items-center justify-between p-3 border-b">
      <h3 class="font-medium flex items-center gap-2">
        <Icon name="mdi:pin" class="w-5 h-5 text-blue-500" />
        ข้อความปักหมุด ({{ pinnedMessages.length }})
      </h3>
      <button @click="showAll = !showAll" class="text-sm text-blue-500 hover:underline">
        {{ showAll ? 'ซ่อน' : 'ดูทั้งหมด' }}
      </button>
    </div>

    <div v-if="pinnedMessages.length === 0" class="p-4 text-center text-gray-400 text-sm">
      ยังไม่มีข้อความปักหมุด
    </div>

    <div v-else class="divide-y">
      <div
        v-for="pinned in displayedMessages"
        :key="pinned.messageId"
        class="p-3 hover:bg-gray-50"
      >
        <div class="flex items-start gap-2">
          <div class="flex-1">
            <div v-if="pinned.note" class="text-xs text-blue-600 mb-1">{{ pinned.note }}</div>
            <div class="text-sm line-clamp-2">{{ getMessageContent(pinned.messageId) }}</div>
            <div class="flex items-center gap-2 mt-2 text-xs text-gray-400">
              <span>ปักหมุดโดย {{ pinned.pinnedBy }}</span>
              <span>{{ formatDate(pinned.pinnedAt) }}</span>
            </div>
          </div>
          <button
            @click="unpin(pinned.messageId)"
            class="p-1 hover:bg-red-100 rounded text-red-500"
            title="ยกเลิกปักหมุด"
          >
            <Icon name="mdi:pin-off" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePinnedMessages } from '../../../../wcomposables/packages/composables/src/chat/usePinnedMessages'
import type { ChatMessage } from '../../../../wcomposables/packages/composables/src/types/chat'

const props = defineProps<{
  conversationId: string
  messages: ChatMessage[]
}>()

const { pinnedMessages, unpinMessage } = usePinnedMessages()
const showAll = ref(false)

const conversationPins = computed(() =>
  pinnedMessages.value.filter(p => p.conversationId === props.conversationId)
)

const displayedMessages = computed(() =>
  showAll.value ? conversationPins.value : conversationPins.value.slice(0, 3)
)

const getMessageContent = (messageId: number): string => {
  const msg = props.messages.find(m => m.id === messageId)
  return msg?.content || 'ไม่พบข้อความ'
}

const unpin = (messageId: number) => {
  unpinMessage(messageId, props.conversationId)
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })
}
</script>
