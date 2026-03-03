// Chat module types - organized by layer
export * from './domain'
export * from './core'
export * from './domain/enhanced'
export * from './api'

// Re-export commonly used types for backward compatibility
export type {
  ChatMessage,
  ChatSession,
  ChatState,
  ChatConfig,
  MessageMetadata,
  SessionMetadata
} from './domain/chat'

export type { ChatMode } from './core/mode'
