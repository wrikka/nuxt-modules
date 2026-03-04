<script setup lang="ts">
import type { Chat, Message, ChatType } from '../../types'

interface Props {
  chat: Chat
  isActive?: boolean
  unreadCount?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [chat: Chat]
  contextmenu: [event: MouseEvent, chat: Chat]
}>()

const chatTypeIcon = computed(() => {
  switch (props.chat.type) {
    case 'channel': return 'i-lucide-broadcast'
    case 'group':
    case 'supergroup': return 'i-lucide-users'
    case 'secret': return 'i-lucide-lock'
    default: return 'i-lucide-user'
  }
})

const isMuted = computed(() => props.chat.isMuted)
const isPinned = computed(() => props.chat.isPinned)

const formattedTime = computed(() => {
  if (!props.chat.lastMessage?.createdAt) return ''
  const date = new Date(props.chat.lastMessage.createdAt)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})

const displayMessage = computed(() => {
  if (!props.chat.lastMessage) return 'No messages'

  if (props.chat.lastMessage.isDeleted) {
    return 'This message was deleted'
  }

  if (props.chat.lastMessage.forwardFrom) {
    return 'Forwarded message'
  }

  if (props.chat.lastMessage.media) {
    const type = props.chat.lastMessage.media.type
    if (type === 'image') return '📷 Photo'
    if (type === 'video') return '🎥 Video'
    if (type === 'audio' || type === 'voice') return '🎤 Voice message'
    if (type === 'document') return '📎 Document'
    if (type === 'sticker') return '😀 Sticker'
  }

  return props.chat.lastMessage.content.slice(0, 50) + (props.chat.lastMessage.content.length > 50 ? '...' : '')
})

const handleClick = () => emit('click', props.chat)
const handleContextMenu = (e: MouseEvent) => emit('contextmenu', e, props.chat)
</script>

<template>
  <div
    class="w-full flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-surface-hover"
    :class="{ 'bg-surface-active': isActive }"
    @click="handleClick"
    @contextmenu.prevent="handleContextMenu"
  >
    <!-- Avatar -->
    <div class="relative flex-shrink-0">
      <AtomsAvatar
        :src="chat.avatar"
        :alt="chat.title"
        size="md"
        :fallback="chat.title.charAt(0).toUpperCase()"
      />
      <!-- Online indicator for private chats -->
      <div
        v-if="chat.type === 'private'"
        class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
      />
      <!-- Type icon badge -->
      <div
        v-else
        class="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
      >
        <span :class="chatTypeIcon" class="w-3 h-3 text-white" />
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between gap-2">
        <!-- Title -->
        <AtomsText
          class="font-medium truncate"
          :class="{ 'font-bold': unreadCount && unreadCount > 0 }"
        >
          {{ chat.title }}
        </AtomsText>

        <!-- Meta -->
        <div class="flex items-center gap-1 flex-shrink-0">
          <span v-if="isMuted" class="i-lucide-volume-x w-4 h-4 text-muted" />
          <span v-if="isPinned" class="i-lucide-pin w-4 h-4 text-muted" />
          <AtomsText size="xs" class="text-muted">
            {{ formattedTime }}
          </AtomsText>
        </div>
      </div>

      <div class="flex items-center justify-between gap-2 mt-1">
        <!-- Last message preview -->
        <AtomsText
          size="sm"
          class="truncate"
          :class="{ 'text-muted': !unreadCount, 'font-medium': unreadCount && unreadCount > 0 }"
        >
          <span v-if="chat.lastMessage?.isEdited" class="text-muted mr-1">edited</span>
          {{ displayMessage }}
        </AtomsText>

        <!-- Unread badge -->
        <AtomsBadge
          v-if="unreadCount && unreadCount > 0"
          variant="primary"
          size="sm"
          class="flex-shrink-0"
        >
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </AtomsBadge>

        <!-- Read status -->
        <span
          v-else-if="chat.lastMessage?.readBy?.length"
          class="i-lucide-check-check w-4 h-4 text-primary flex-shrink-0"
        />
      </div>
    </div>
  </div>
</template>
