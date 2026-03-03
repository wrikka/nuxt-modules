import { ref, computed } from 'vue'
import type { MessageReaction, ChatMessage } from '../../types/domain'

export function useMessageReactions() {
  const reactions = ref<MessageReaction[]>([])

  const getReactionsForMessage = computed(() => (messageId: string) => {
    return reactions.value.filter(r => r.messageId === messageId)
  })

  const getReactionCounts = computed(() => (messageId: string) => {
    const messageReactions = reactions.value.filter(r => r.messageId === messageId)
    const counts: Record<string, number> = {}

    messageReactions.forEach(reaction => {
      counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1
    })

    return counts
  })

  const getUserReaction = computed(() => (messageId: string, userId: string) => {
    return reactions.value.find(r => r.messageId === messageId && r.userId === userId)
  })

  async function addReaction(messageId: string, emoji: string, userId: string) {
    // Check if user already reacted with this emoji
    const existingReaction = reactions.value.find(
      r => r.messageId === messageId && r.userId === userId && r.emoji === emoji
    )

    if (existingReaction) {
      // Remove reaction if it already exists
      await removeReaction(existingReaction.id)
      return
    }

    // Remove any existing reaction from this user on this message
    const userReactions = reactions.value.filter(
      r => r.messageId === messageId && r.userId === userId
    )
    userReactions.forEach(reaction => {
      const index = reactions.value.indexOf(reaction)
      if (index > -1) {
        reactions.value.splice(index, 1)
      }
    })

    // Add new reaction
    const newReaction: MessageReaction = {
      id: `reaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      messageId,
      emoji,
      userId,
      timestamp: new Date()
    }

    reactions.value.push(newReaction)

    try {
      // Sync with server
      await $fetch('/api/messages/reactions', {
        method: 'POST',
        body: newReaction
      })
    } catch (error) {
      // Rollback on error
      const index = reactions.value.indexOf(newReaction)
      if (index > -1) {
        reactions.value.splice(index, 1)
      }
      throw error
    }
  }

  async function removeReaction(reactionId: string) {
    const reaction = reactions.value.find(r => r.id === reactionId)
    if (!reaction) return

    const index = reactions.value.indexOf(reaction)
    if (index > -1) {
      reactions.value.splice(index, 1)
    }

    try {
      // Sync with server
      await $fetch(`/api/messages/reactions/${reactionId}`, {
        method: 'DELETE'
      })
    } catch (error) {
      // Rollback on error
      reactions.value.splice(index, 0, reaction)
      throw error
    }
  }

  async function loadReactions(messageId: string) {
    try {
      const serverReactions = await $fetch<MessageReaction[]>(`/api/messages/${messageId}/reactions`)

      // Remove existing reactions for this message
      reactions.value = reactions.value.filter(r => r.messageId !== messageId)

      // Add server reactions
      reactions.value.push(...serverReactions)
    } catch (error) {
      console.error('Error loading reactions:', error)
    }
  }

  function getCommonEmojis(): string[] {
    return ['👍', '❤️', '😊', '🎉', '🤔', '👎', '😂', '🔥']
  }

  return {
    // State
    reactions,
    getReactionsForMessage,
    getReactionCounts,
    getUserReaction,

    // Actions
    addReaction,
    removeReaction,
    loadReactions,
    getCommonEmojis
  }
}
