<script setup lang="ts">
import type { Chat, Message } from '../../types'
import { useCloudMessages } from '../../composables/useCloudFeatures'
import { useMessageEditing } from '../../composables/useEncryption'

interface Props {
  chat: Chat
}

const props = defineProps<Props>()

const { messages, syncMessages } = useCloudMessages()
const { canEdit } = useMessageEditing()

const chatMessages = computed(() => {
  return messages.value.get(props.chat.id) || []
})

const isLoading = ref(false)
const hasMore = ref(true)
const messageListRef = ref<HTMLElement>()

// Load messages on mount
onMounted(() => {
  loadMessages()
})

watch(() => props.chat.id, () => {
  loadMessages()
})

const loadMessages = async () => {
  isLoading.value = true
  await syncMessages(props.chat.id)
  isLoading.value = false
  scrollToBottom()
}

const loadMore = async () => {
  if (!hasMore.value || isLoading.value) return
  const oldest = chatMessages.value[0]
  await syncMessages(props.chat.id, oldest?.createdAt)
}

const scrollToBottom = () => {
  nextTick(() => {
    messageListRef.value?.scrollTo({
      top: messageListRef.value.scrollHeight,
      behavior: 'smooth'
    })
  })
}

const handleSend = async (content: string, options: any) => {
  // Send message logic
  console.log('Send:', content, options)
  scrollToBottom()
}

const handleReply = (message: Message) => {
  console.log('Reply to:', message)
}

const handleForward = (message: Message) => {
  console.log('Forward:', message)
}

const handleEdit = (message: Message) => {
  if (!canEdit(message)) return
  console.log('Edit:', message)
}

const handleDelete = (message: Message) => {
  console.log('Delete:', message)
}

const handlePin = (message: Message) => {
  console.log('Pin:', message)
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Chat Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b bg-background">
      <div class="flex items-center gap-3">
        <AtomsAvatar
          :src="chat.avatar"
          :alt="chat.title"
          size="md"
          :fallback="chat.title.charAt(0)"
        />
        <div>
          <AtomsText weight="semibold">{{ chat.title }}</AtomsText>
          <AtomsText size="sm" class="text-muted">
            <span v-if="chat.type === 'private'">online</span>
            <span v-else-if="chat.type === 'channel'">{{ chat.subscribers?.toLocaleString() }} subscribers</span>
            <span v-else>{{ chat.memberCount?.toLocaleString() }} members</span>
          </AtomsText>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Search in chat -->
        <AtomsButton variant="ghost" size="icon">
          <span class="i-lucide-search w-5 h-5" />
        </AtomsButton>

        <!-- Call button -->
        <AtomsButton variant="ghost" size="icon">
          <span class="i-lucide-phone w-5 h-5" />
        </AtomsButton>

        <!-- Video button -->
        <AtomsButton variant="ghost" size="icon">
          <span class="i-lucide-video w-5 h-5" />
        </AtomsButton>

        <!-- More actions -->
        <MoleculesPopover>
          <MoleculesPopoverTrigger as-child>
            <AtomsButton variant="ghost" size="icon">
              <span class="i-lucide-more-vertical w-5 h-5" />
            </AtomsButton>
          </MoleculesPopoverTrigger>
          <MoleculesPopoverContent class="w-48">
            <div class="flex flex-col gap-1">
              <AtomsButton variant="ghost" size="sm" class="justify-start">
                <span class="i-lucide-user-plus w-4 h-4 mr-2" />
                Add Member
              </AtomsButton>
              <AtomsButton variant="ghost" size="sm" class="justify-start">
                <span class="i-lucide-search w-4 h-4 mr-2" />
                Search
              </AtomsButton>
              <AtomsButton variant="ghost" size="sm" class="justify-start">
                <span class="i-lucide-bell-off w-4 h-4 mr-2" />
                Mute
              </AtomsButton>
              <AtomsDivider />
              <AtomsButton variant="ghost" size="sm" class="justify-start text-destructive">
                <span class="i-lucide-log-out w-4 h-4 mr-2" />
                Leave
              </AtomsButton>
            </div>
          </MoleculesPopoverContent>
        </MoleculesPopover>
      </div>
    </div>

    <!-- Messages Area -->
    <div
      ref="messageListRef"
      class="flex-1 overflow-y-auto p-4 space-y-4"
    >
      <!-- Loading -->
      <div v-if="isLoading && chatMessages.length === 0" class="flex justify-center py-8">
        <AtomsSpinner />
      </div>

      <!-- Load more -->
      <div v-if="hasMore && chatMessages.length > 0" class="flex justify-center py-4">
        <AtomsButton variant="ghost" size="sm" @click="loadMore">
          Load more messages
        </AtomsButton>
      </div>

      <!-- Empty state -->
      <div v-if="!isLoading && chatMessages.length === 0" class="flex flex-col items-center justify-center h-full text-muted">
        <span class="i-lucide-message-square w-16 h-16 mb-4 opacity-30" />
        <p>No messages yet</p>
        <p class="text-sm mt-1">Send a message to start the conversation</p>
      </div>

      <!-- Messages -->
      <div v-else class="space-y-2">
        <WChatMessageBubble
          v-for="(message, index) in chatMessages"
          :key="message.id"
          :message="message"
          :is-own="message.senderId === 'current-user'"
          :show-avatar="index === 0 || chatMessages[index - 1]?.senderId !== message.senderId"
          :chat="chat"
          @reply="handleReply"
          @forward="handleForward"
          @edit="handleEdit"
          @delete="handleDelete"
          @pin="handlePin"
        />
      </div>
    </div>

    <!-- Input Area -->
    <WChatMessageInput
      @send="handleSend"
    />
  </div>
</template>
