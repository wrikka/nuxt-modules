// Core chat types

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: Date
  metadata?: Record<string, any>
}

export interface MessageMetadata {
  tokens?: number
  model?: string
  [key: string]: any
}

export interface SessionMetadata {
  totalMessages?: number
  totalTokens?: number
  lastActivity?: Date
  [key: string]: any
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  metadata?: SessionMetadata
}

export interface ChatState {
  currentSession: ChatSession | null
  sessions: ChatSession[]
  isLoading: boolean
  error: string | null
}

export interface ChatConfig {
  model: string
  temperature: number
  maxTokens: number
  systemPrompt?: string
}
