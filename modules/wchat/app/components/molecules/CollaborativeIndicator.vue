<template>
  <div class="typing-indicator">
    <div v-if="typingUsers.length > 0" class="typing-container">
      <div class="typing-dots">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
      
      <div class="typing-text">
        <span v-if="typingUsers.length === 1">
          {{ typingUsers[0] }} is typing
        </span>
        <span v-else-if="typingUsers.length === 2">
          {{ typingUsers[0] }} and {{ typingUsers[1] }} are typing
        </span>
        <span v-else>
          {{ typingUsers.length }} people are typing
        </span>
      </div>
    </div>

    <!-- Online Status -->
    <div v-if="showOnlineStatus && onlineUsers.length > 0" class="online-status">
      <div class="online-indicator"></div>
      <span class="online-text">
        {{ onlineUsers.length }} online
      </span>
      
      <!-- Online Users List -->
      <div class="online-users">
        <div
          v-for="user in onlineUsers.slice(0, maxVisibleUsers)"
          :key="user.id"
          class="online-user"
          :title="user.name"
        >
          <img
            v-if="user.avatar"
            :src="user.avatar"
            :alt="user.name"
            class="user-avatar"
          />
          <div v-else class="user-avatar-placeholder">
            {{ getInitials(user.name) }}
          </div>
          
          <!-- User Cursor -->
          <div
            v-if="user.cursor && showCursors"
            class="user-cursor"
            :style="{
              left: user.cursor.position * 8 + 'px',
              top: user.cursor.line * 20 + 'px'
            }"
            :title="`${user.name} is here`"
          >
            <div class="cursor-line"></div>
            <div class="cursor-name">{{ user.name }}</div>
          </div>
        </div>
        
        <!-- More Users Indicator -->
        <div
          v-if="onlineUsers.length > maxVisibleUsers"
          class="more-users"
          :title="getMoreUsersList()"
        >
          +{{ onlineUsers.length - maxVisibleUsers }}
        </div>
      </div>
    </div>

    <!-- Collaborative Features -->
    <div v-if="showCollaborativeFeatures" class="collaborative-features">
      <!-- Share Session Button -->
      <button
        @click="shareSession"
        class="collab-button share-button"
        title="Share session"
      >
        <Icon name="lucide:share-2" class="w-4 h-4" />
      </button>

      <!-- Video Call Button -->
      <button
        @click="startVideoCall"
        class="collab-button video-button"
        title="Start video call"
      >
        <Icon name="lucide:video" class="w-4 h-4" />
      </button>

      <!-- Screen Share Button -->
      <button
        @click="shareScreen"
        class="collab-button screen-button"
        title="Share screen"
      >
        <Icon name="lucide:monitor" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCollaborativeChat } from '../../composables/features'
import type { Participant } from '../../types/domain'

interface Props {
  sessionId: string
  currentUserId: string
  showOnlineStatus?: boolean
  showCursors?: boolean
  showCollaborativeFeatures?: boolean
  maxVisibleUsers?: number
}

const props = withDefaults(defineProps<Props>(), {
  showOnlineStatus: true,
  showCursors: false,
  showCollaborativeFeatures: true,
  maxVisibleUsers: 5
})

const emit = defineEmits<{
  shareSession: []
  startVideoCall: []
  shareScreen: []
  userJoined: [user: Participant]
  userLeft: [userId: string]
}>()

const {
  typingUsers,
  onlineParticipants,
  sendTypingStart,
  sendTypingStop,
  sendCursorUpdate,
  isConnected
} = useCollaborativeChat(props.sessionId)

const onlineUsers = computed(() => onlineParticipants.value)

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getMoreUsersList(): string {
  const hiddenUsers = onlineUsers.value.slice(props.maxVisibleUsers)
  return hiddenUsers.map(user => user.name).join(', ')
}

function shareSession() {
  emit('shareSession')
}

function startVideoCall() {
  emit('startVideoCall')
}

function shareScreen() {
  emit('shareScreen')
}

// Expose methods for parent components
defineExpose({
  sendTypingStart: () => sendTypingStart(props.currentUserId, getCurrentUserName()),
  sendTypingStop: () => sendTypingStop(props.currentUserId),
  sendCursorUpdate: (cursor: { line: number; position: number }) => 
    sendCursorUpdate(props.currentUserId, cursor)
})

function getCurrentUserName(): string {
  // This would typically come from a user store or auth context
  return 'You'
}
</script>

<style scoped>
.typing-indicator {
  @apply space-y-2;
}

.typing-container {
  @apply flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 py-2;
}

.typing-dots {
  @apply flex gap-1;
}

.dot {
  @apply w-2 h-2 bg-gray-400 rounded-full animate-pulse;
}

.dot:nth-child(1) {
  animation-delay: 0ms;
}

.dot:nth-child(2) {
  animation-delay: 150ms;
}

.dot:nth-child(3) {
  animation-delay: 300ms;
}

.typing-text {
  @apply italic;
}

.online-status {
  @apply flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400;
}

.online-indicator {
  @apply w-2 h-2 bg-green-500 rounded-full;
}

.online-text {
  @apply font-medium;
}

.online-users {
  @apply flex items-center gap-1;
}

.online-user {
  @apply relative;
}

.user-avatar {
  @apply w-6 h-6 rounded-full object-cover border border-gray-300 dark:border-gray-600;
}

.user-avatar-placeholder {
  @apply w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300;
}

.user-cursor {
  @apply absolute pointer-events-none z-10;
}

.cursor-line {
  @apply w-0.5 h-4 bg-blue-500;
}

.cursor-name {
  @apply absolute top-4 left-0 bg-blue-500 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap;
}

.more-users {
  @apply w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300;
}

.collaborative-features {
  @apply flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700;
}

.collab-button {
  @apply w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 transition-colors;
}

.share-button:hover {
  @apply bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400;
}

.video-button:hover {
  @apply bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400;
}

.screen-button:hover {
  @apply bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400;
}

/* Connection Status */
.typing-indicator[data-connected="false"] {
  @apply opacity-50;
}

.typing-indicator[data-connected="false"]::before {
  content: "Reconnecting...";
  @apply text-xs text-orange-500 italic;
}
</style>
