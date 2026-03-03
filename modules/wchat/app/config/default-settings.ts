// Default chat settings
import type { ChatMode } from '../types'

export const DEFAULT_CHAT_SETTINGS = {
  mode: 'balanced' as ChatMode,
  temperature: 0.7,
  maxTokens: 2048,
  systemPrompt: 'You are a helpful AI assistant.',
  autoSave: true,
  showTimestamps: true,
  enableMarkdown: true,
} as const

export const CHAT_MODES = {
  creative: {
    temperature: 0.9,
    maxTokens: 4096,
    description: 'More creative and diverse responses'
  },
  balanced: {
    temperature: 0.7,
    maxTokens: 2048,
    description: 'Balanced creativity and accuracy'
  },
  precise: {
    temperature: 0.3,
    maxTokens: 1024,
    description: 'More focused and accurate responses'
  }
} as const

export type DefaultChatSettings = typeof DEFAULT_CHAT_SETTINGS
