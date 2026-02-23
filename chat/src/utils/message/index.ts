// Message utilities
import type { ChatMessage } from '../../types'

export function truncateMessage(message: ChatMessage, maxLength: number): ChatMessage {
  return {
    ...message,
    content: message.content.length > maxLength
      ? message.content.substring(0, maxLength) + '...'
      : message.content
  }
}

export function getMessageWordCount(message: ChatMessage): number {
  return message.content.split(/\s+/).filter(word => word.length > 0).length
}

export function searchMessages(messages: ChatMessage[], query: string): ChatMessage[] {
  const searchTerm = query.toLowerCase()
  return messages.filter(message =>
    message.content.toLowerCase().includes(searchTerm)
  )
}
