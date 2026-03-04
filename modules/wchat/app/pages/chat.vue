<script setup lang="ts">
import { useChatFolders } from '../composables/useCloudFeatures'
import { useCloudMessages } from '../composables/useCloudFeatures'
import type { Chat } from '../types'

const { activeFolder } = useChatFolders()
const { messages } = useCloudMessages()

// Mock data for demonstration
const chats = ref<Chat[]>([
  {
    id: '1',
    type: 'private',
    title: 'John Doe',
    avatar: '',
    members: [],
    memberCount: 2,
    isPublic: false,
    unreadCount: 3,
    isMuted: false,
    isPinned: true,
    lastMessage: {
      id: 'm1',
      chatId: '1',
      senderId: 'user2',
      type: 'text',
      content: 'Hey, how are you doing?',
      status: 'delivered',
      isEdited: false,
      isDeleted: false,
      reactions: [],
      mentions: [],
      hashtags: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
      updatedAt: new Date(Date.now() - 1000 * 60 * 5),
      readBy: [],
      deliveredTo: ['current-user']
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    type: 'group',
    title: 'Project Team',
    avatar: '',
    members: [],
    memberCount: 12,
    isPublic: false,
    unreadCount: 24,
    isMuted: true,
    isPinned: false,
    lastMessage: {
      id: 'm2',
      chatId: '2',
      senderId: 'user3',
      type: 'text',
      content: 'Meeting at 3pm',
      status: 'read',
      isEdited: false,
      isDeleted: false,
      reactions: [{ emoji: '👍', count: 5, users: ['user1', 'user2'], isAnimated: false }],
      mentions: [],
      hashtags: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30),
      readBy: ['current-user'],
      deliveredTo: ['current-user']
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    type: 'channel',
    title: 'Tech News',
    avatar: '',
    members: [],
    memberCount: 15000,
    isPublic: true,
    isBroadcast: true,
    subscribers: 15000,
    unreadCount: 0,
    isMuted: false,
    isPinned: false,
    lastMessage: {
      id: 'm3',
      chatId: '3',
      senderId: 'channel-admin',
      type: 'text',
      content: 'Breaking: New AI model released!',
      status: 'read',
      isEdited: false,
      isDeleted: false,
      reactions: [],
      mentions: [],
      hashtags: ['#AI', '#tech'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60),
      readBy: ['current-user'],
      deliveredTo: ['current-user']
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    type: 'secret',
    title: 'Secret Chat',
    avatar: '',
    members: [],
    memberCount: 2,
    isPublic: false,
    encryptionKey: 'abc123',
    deviceId: 'device-1',
    screenshotNotifications: true,
    unreadCount: 1,
    isMuted: false,
    isPinned: false,
    lastMessage: {
      id: 'm4',
      chatId: '4',
      senderId: 'user4',
      type: 'text',
      content: 'This is a secret message 🔒',
      status: 'delivered',
      isEdited: false,
      isDeleted: false,
      selfDestruct: { enabled: true, duration: 86400 },
      reactions: [],
      mentions: [],
      hashtags: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      readBy: [],
      deliveredTo: ['current-user']
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

const selectedChat = ref<Chat | null>(null)
const showNewChat = ref(false)
const showSettings = ref(false)

const filteredChats = computed(() => {
  if (!activeFolder.value) return chats.value
  // Filter by folder logic would go here
  return chats.value
})

const selectChat = (chat: Chat) => {
  selectedChat.value = chat
  // Mark as read
  chat.unreadCount = 0
}
</script>

<template>
  <div class="h-screen flex bg-background">
    <!-- Left Sidebar - Chat List -->
    <div class="w-80 flex flex-col border-r">
      <!-- Header -->
      <div class="flex items-center justify-between p-3 border-b">
        <MoleculesMenu>
          <MoleculesMenuTrigger as-child>
            <AtomsButton variant="ghost" size="icon">
              <span class="i-lucide-menu w-5 h-5" />
            </AtomsButton>
          </MoleculesMenuTrigger>
          <MoleculesMenuContent class="w-56">
            <MoleculesMenuItem @click="showNewChat = true">
              <span class="i-lucide-plus w-4 h-4 mr-2" />
              New Chat
            </MoleculesMenuItem>
            <MoleculesMenuItem>
              <span class="i-lucide-users w-4 h-4 mr-2" />
              New Group
            </MoleculesMenuItem>
            <MoleculesMenuItem>
              <span class="i-lucide-broadcast w-4 h-4 mr-2" />
              New Channel
            </MoleculesMenuItem>
            <AtomsDivider />
            <MoleculesMenuItem>
              <span class="i-lucide-archive w-4 h-4 mr-2" />
              Archived
            </MoleculesMenuItem>
            <MoleculesMenuItem>
              <span class="i-lucide-star w-4 h-4 mr-2" />
              Saved Messages
            </MoleculesMenuItem>
            <AtomsDivider />
            <MoleculesMenuItem @click="showSettings = true">
              <span class="i-lucide-settings w-4 h-4 mr-2" />
              Settings
            </MoleculesMenuItem>
          </MoleculesMenuContent>
        </MoleculesMenu>

        <WChatChatSearch />
      </div>

      <!-- Folders -->
      <WChatChatFolders />

      <!-- Chat List -->
      <div class="flex-1 overflow-y-auto">
        <WChatChatListItem
          v-for="chat in filteredChats"
          :key="chat.id"
          :chat="chat"
          :is-active="selectedChat?.id === chat.id"
          :unread-count="chat.unreadCount"
          @click="selectChat"
        />
      </div>

      <!-- Bottom actions -->
      <div class="flex items-center justify-between p-3 border-t">
        <AtomsButton variant="ghost" size="icon" @click="showSettings = true">
          <span class="i-lucide-settings w-5 h-5" />
        </AtomsButton>
        <AtomsButton variant="primary" size="icon" @click="showNewChat = true">
          <span class="i-lucide-edit-3 w-5 h-5" />
        </AtomsButton>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="flex-1">
      <WChatChatView
        v-if="selectedChat"
        :chat="selectedChat"
        :key="selectedChat.id"
      />
      <div v-else class="h-full flex flex-col items-center justify-center text-muted">
        <div class="w-32 h-32 bg-surface rounded-full flex items-center justify-center mb-4">
          <span class="i-lucide-message-circle w-16 h-16 opacity-30" />
        </div>
        <AtomsText size="xl" weight="medium">Select a chat to start messaging</AtomsText>
        <p class="mt-2">Choose from your existing conversations or start a new one</p>
      </div>
    </div>

    <!-- Call Interface -->
    <WChatCallInterface />
  </div>
</template>
