import type { Bot, MiniApp, BotCommand, BotPayment, AISuggestion, AIAssistantSession } from '../types'

// Feature 34-39: Bot Platform, Mini Apps, AI Integration
export const useBots = () => {
  const config = useRuntimeConfig()
  const bots = ref<Bot[]>([])
  const activeMiniApp = ref<MiniApp | null>(null)

  const isEnabled = computed(() => config.public.wchat.enableBots)

  // Load bot info
  const loadBot = async (username: string): Promise<Bot | null> => {
    if (!isEnabled.value) return null

    const { data } = await $fetch(`/api/chat/bots/${username}`)
    return data
  }

  // Search bots
  const searchBots = async (query: string): Promise<Bot[]> => {
    if (!isEnabled.value) return []

    const { data } = await $fetch('/api/chat/bots/search', {
      params: { q: query }
    })
    return data || []
  }

  // Start bot conversation
  const startBot = async (botId: string, initialCommand?: string): Promise<void> => {
    await $fetch(`/api/chat/bots/${botId}/start`, {
      method: 'POST',
      body: { command: initialCommand }
    })
  }

  // Send command to bot
  const sendBotCommand = async (botId: string, command: string, args?: string[]): Promise<unknown> => {
    const { data } = await $fetch(`/api/chat/bots/${botId}/command`, {
      method: 'POST',
      body: { command, args }
    })
    return data
  }

  // Open Mini App
  const openMiniApp = async (appId: string): Promise<MiniApp | null> => {
    if (!isEnabled.value || !config.public.wchat.enableMiniApps) return null

    const { data } = await $fetch(`/api/chat/mini-apps/${appId}`)
    if (data) {
      activeMiniApp.value = data
    }
    return data
  }

  // Close Mini App
  const closeMiniApp = () => {
    activeMiniApp.value = null
  }

  // Process payment through bot
  const processBotPayment = async (
    botId: string,
    amount: number,
    currency: string,
    payload: string
  ): Promise<BotPayment | null> => {
    const { data } = await $fetch('/api/chat/bots/payments', {
      method: 'POST',
      body: { botId, amount, currency, payload }
    })
    return data
  }

  // Create a bot (for developers)
  const createBot = async (name: string, username: string, description?: string): Promise<Bot | null> => {
    const { data } = await $fetch('/api/chat/bots', {
      method: 'POST',
      body: { name, username, description }
    })
    return data
  }

  // Set bot commands
  const setBotCommands = async (botId: string, commands: BotCommand[]): Promise<void> => {
    await $fetch(`/api/chat/bots/${botId}/commands`, {
      method: 'PUT',
      body: { commands }
    })
  }

  return {
    bots: computed(() => bots.value),
    activeMiniApp: readonly(activeMiniApp),
    isEnabled,
    loadBot,
    searchBots,
    startBot,
    sendBotCommand,
    openMiniApp,
    closeMiniApp,
    processBotPayment,
    createBot,
    setBotCommands
  }
}

// Feature 36-38: AI Smart Replies, Assistant, Content Moderation
export const useAI = () => {
  const config = useRuntimeConfig()
  const suggestions = ref<AISuggestion[]>([])
  const assistantSession = ref<AIAssistantSession | null>(null)

  const isEnabled = computed(() => config.public.wchat.enableAI)

  // Feature 36: Smart Reply Suggestions
  const getSmartReplies = async (chatId: string, messageId?: string): Promise<string[]> => {
    if (!isEnabled.value) return []

    const { data } = await $fetch('/api/chat/ai/suggestions', {
      params: { chatId, messageId }
    })
    return data?.suggestions || []
  }

  // Feature 37: AI Assistant
  const startAssistantSession = async (context?: string): Promise<AIAssistantSession | null> => {
    if (!isEnabled.value) return null

    const { data } = await $fetch('/api/chat/ai/assistant', {
      method: 'POST',
      body: { context }
    })

    if (data) {
      assistantSession.value = data
    }
    return data
  }

  const askAssistant = async (question: string): Promise<string | null> => {
    if (!isEnabled.value || !assistantSession.value) return null

    const { data } = await $fetch('/api/chat/ai/assistant/ask', {
      method: 'POST',
      body: { sessionId: assistantSession.value.id, question }
    })
    return data?.answer
  }

  const scheduleWithAssistant = async (description: string, datetime: Date): Promise<boolean> => {
    if (!isEnabled.value) return false

    const { data } = await $fetch('/api/chat/ai/assistant/schedule', {
      method: 'POST',
      body: { description, datetime: datetime.toISOString() }
    })
    return data?.success || false
  }

  const summarizeConversation = async (chatId: string, messageCount: number = 50): Promise<string | null> => {
    if (!isEnabled.value) return null

    const { data } = await $fetch('/api/chat/ai/summarize', {
      method: 'POST',
      body: { chatId, messageCount }
    })
    return data?.summary
  }

  // Feature 38: AI Content Moderation
  const moderateContent = async (content: string): Promise<{ isSafe: boolean; reason?: string }> => {
    if (!isEnabled.value) return { isSafe: true }

    const { data } = await $fetch('/api/chat/ai/moderate', {
      method: 'POST',
      body: { content }
    })
    return data || { isSafe: true }
  }

  const checkSpam = async (message: string, userId: string): Promise<boolean> => {
    if (!isEnabled.value) return false

    const { data } = await $fetch('/api/chat/ai/check-spam', {
      method: 'POST',
      body: { message, userId }
    })
    return data?.isSpam || false
  }

  // Real-time translation
  const translateMessage = async (text: string, targetLang: string): Promise<string> => {
    if (!isEnabled.value) return text

    const { data } = await $fetch('/api/chat/ai/translate', {
      method: 'POST',
      body: { text, targetLang }
    })
    return data?.translation || text
  }

  // Voice transcription (Feature 23)
  const transcribeVoice = async (audioBlob: Blob): Promise<string | null> => {
    if (!isEnabled.value || !config.public.wchat.enableVoiceTranscription) return null

    const formData = new FormData()
    formData.append('audio', audioBlob)

    const { data } = await $fetch('/api/chat/ai/transcribe', {
      method: 'POST',
      body: formData
    })
    return data?.text
  }

  return {
    suggestions: computed(() => suggestions.value),
    assistantSession: readonly(assistantSession),
    isEnabled,
    getSmartReplies,
    startAssistantSession,
    askAssistant,
    scheduleWithAssistant,
    summarizeConversation,
    moderateContent,
    checkSpam,
    translateMessage,
    transcribeVoice
  }
}
