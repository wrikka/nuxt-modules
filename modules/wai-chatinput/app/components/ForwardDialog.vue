<template>
  <div class="forward-dialog">
    <button
      @click="showDialog = true"
      class="p-1 hover:bg-gray-100 rounded"
      title="ส่งต่อข้อความ"
    >
      <Icon name="mdi:share" class="w-4 h-4 text-gray-400" />
    </button>

    <div
      v-if="showDialog"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="showDialog = false"
    >
      <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md" @click.stop>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium">ส่งต่อข้อความ</h3>
          <button @click="showDialog = false" class="p-1 hover:bg-gray-100 rounded">
            <Icon name="mdi:close" class="w-5 h-5" />
          </button>
        </div>

        <div class="mb-4 p-3 bg-gray-50 rounded-lg">
          <div class="text-sm text-gray-500 mb-1">ข้อความที่จะส่งต่อ:</div>
          <div class="text-sm line-clamp-2">{{ message.content }}</div>
        </div>

        <div class="mb-4">
          <label class="text-sm text-gray-600 block mb-2">ส่งไปยัง:</label>
          <div class="space-y-2 max-h-48 overflow-y-auto">
            <label
              v-for="conv in availableConversations"
              :key="conv.id"
              class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <input
                v-model="selectedConversations"
                :value="conv.id"
                type="checkbox"
                class="rounded"
              />
              <div class="flex-1">
                <div class="text-sm font-medium">{{ conv.title }}</div>
                <div class="text-xs text-gray-400">{{ conv.messages.length }} ข้อความ</div>
              </div>
            </label>
          </div>
        </div>

        <div class="mb-4">
          <label class="text-sm text-gray-600 block mb-1">โน้ต (ไม่บังคับ)</label>
          <input
            v-model="note"
            placeholder="เพิ่มข้อความประกอบ..."
            class="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div class="flex gap-2">
          <button
            @click="forward"
            :disabled="selectedConversations.length === 0 || isForwarding"
            class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {{ isForwarding ? 'กำลังส่ง...' : `ส่งต่อ (${selectedConversations.length})` }}
          </button>
          <button
            @click="showDialog = false"
            class="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMessageForwarding } from '../../../../wcomposables/packages/composables/src/chat/useMessageForwarding'
import type { ChatMessage } from '../../../../wcomposables/packages/composables/src/types/chat'

const props = defineProps<{
  message: ChatMessage
  currentConversationId: string
  conversations: any[]
  currentUserId: string
  userName: string
}>()

const emit = defineEmits<{
  forwarded: []
}>()

const { isForwarding, forwardMessage } = useMessageForwarding()

const showDialog = ref(false)
const selectedConversations = ref<string[]>([])
const note = ref('')

const availableConversations = computed(() =>
  props.conversations.filter(c => c.id !== props.currentConversationId)
)

import { computed } from 'vue'

const forward = async () => {
  for (const convId of selectedConversations.value) {
    await forwardMessage(
      props.message,
      props.currentConversationId,
      convId,
      props.userName,
      note.value
    )
  }

  showDialog.value = false
  selectedConversations.value = []
  note.value = ''
  emit('forwarded')
}
</script>
