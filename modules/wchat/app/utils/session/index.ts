// Session utilities
import type { ChatSession } from '../../types'

export function getSessionTitle(session: ChatSession): string {
  if (session.title) return session.title

  const firstMessage = session.messages.find(m => m.role === 'user')
  if (firstMessage) {
    return firstMessage.content.substring(0, 50) + (firstMessage.content.length > 50 ? '...' : '')
  }

  return 'New Chat'
}

export function getSessionDuration(session: ChatSession): string {
  if (!session.messages.length) return '0 min'

  const firstMessage = session.messages[0]
  const lastMessage = session.messages[session.messages.length - 1]
  const duration = lastMessage.timestamp.getTime() - firstMessage.timestamp.getTime()

  const minutes = Math.floor(duration / (1000 * 60))
  return `${minutes} min`
}

export function getSessionMessageCount(session: ChatSession): number {
  return session.messages.length
}
