<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

interface Message {
  id: string
  type: 'text' | 'image' | 'file'
  content: string
  sender: { id: string; name: string; avatar?: string }
  time: Date
  status?: 'sending' | 'sent' | 'delivered' | 'read'
  reactions?: Array<{ emoji: string; count: number }>
}

interface Props {
  messages: Message[]
  currentUserId: string
  loading?: boolean
  showAvatars?: boolean
  showTimestamps?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showAvatars: true,
  showTimestamps: true
})

const emit = defineEmits<{
  'sendMessage': [content: string, type: 'text' | 'image' | 'file']
  'reaction': [messageId: string, emoji: string]
  'loadMore': []
}>()

const messageInput = ref('')
const messagesContainer = ref<HTMLElement>()
const hasMore = ref(true)

const isCurrentUser = (senderId: string) => senderId === props.currentUserId

const sendMessage = () => {
  if (!messageInput.value.trim()) return
  emit('sendMessage', messageInput.value, 'text')
  messageInput.value = ''
}

const scrollToBottom = async () => {
  await nextTick()
  messagesContainer.value?.scrollTo({
    top: messagesContainer.value.scrollHeight,
    behavior: 'smooth'
  })
}

watch(() => props.messages, scrollToBottom, { deep: true })

const handleScroll = () => {
  if (!messagesContainer.value || !hasMore.value) return
  if (messagesContainer.value.scrollTop < 50) {
    emit('loadMore')
  }
}
</script>

<template>
  <div class="flex h-full flex-col rounded-lg border border-gray-200 bg-white">
    <div
      ref="messagesContainer"
      class="flex-1 space-y-4 overflow-y-auto p-4"
      @scroll="handleScroll"
    >
      <div v-if="loading" class="flex justify-center py-4">
        <Spinner size="sm" />
      </div>
      
      <div
        v-for="message in messages"
        :key="message.id"
        class="flex gap-3"
        :class="isCurrentUser(message.sender.id) ? 'flex-row-reverse' : ''"
      >
        <Avatar
          v-if="showAvatars"
          :src="message.sender.avatar"
          :alt="message.sender.name"
          :fallback="message.sender.name.charAt(0)"
          class="shrink-0"
        />
        
        <div class="max-w-[70%]" :class="isCurrentUser(message.sender.id) ? 'items-end' : 'items-start'">
          <div
            class="rounded-2xl px-4 py-2"
            :class="isCurrentUser(message.sender.id)
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-900'"
          >
            <p v-if="message.type === 'text'">{{ message.content }}</p>
            <img
              v-else-if="message.type === 'image'"
              :src="message.content"
              class="max-h-48 rounded-lg object-cover"
            />
            <div v-else class="flex items-center gap-2">
              <span class="i-lucide-file size-5" />
              <span class="text-sm">{{ message.content }}</span>
            </div>
          </div>
          
          <div class="mt-1 flex items-center gap-2 text-xs text-gray-500">
            <Time v-if="showTimestamps" :value="message.time" format="time" />
            <span v-if="isCurrentUser(message.sender.id) && message.status" class="text-gray-400">
              {{ message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓✓' : '✓' }}
            </span>
          </div>
          
          <div v-if="message.reactions?.length" class="mt-1 flex gap-1">
            <button
              v-for="reaction in message.reactions"
              :key="reaction.emoji"
              class="flex items-center gap-0.5 rounded-full bg-gray-100 px-2 py-0.5 text-xs hover:bg-gray-200"
              @click="$emit('reaction', message.id, reaction.emoji)"
            >
              {{ reaction.emoji }} {{ reaction.count }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="border-t border-gray-200 p-3">
      <form class="flex gap-2" @submit.prevent="sendMessage">
        <Button type="button" variant="ghost" size="sm">
          <span class="i-lucide-paperclip" />
        </Button>
        <input
          v-model="messageInput"
          type="text"
          placeholder="Type a message..."
          class="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        <Button type="submit" size="sm" :disabled="!messageInput.trim()">
          <span class="i-lucide-send" />
        </Button>
      </form>
    </div>
  </div>
</template>
