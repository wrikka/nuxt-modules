import { ref, computed } from 'vue'
import type { ChatMessage } from './types/chat'

export interface ThreadMessage extends ChatMessage {
  threadId?: string
  replies: ThreadMessage[]
  replyCount: number
  isExpanded: boolean
}

export function useMessageThreading(messages: ChatMessage[]) {
  const expandedThreads = ref<Set<string>>(new Set())

  const threadedMessages = computed(() => {
    const threadMap = new Map<string, ThreadMessage>()
    const rootMessages: ThreadMessage[] = []

    messages.forEach(msg => {
      threadMap.set(msg.id.toString(), {
        ...msg,
        replies: [],
        replyCount: 0,
        isExpanded: expandedThreads.value.has(msg.id.toString())
      })
    })

    messages.forEach(msg => {
      const threadMsg = threadMap.get(msg.id.toString())!
      if (msg.parentId) {
        const parent = threadMap.get(msg.parentId.toString())
        if (parent) {
          threadMsg.threadId = parent.id.toString()
          parent.replies.push(threadMsg)
          parent.replyCount++
        }
      } else {
        rootMessages.push(threadMsg)
      }
    })

    return rootMessages
  })

  const toggleThread = (messageId: string) => {
    if (expandedThreads.value.has(messageId)) {
      expandedThreads.value.delete(messageId)
    } else {
      expandedThreads.value.add(messageId)
    }
  }

  const expandAllThreads = () => {
    threadedMessages.value.forEach(msg => {
      if (msg.replies.length > 0) {
        expandedThreads.value.add(msg.id.toString())
      }
    })
  }

  const collapseAllThreads = () => {
    expandedThreads.value.clear()
  }

  return {
    threadedMessages,
    expandedThreads,
    toggleThread,
    expandAllThreads,
    collapseAllThreads
  }
}
