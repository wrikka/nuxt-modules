<template>
  <div ref="messagesContainer" class="chat-messages max-h-60 overflow-y-auto bg-gray-50 p-4 rounded-lg">
    <div v-for="msg in messages" :key="msg.id" class="mb-4">
      <div :class="msg.role === 'user' ? 'text-right' : 'text-left'">
        <div :class="['inline-block p-3 rounded-lg max-w-xs break-words relative group', msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900']">
          <!-- Reply indicator -->
          <div v-if="msg.parentId" class="text-xs opacity-70 mb-1">
            <Icon name="mdi:reply" class="w-3 h-3 inline mr-1" />
            ตอบกลับข้อความก่อนหน้า
          </div>

          <!-- Message content -->
          <div v-if="msg.content" class="mb-2">{{ msg.content }}</div>

          <!-- File attachments -->
          <div v-if="msg.attachments && msg.attachments.length > 0" class="space-y-2">
            <div
              v-for="file in msg.attachments"
              :key="file.name"
              class="border rounded p-2 bg-white bg-opacity-90"
            >
              <!-- Image preview -->
              <div v-if="file.type.startsWith('image/')" class="text-center">
                <img
                  :src="getFilePreview(file)"
                  :alt="file.name"
                  class="max-w-full max-h-32 rounded object-cover mx-auto"
                />
                <div class="text-xs mt-1 text-gray-600">{{ file.name }}</div>
              </div>

              <!-- Document preview -->
              <div v-else class="flex items-center space-x-2">
                <Icon name="mdi:file-document-outline" class="w-4 h-4 text-gray-500" />
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium truncate">{{ file.name }}</div>
                  <div class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Message actions -->
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click="$emit('reply', msg)"
              class="p-1 bg-black bg-opacity-20 hover:bg-opacity-30 rounded transition-colors"
              title="ตอบกลับข้อความนี้"
            >
              <Icon name="mdi:reply" class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'

const props = defineProps<{
  messages: { id: number, role: 'user' | 'ai', content: string, attachments?: File[], parentId?: number }[]
}>()

const emit = defineEmits<{
  reply: [message: { id: number, role: 'user' | 'ai', content: string, attachments?: File[], parentId?: number }]
}>()

const messagesContainer = ref<HTMLElement>()

const getFilePreview = (file: File): string => {
  return URL.createObjectURL(file)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / k ** i).toFixed(2)) + ' ' + sizes[i]
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

onMounted(scrollToBottom)
watch(() => props.messages, scrollToBottom, { deep: true })
</script>

<style scoped>
.chat-messages {
  min-height: 0;
}
</style>
