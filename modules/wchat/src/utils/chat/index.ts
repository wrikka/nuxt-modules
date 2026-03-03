// Chat helper functions
import type { ChatMessage, ChatSession } from '../../types'

export function createMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function createSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString()
}

export function isMessageFromUser(message: ChatMessage): boolean {
  return message.role === 'user'
}

export function isMessageFromAI(message: ChatMessage): boolean {
  return message.role === 'assistant'
}
