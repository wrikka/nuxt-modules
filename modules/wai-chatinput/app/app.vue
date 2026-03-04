<template>
  <div class="ai-chat-input flex h-full bg-white rounded-lg shadow-md border">
    <ConversationSidebar
      :conversations="conversations"
      :current-conversation="currentConversation"
      @new-conversation="newConversation"
      @select-conversation="selectConversation"
      @show-summary="showConversationSummary"
      @delete-conversation="confirmDeleteConversation"
    />

    <div class="flex-1 flex flex-col">
      <div class="flex items-center justify-between p-4 border-b">
        <ModelSelector
          :models="chatModels"
          :agents="chatAgents"
          :selectedModel="selectedModel"
          :selectedAgent="selectedAgent"
          @selectModel="selectModel"
          @selectAgent="selectAgent"
        />
        <div class="flex items-center gap-2">
          <SearchBar
            :searchResults="searchResults"
            :isSearching="isSearching"
            @search="handleSearch"
            @select="goToSearchResult"
          />
          <ExportButton :messages="messages" :title="currentConversation?.title || 'Chat'" />
          <ThemeToggle />
          <FocusToggle />
          <ShortcutsHelp />
        </div>
      </div>

      <PinnedMessages
        v-if="pinnedMessages.length > 0"
        :conversationId="currentConversation?.id || ''"
        :messages="messages"
        class="border-b"
      />

      <SuggestionChips
        :messages="messages"
        @apply="applySuggestion"
        class="px-4 pt-2"
      />

      <ChatMessages
        :messages="messages"
        class="flex-1 mb-4"
        @reply="handleReply"
      />

      <TypingIndicator :typingUsers="typingUsersList" class="px-4" />

      <OfflineIndicator class="px-4 mb-2" />

      <VoiceRecorder v-if="showVoiceRecorder" class="px-4 mb-2" />

      <MessageInput
        v-model="message"
        :canSend="canSend"
        :isListening="Boolean(isListening)"
        :replyTo="replyTo"
        @send="_sendMessage"
        @attach="showUploadModal = true"
        @toggleVoice="toggleVoiceTyping"
        @input="handleInput"
        @keydown="handleKeydown"
        @cancel-reply="cancelReply"
        ref="messageInputRef"
      >
        <template #extras>
          <SchedulePicker
            v-if="showSchedulePicker"
            :content="message"
            :conversationId="currentConversation?.id || ''"
            @schedule="handleSchedule"
            @cancel="showSchedulePicker = false"
          />
        </template>
      </MessageInput>

      <ContextMenu
        :show="showMenu"
        :items="menuItems"
        :selectedIndex="selectedIndex"
        :position="menuPosition"
        @select="selectItem"
        @update:selectedIndex="(index: number) => selectedIndex = index"
      />
    </div>

    <CollaborationPanel
      v-if="showCollaboration"
      :currentUserId="currentUserId"
      class="w-64 border-l"
    />

    <AnalyticsPanel
      v-if="showAnalytics"
      :messages="messages"
      :conversations="conversations"
      class="absolute right-0 top-16 w-80 shadow-lg"
    />

    <ConversationSummaryModal
      :show="showSummaryModal"
      :summary="currentSummary"
      :loading="summaryLoading"
      @close="closeSummaryModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { ChatMessage } from '../composables/types/chat'

const currentUserId = ref('user-1')
const showVoiceRecorder = ref(false)
const showSchedulePicker = ref(false)
const showCollaboration = ref(false)
const showAnalytics = ref(false)

// Import all composables
const {
  message,
  showUploadModal,
  showSummaryModal,
  currentSummary,
  summaryLoading,
  messages,
  isLoading,
  chatModels,
  chatAgents,
  selectedModel,
  selectedAgent,
  selectModel,
  selectAgent,
  isListening,
  toggleVoiceTyping,
  canSend,
  showMenu,
  menuItems,
  selectedIndex,
  menuPosition,
  handleConfirmUpload,
  sendMessage,
  handleInput,
  handleKeydown,
  selectItem,
  conversations,
  currentConversation,
  clearMessages,
  newConversation,
  selectConversation,
  removeConversation,
  generateSummary,
  showConversationSummary,
  confirmDeleteConversation,
  closeSummaryModal
} = useChatInput()

// Search
const { searchResults, isSearching, performSearch } = useChatSearch(conversations.value)
const handleSearch = (query: string) => performSearch(query)
const goToSearchResult = (result: any) => selectConversation(result.conversationId)

// Threading
const replyTo = ref<ChatMessage | null>(null)
const handleReply = (message: ChatMessage) => replyTo.value = message
const cancelReply = () => replyTo.value = null
const _sendMessage = () => {
  sendMessage(replyTo.value ? replyTo.value.id : undefined)
  replyTo.value = null
}

// Pinned messages
const { pinnedMessages } = usePinnedMessages()

// Smart suggestions
const applySuggestion = (text: string) => message.value = text

// Typing indicator
const { typingUsers } = useCollaboration(currentUserId.value)
const typingUsersList = computed(() => Array.from(typingUsers.value))

// Schedule
const handleSchedule = () => {
  showSchedulePicker.value = false
  message.value = ''
}
</script>

<style scoped>
.ai-chat-input {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
