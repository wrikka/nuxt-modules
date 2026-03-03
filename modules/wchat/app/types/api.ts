import type { ChatMessage, ChatSession } from '../../types'

// API Response Types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Enhanced API Error Types
export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: Date
}

// Request/Response Types
export interface CreateMessageRequest {
  content: string
  role: 'user' | 'assistant' | 'system'
  attachmentIds?: string[]
  mentions?: string[]
  parentMessageId?: string
  metadata?: Record<string, any>
}

export interface UpdateMessageRequest {
  content?: string
  metadata?: Record<string, any>
}

export interface CreateSessionRequest {
  title: string
  mode?: string
  model?: string
  systemPrompt?: string
}

export interface UpdateSessionRequest {
  title?: string
  mode?: string
  model?: string
  systemPrompt?: string
  metadata?: Record<string, any>
}

export interface SearchMessagesRequest {
  query: string
  sessionId?: string
  filters?: {
    dateRange?: {
      start: Date
      end: Date
    }
    messageTypes?: ('user' | 'assistant' | 'system')[]
    hasAttachments?: boolean
    participants?: string[]
  }
  pagination?: {
    page?: number
    limit?: number
  }
}

export interface SearchMessagesResponse {
  results: {
    message: ChatMessage
    sessionId: string
    sessionTitle: string
    relevance: number
    context: {
      before: string
      after: string
    }
  }[]
  total: number
  query: string
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: string
  data: any
  timestamp: Date
  messageId?: string
}

export interface TypingMessage extends WebSocketMessage {
  type: 'typing_start' | 'typing_stop'
  data: {
    sessionId: string
    userId: string
    userName: string
  }
}

export interface CursorMessage extends WebSocketMessage {
  type: 'cursor_update'
  data: {
    sessionId: string
    userId: string
    cursor: {
      line: number
      position: number
    }
  }
}

export interface CollaborationMessage extends WebSocketMessage {
  type: 'participant_joined' | 'participant_left' | 'session_update'
  data: {
    sessionId: string
    participant?: any
    participants?: any[]
  }
}

// File Upload Types
export interface FileUploadRequest {
  file: File
  sessionId: string
  messageId?: string
  type: 'avatar' | 'attachment' | 'voice'
}

export interface FileUploadResponse {
  id: string
  url: string
  filename: string
  mimeType: string
  size: number
  uploadedAt: Date
}

// Voice Message Types
export interface VoiceUploadRequest {
  audioBlob: Blob
  sessionId: string
  duration: number
  format?: string
}

export interface VoiceTranscriptionRequest {
  audioFile: File
  language?: string
}

export interface VoiceTranscriptionResponse {
  transcript: string
  confidence: number
  language: string
  duration: number
}

// Analytics Types
export interface ChatAnalyticsRequest {
  sessionId?: string
  dateRange?: {
    start: Date
    end: Date
  }
  metrics?: ('messages' | 'sessions' | 'engagement' | 'performance')[]
}

export interface ChatAnalyticsResponse {
  totalMessages: number
  totalSessions: number
  averageSessionLength: number
  averageResponseTime: number
  mostActiveHours: number[]
  topEmojis: Array<{
    emoji: string
    count: number
  }>
  userEngagement: {
    dailyActiveUsers: number
    averageMessagesPerUser: number
    retentionRate: number
  }
}
