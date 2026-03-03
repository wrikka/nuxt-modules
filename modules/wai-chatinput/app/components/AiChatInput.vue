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

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col">
      <ModelSelector
        :models="chatModels"
        :agents="chatAgents"
        :selectedModel="selectedModel"
        :selectedAgent="selectedAgent"
        @selectModel="selectModel"
        @selectAgent="selectAgent"
      />

      <!-- Chat Messages -->
      <ChatMessages :messages="messages" class="flex-1 mb-4" @reply="handleReply" />

      <!-- File Upload Section -->
      <transition name="slide">
        <FileUpload ref="_fileUploadRef" v-model="showUploadModal" @confirm-upload="handleConfirmUpload" />
      </transition>

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
      />

      <!-- Context Menu -->
      <ContextMenu
        :show="showMenu"
        :items="menuItems"
        :selectedIndex="selectedIndex"
        :position="menuPosition"
        @select="selectItem"
        @update:selectedIndex="(index: number) => selectedIndex = index"
      />
    </div>
  </div>

  <ConversationSummaryModal
    :show="showSummaryModal"
    :summary="currentSummary"
    :loading="summaryLoading"
    @close="closeSummaryModal"
  />
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import Modal from './Modal.vue'
import type { ChatMessage } from '../../../shared/types/chat'

const _fileUploadRef = ref()
const messageInputRef = ref()
const replyTo = ref<ChatMessage | null>(null)

const {
  message,
  showUploadModal,
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
  selectItem: _selectItem,
  // Conversation management
  conversations,
  currentConversation,
  clearMessages,
  newConversation,
  selectConversation,
  removeConversation,
  generateSummary,
  showConversationSummary,
  confirmDeleteConversation,
  showSummaryModal,
  currentSummary,
  summaryLoading,
  closeSummaryModal
} = useChatInput()

const selectItem = (item: { id: string, label: string, value: string }) => {
  _selectItem(item, messageInputRef.value)
}

const _sendMessage = () => {
  sendMessage(replyTo.value ? replyTo.value.id : undefined)
  replyTo.value = null
}

const handleReply = (message: ChatMessage) => {
  replyTo.value = message
}

const cancelReply = () => {
  replyTo.value = null
}



</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}
.slide-enter-from, .slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
.ai-chat-input {
  max-width: 600px;
}
</style>
