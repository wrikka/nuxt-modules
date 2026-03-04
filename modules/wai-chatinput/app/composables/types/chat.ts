export interface ChatMessage {
  id: number
  role: 'user' | 'ai'
  content: string
  timestamp: Date
  attachments?: File[]
  parentId?: number
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  updatedAt: Date
}
