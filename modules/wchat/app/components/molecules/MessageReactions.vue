<template>
  <div class="message-reactions">
    <!-- Reaction Summary -->
    <div class="reaction-summary">
      <button
        v-for="(count, emoji) in reactionCounts"
        :key="emoji"
        @click="handleReactionClick(emoji)"
        :class="[
          'reaction-button',
          { 'has-user-reaction': hasUserReaction(emoji) }
        ]"
        :title="getReactionUsers(emoji)"
      >
        <span class="emoji">{{ emoji }}</span>
        <span class="count">{{ count }}</span>
      </button>
      
      <!-- Add Reaction Button -->
      <button
        @click="showEmojiPicker = !showEmojiPicker"
        class="add-reaction-button"
        title="Add reaction"
      >
        <Icon name="lucide:smile-plus" class="w-4 h-4" />
      </button>
    </div>

    <!-- Emoji Picker -->
    <div v-if="showEmojiPicker" class="emoji-picker">
      <div class="emoji-grid">
        <button
          v-for="emoji in commonEmojis"
          :key="emoji"
          @click="addReaction(emoji)"
          class="emoji-option"
          :title="emoji"
        >
          {{ emoji }}
        </button>
      </div>
      
      <!-- Custom Emoji Input -->
      <div class="custom-emoji">
        <input
          v-model="customEmoji"
          @keyup.enter="addCustomReaction"
          placeholder="Type emoji..."
          class="emoji-input"
          maxlength="2"
        />
        <button
          @click="addCustomReaction"
          :disabled="!customEmoji"
          class="add-custom-button"
        >
          Add
        </button>
      </div>
    </div>

    <!-- Reaction Details (on hover) -->
    <div v-if="showDetails" class="reaction-details">
      <div class="details-header">
        <span class="details-title">Reactions</span>
        <button
          @click="showDetails = false"
          class="close-details"
        >
          <Icon name="lucide:x" class="w-4 h-4" />
        </button>
      </div>
      
      <div class="reactions-list">
        <div
          v-for="reaction in messageReactions"
          :key="reaction.id"
          class="reaction-item"
        >
          <span class="reaction-emoji">{{ reaction.emoji }}</span>
          <span class="reaction-user">{{ getUserName(reaction.userId) }}</span>
          <span class="reaction-time">{{ formatTime(reaction.timestamp) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMessageReactions } from '../../composables/features'
import type { MessageReaction } from '../../types/domain'

interface Props {
  messageId: string
  userId: string
  showDetails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: false
})

const emit = defineEmits<{
  reactionAdded: [emoji: string]
  reactionRemoved: [emoji: string]
}>()

const {
  reactions,
  getReactionsForMessage,
  getReactionCounts,
  getUserReaction,
  addReaction: addMessageReaction,
  removeReaction,
  getCommonEmojis
} = useMessageReactions()

const showEmojiPicker = ref(false)
const showDetails = ref(false)
const customEmoji = ref('')

const messageReactions = computed(() => getReactionsForMessage.value(props.messageId))
const reactionCounts = computed(() => getReactionCounts.value(props.messageId))
const commonEmojis = computed(() => getCommonEmojis())

function hasUserReaction(emoji: string): boolean {
  return !!getUserReaction.value(props.messageId, props.userId)
}

function handleReactionClick(emoji: string) {
  if (hasUserReaction(emoji)) {
    // Remove reaction
    const userReaction = getUserReaction.value(props.messageId, props.userId)
    if (userReaction) {
      removeReaction(userReaction.id)
      emit('reactionRemoved', emoji)
    }
  } else {
    // Add reaction
    addReaction(emoji)
  }
}

async function addReaction(emoji: string) {
  try {
    await addMessageReaction(props.messageId, emoji, props.userId)
    emit('reactionAdded', emoji)
    showEmojiPicker.value = false
    customEmoji.value = ''
  } catch (error) {
    console.error('Error adding reaction:', error)
  }
}

function addCustomReaction() {
  if (customEmoji.value.trim()) {
    addReaction(customEmoji.value.trim())
  }
}

function getReactionUsers(emoji: string): string {
  const emojiReactions = messageReactions.value.filter(r => r.emoji === emoji)
  const userNames = emojiReactions.map(r => getUserName(r.userId))
  
  if (userNames.length <= 2) {
    return userNames.join(' and ')
  }
  
  return `${userNames.slice(0, 2).join(', ')} and ${userNames.length - 2} others`
}

function getUserName(userId: string): string {
  // This would typically come from a user store or API
  return `User_${userId.slice(0, 8)}`
}

function formatTime(timestamp: Date): string {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

// Close emoji picker when clicking outside
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.message-reactions')) {
    showEmojiPicker.value = false
  }
}
</script>

<style scoped>
.message-reactions {
  @apply relative;
}

.reaction-summary {
  @apply flex items-center gap-1 flex-wrap;
}

.reaction-button {
  @apply flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors text-sm;
}

.reaction-button.has-user-reaction {
  @apply bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 border border-blue-300 dark:border-blue-700;
}

.emoji {
  @apply text-sm;
}

.count {
  @apply text-xs text-gray-600 dark:text-gray-400 font-medium;
}

.add-reaction-button {
  @apply w-6 h-6 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors;
}

.emoji-picker {
  @apply absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-10 min-w-[200px];
}

.emoji-grid {
  @apply grid grid-cols-8 gap-1 mb-3;
}

.emoji-option {
  @apply w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-lg transition-colors;
}

.custom-emoji {
  @apply flex gap-2;
}

.emoji-input {
  @apply flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.add-custom-button {
  @apply px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.reaction-details {
  @apply absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-10 min-w-[250px];
}

.details-header {
  @apply flex items-center justify-between mb-3;
}

.details-title {
  @apply font-medium text-gray-900 dark:text-gray-100;
}

.close-details {
  @apply text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors;
}

.reactions-list {
  @apply space-y-2;
}

.reaction-item {
  @apply flex items-center gap-2 text-sm;
}

.reaction-emoji {
  @apply text-lg;
}

.reaction-user {
  @apply flex-1 text-gray-700 dark:text-gray-300;
}

.reaction-time {
  @apply text-xs text-gray-500 dark:text-gray-400;
}
</style>
