import { defineNuxtModule, addComponent, addComponentsDir, addImports, createResolver } from '@nuxt/kit'

export interface AiChatInputRuntimeConfig {
  models: string[]
  agents: string[]
  customCommands: { id: string, label: string, value: string, icon?: string, preview?: string }[]
}

export interface ModuleOptions {
  models: string[]
  agents: string[]
  customCommands: { id: string, label: string, value: string, icon?: string, preview?: string }[]
  maxFileSize: number
  allowedTypes: string[]
  multiple: boolean
  maxFiles: number
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'ai-chatinput',
    configKey: 'aiChatInput',
    compatibilityDate: '2025-07-15',
    components: ['runtime/components']
  },
  defaults: {
    models: ['openai/gpt-4', 'openai/gpt-3.5-turbo', 'anthropic/claude-3-5-sonnet'],
    agents: ['assistant', 'writer', 'coder'],
    customCommands: [
      { id: 'help', label: '/help - Show help', value: '/help ', icon: 'question', preview: 'Show available commands and usage' },
      { id: 'clear', label: '/clear - Clear conversation', value: '/clear ', icon: 'trash', preview: 'Clear all chat history' },
      { id: 'model', label: '/model - Change model', value: '/model ', icon: 'settings', preview: 'Switch to a different AI model' }
    ],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/*', 'text/*', 'application/pdf'],
    multiple: true,
    maxFiles: 5
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const resolve = resolver.resolve

    // Add components directory
    addComponentsDir({
      path: resolve('./runtime/components')
    })

    addImports([
      { name: 'useChat', from: resolve('./app/composables/useChat') },
      { name: 'useChatModels', from: resolve('./app/composables/useChatModels') },
      { name: 'useVoiceInput', from: resolve('./app/composables/useVoiceInput') },
      { name: 'useCommands', from: resolve('./app/composables/useCommands') },
      { name: 'useFileAttachments', from: resolve('./app/composables/useFileAttachments') },
      { name: 'useFileUpload', from: resolve('./app/composables/useFileUpload') },
      { name: 'useChatInput', from: resolve('./app/composables/useChatInput') },
      // Feature composables
      { name: 'useChatSearch', from: resolve('./app/composables/useChatSearch') },
      { name: 'useMessageThreading', from: resolve('./app/composables/useMessageThreading') },
      { name: 'useCodeExecution', from: resolve('./app/composables/useCodeExecution') },
      { name: 'useChatExport', from: resolve('./app/composables/useChatExport') },
      { name: 'useCollaboration', from: resolve('./app/composables/useCollaboration') },
      { name: 'useMessageBookmarks', from: resolve('./app/composables/useMessageBookmarks') },
      { name: 'useMessageReactions', from: resolve('./app/composables/useMessageReactions') },
      { name: 'useReadReceipts', from: resolve('./app/composables/useReadReceipts') },
      { name: 'useMessageScheduling', from: resolve('./app/composables/useMessageScheduling') },
      { name: 'useCustomTheme', from: resolve('./app/composables/useCustomTheme') },
      { name: 'useKeyboardShortcuts', from: resolve('./app/composables/useKeyboardShortcuts') },
      { name: 'useMessageTranslation', from: resolve('./app/composables/useMessageTranslation') },
      { name: 'usePinnedMessages', from: resolve('./app/composables/usePinnedMessages') },
      { name: 'useMessageHistory', from: resolve('./app/composables/useMessageHistory') },
      { name: 'useCustomSlashCommands', from: resolve('./app/composables/useCustomSlashCommands') },
      { name: 'useVoiceMessage', from: resolve('./app/composables/useVoiceMessage') },
      { name: 'useMessageAnalytics', from: resolve('./app/composables/useMessageAnalytics') },
      { name: 'useSmartSuggestions', from: resolve('./app/composables/useSmartSuggestions') },
      { name: 'useFocusMode', from: resolve('./app/composables/useFocusMode') },
      { name: 'useMessageForwarding', from: resolve('./app/composables/useMessageForwarding') },
      { name: 'useOfflineMode', from: resolve('./app/composables/useOfflineMode') },
      { name: 'usePlugins', from: resolve('./app/composables/usePlugins') }
    ])

    // Make options available to runtime
    nuxt.options.runtimeConfig.public.aiChatInput = {
      models: options.models,
      agents: options.agents,
      customCommands: options.customCommands
    } as AiChatInputRuntimeConfig
    nuxt.options.runtimeConfig.public.fileUpload = {
      maxFileSize: options.maxFileSize,
      allowedTypes: options.allowedTypes,
      multiple: options.multiple,
      maxFiles: options.maxFiles
    }
  }
})
