<template>
  <div class="example-prompts">
    <div class="prompts-header">
      <h3 class="prompts-title">Get started with these prompts</h3>
      <p class="prompts-subtitle">Click any prompt to begin chatting</p>
    </div>

    <div class="prompts-grid">
      <div
        v-for="prompt in examplePrompts"
        :key="prompt.id"
        @click="selectPrompt(prompt.text)"
        class="prompt-card"
      >
        <div class="prompt-icon">
          <Icon :name="prompt.icon" class="w-6 h-6" />
        </div>
        <div class="prompt-content">
          <h4 class="prompt-title">{{ prompt.title }}</h4>
          <p class="prompt-description">{{ prompt.description }}</p>
        </div>
        <div class="prompt-arrow">
          <Icon name="lucide:arrow-right" class="w-4 h-4" />
        </div>
      </div>
    </div>

    <!-- Custom prompt input -->
    <div class="custom-prompt">
      <div class="custom-prompt-header">
        <Icon name="lucide:edit-3" class="w-5 h-5" />
        <span>Or type your own prompt</span>
      </div>
      <div class="custom-prompt-input">
        <input
          v-model="customPrompt"
          @keyup.enter="selectCustomPrompt"
          placeholder="What would you like to discuss?"
          class="prompt-input"
        />
        <button
          @click="selectCustomPrompt"
          :disabled="!customPrompt.trim()"
          class="send-button"
        >
          <Icon name="lucide:send" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Recent conversations -->
    <div v-if="recentSessions.length > 0" class="recent-sessions">
      <h4 class="recent-title">Recent conversations</h4>
      <div class="sessions-list">
        <div
          v-for="session in recentSessions.slice(0, 5)"
          :key="session.id"
          @click="openSession(session.id)"
          class="session-item"
        >
          <div class="session-icon">
            <Icon name="lucide:message-square" class="w-4 h-4" />
          </div>
          <div class="session-content">
            <h5 class="session-title">{{ session.title }}</h5>
            <p class="session-preview">{{ getLastMessage(session) }}</p>
          </div>
          <div class="session-time">
            {{ formatTime(session.updatedAt) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ChatSession } from '../../types/domain'

interface ExamplePrompt {
  id: string
  title: string
  description: string
  text: string
  icon: string
  category: string
}

const emit = defineEmits<{
  select: [prompt: string]
  openSession: [sessionId: string]
}>()

const customPrompt = ref('')

const examplePrompts: ExamplePrompt[] = [
  {
    id: '1',
    title: 'Explain a concept',
    description: 'Get clear explanations for complex topics',
    text: 'Explain quantum computing in simple terms',
    icon: 'lucide:book-open',
    category: 'learning'
  },
  {
    id: '2',
    title: 'Write code',
    description: 'Generate code snippets and solutions',
    text: 'Write a Python function to sort a list of dictionaries',
    icon: 'lucide:code',
    category: 'coding'
  },
  {
    id: '3',
    title: 'Brainstorm ideas',
    description: 'Creative thinking and idea generation',
    text: 'Help me brainstorm ideas for a mobile app',
    icon: 'lucide:lightbulb',
    category: 'creative'
  },
  {
    id: '4',
    title: 'Solve problems',
    description: 'Step-by-step problem solving',
    text: 'Help me debug this JavaScript error: TypeError',
    icon: 'lucide:wrench',
    category: 'problem-solving'
  },
  {
    id: '5',
    title: 'Analyze data',
    description: 'Data analysis and insights',
    text: 'Analyze this sales data and provide insights',
    icon: 'lucide:bar-chart',
    category: 'analysis'
  },
  {
    id: '6',
    title: 'Write content',
    description: 'Create articles, emails, and more',
    text: 'Write a professional email to a client',
    icon: 'lucide:file-text',
    category: 'writing'
  }
]

// This would come from a store or API
const recentSessions = ref<ChatSession[]>([])

const categorizedPrompts = computed(() => {
  const categories: Record<string, ExamplePrompt[]> = {}
  
  examplePrompts.forEach(prompt => {
    if (!categories[prompt.category]) {
      categories[prompt.category] = []
    }
    categories[prompt.category].push(prompt)
  })
  
  return categories
})

function selectPrompt(prompt: string) {
  emit('select', prompt)
}

function selectCustomPrompt() {
  if (customPrompt.value.trim()) {
    selectPrompt(customPrompt.value.trim())
    customPrompt.value = ''
  }
}

function openSession(sessionId: string) {
  emit('openSession', sessionId)
}

function getLastMessage(session: ChatSession): string {
  if (session.messages.length === 0) return 'No messages yet'
  
  const lastMessage = session.messages[session.messages.length - 1]
  const content = lastMessage.content
  return content.length > 50 ? content.substring(0, 50) + '...' : content
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (days === 1) {
    return 'Yesterday'
  } else if (days < 7) {
    return date.toLocaleDateString([], { weekday: 'short' })
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
}
</script>

<style scoped>
.example-prompts {
  @apply max-w-4xl mx-auto p-6 space-y-8;
}

.prompts-header {
  @apply text-center space-y-2;
}

.prompts-title {
  @apply text-2xl font-bold text-gray-900 dark:text-gray-100;
}

.prompts-subtitle {
  @apply text-gray-600 dark:text-gray-400;
}

.prompts-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}

.prompt-card {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer group;
}

.prompt-icon {
  @apply w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors;
}

.prompt-content {
  @apply space-y-1 flex-1;
}

.prompt-title {
  @apply font-semibold text-gray-900 dark:text-gray-100;
}

.prompt-description {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.prompt-arrow {
  @apply text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors mt-2;
}

.custom-prompt {
  @apply bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3;
}

.custom-prompt-header {
  @apply flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300;
}

.custom-prompt-input {
  @apply flex gap-2;
}

.prompt-input {
  @apply flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.send-button {
  @apply w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-colors;
}

.recent-sessions {
  @apply space-y-3;
}

.recent-title {
  @apply text-lg font-semibold text-gray-900 dark:text-gray-100;
}

.sessions-list {
  @apply space-y-2;
}

.session-item {
  @apply flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm cursor-pointer transition-all;
}

.session-icon {
  @apply w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400;
}

.session-content {
  @apply flex-1 min-w-0;
}

.session-title {
  @apply font-medium text-gray-900 dark:text-gray-100 truncate;
}

.session-preview {
  @apply text-sm text-gray-600 dark:text-gray-400 truncate;
}

.session-time {
  @apply text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap;
}
</style>
