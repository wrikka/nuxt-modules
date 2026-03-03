export interface VoiceMessage {
  id: string
  audioBlob: Blob
  duration: number
  transcript?: string
  isPlaying: boolean
}

export interface MessageReaction {
  id: string
  messageId: string
  emoji: string
  userId: string
  timestamp: Date
}

export interface CollaborativeSession {
  id: string
  participants: Participant[]
  isActive: boolean
  lastActivity: Date
}

export interface Participant {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
  isActive: boolean
  cursor?: {
    line: number
    position: number
  }
}

export interface ChatSearchResult {
  message: ChatMessage
  sessionId: string
  sessionTitle: string
  relevance: number
  context: {
    before: string
    after: string
  }
}

export interface MessageThread {
  id: string
  parentMessageId: string
  messages: ChatMessage[]
  participants: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ChatNotification {
  id: string
  type: 'mention' | 'reply' | 'reaction' | 'system'
  title: string
  message: string
  timestamp: Date
  read: boolean
  sessionId?: string
  messageId?: string
}

export interface TypingIndicator {
  userId: string
  userName: string
  sessionId: string
  timestamp: Date
}

export interface ChatFilter {
  query?: string
  dateRange?: {
    start: Date
    end: Date
  }
  participants?: string[]
  hasAttachments?: boolean
  messageTypes?: ('user' | 'assistant' | 'system')[]
}

export interface ChatAnalytics {
  totalMessages: number
  totalSessions: number
  averageSessionLength: number
  mostActiveHours: number[]
  popularTopics: string[]
  responseTime: number
}
