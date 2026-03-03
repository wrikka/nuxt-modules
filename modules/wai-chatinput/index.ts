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
      { name: 'useChat', from: resolve('../shared/composables/useChat') },
      { name: 'useChatModels', from: resolve('../shared/composables/useChatModels') },
      { name: 'useVoiceInput', from: resolve('../shared/composables/useVoiceInput') },
      { name: 'useCommands', from: resolve('../shared/composables/useCommands') },
      { name: 'useFileAttachments', from: resolve('../shared/composables/useFileAttachments') },
      { name: 'useFileUpload', from: resolve('../shared/composables/useFileUpload') },
      { name: 'useChatInput', from: resolve('../shared/composables/useChatInput') },
      // Feature composables
      { name: 'useChatSearch', from: resolve('../shared/composables/useChatSearch') },
      { name: 'useMessageThreading', from: resolve('../shared/composables/useMessageThreading') },
      { name: 'useCodeExecution', from: resolve('../shared/composables/useCodeExecution') },
      { name: 'useChatExport', from: resolve('../shared/composables/useChatExport') },
      { name: 'useCollaboration', from: resolve('../shared/composables/useCollaboration') },
      { name: 'useMessageBookmarks', from: resolve('../shared/composables/useMessageBookmarks') },
      { name: 'useMessageReactions', from: resolve('../shared/composables/useMessageReactions') },
      { name: 'useReadReceipts', from: resolve('../shared/composables/useReadReceipts') },
      { name: 'useMessageScheduling', from: resolve('../shared/composables/useMessageScheduling') },
      { name: 'useCustomTheme', from: resolve('../shared/composables/useCustomTheme') },
      { name: 'useKeyboardShortcuts', from: resolve('../shared/composables/useKeyboardShortcuts') },
      { name: 'useMessageTranslation', from: resolve('../shared/composables/useMessageTranslation') },
      { name: 'usePinnedMessages', from: resolve('../shared/composables/usePinnedMessages') },
      { name: 'useMessageHistory', from: resolve('../shared/composables/useMessageHistory') },
      { name: 'useCustomSlashCommands', from: resolve('../shared/composables/useCustomSlashCommands') },
      { name: 'useVoiceMessage', from: resolve('../shared/composables/useVoiceMessage') },
      { name: 'useMessageAnalytics', from: resolve('../shared/composables/useMessageAnalytics') },
      { name: 'useSmartSuggestions', from: resolve('../shared/composables/useSmartSuggestions') },
      { name: 'useFocusMode', from: resolve('../shared/composables/useFocusMode') },
      { name: 'useMessageForwarding', from: resolve('../shared/composables/useMessageForwarding') },
      { name: 'useOfflineMode', from: resolve('../shared/composables/useOfflineMode') },
      { name: 'usePlugins', from: resolve('../shared/composables/usePlugins') }
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
