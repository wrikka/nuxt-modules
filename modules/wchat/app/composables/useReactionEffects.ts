import type { ReactionEffect } from '../types'

// Message Reactions Effects - Fullscreen animations
export const useReactionEffects = () => {
  const config = useRuntimeConfig()
  const isPlaying = ref(false)
  const currentEffect = ref<string | null>(null)
  const effectQueue = ref<string[]>([])

  // Available effects
  const effects: Record<string, ReactionEffect> = {
    fire: {
      id: 'fire',
      name: 'Fire',
      emoji: '🔥',
      animation: 'fire',
      duration: 2000,
      sound: '/sounds/fire.mp3'
    },
    heart: {
      id: 'heart',
      name: 'Hearts',
      emoji: '❤️',
      animation: 'hearts',
      duration: 2000,
      sound: '/sounds/heart.mp3'
    },
    confetti: {
      id: 'confetti',
      name: 'Confetti',
      emoji: '🎉',
      animation: 'confetti',
      duration: 3000,
      sound: '/sounds/confetti.mp3'
    },
    explosion: {
      id: 'explosion',
      name: 'Explosion',
      emoji: '💥',
      animation: 'explosion',
      duration: 1500,
      sound: '/sounds/explosion.mp3'
    },
    fireworks: {
      id: 'fireworks',
      name: 'Fireworks',
      emoji: '🎆',
      animation: 'fireworks',
      duration: 3000,
      sound: '/sounds/fireworks.mp3'
    },
    magic: {
      id: 'magic',
      name: 'Magic',
      emoji: '✨',
      animation: 'sparkle',
      duration: 2000,
      sound: '/sounds/magic.mp3'
    },
    balloon: {
      id: 'balloon',
      name: 'Balloons',
      emoji: '🎈',
      animation: 'balloons',
      duration: 3000,
      sound: '/sounds/balloon.mp3'
    },
    rocket: {
      id: 'rocket',
      name: 'Rocket',
      emoji: '🚀',
      animation: 'rocket',
      duration: 2500,
      sound: '/sounds/rocket.mp3'
    }
  }

  // Play effect
  const playEffect = async (effectId: string): Promise<void> => {
    if (!config.public.wchat?.enableReactionEffects) return

    const effect = effects[effectId]
    if (!effect) return

    // Add to queue
    effectQueue.value.push(effectId)

    // Play sound
    if (effect.sound) {
      const audio = new Audio(effect.sound)
      audio.volume = 0.5
      audio.play().catch(() => {}) // Ignore autoplay errors
    }
  }

  // Play effect immediately (fullscreen)
  const playFullscreenEffect = async (effectId: string): Promise<void> => {
    if (!config.public.wchat?.enableReactionEffects) return

    const effect = effects[effectId]
    if (!effect) return

    isPlaying.value = true
    currentEffect.value = effectId

    // Play sound
    if (effect.sound) {
      const audio = new Audio(effect.sound)
      audio.volume = 0.5
      await audio.play().catch(() => {})
    }

    // Wait for animation duration
    await new Promise(resolve => setTimeout(resolve, effect.duration))

    isPlaying.value = false
    currentEffect.value = null
  }

  // Trigger effect from reaction
  const triggerReactionEffect = (emoji: string): void => {
    const effectMap: Record<string, string> = {
      '🔥': 'fire',
      '❤️': 'heart',
      '🧡': 'heart',
      '💛': 'heart',
      '💚': 'heart',
      '💙': 'heart',
      '💜': 'heart',
      '🖤': 'heart',
      '🤍': 'heart',
      '🤎': 'heart',
      '💕': 'heart',
      '💞': 'heart',
      '💓': 'heart',
      '💗': 'heart',
      '💖': 'heart',
      '💘': 'heart',
      '💝': 'heart',
      '🎉': 'confetti',
      '🎊': 'confetti',
      '🥳': 'confetti',
      '💥': 'explosion',
      '🤯': 'explosion',
      '🎆': 'fireworks',
      '🎇': 'fireworks',
      '✨': 'magic',
      '🌟': 'magic',
      '💫': 'magic',
      '🎈': 'balloon',
      '🚀': 'rocket',
      '🛸': 'rocket'
    }

    const effectId = effectMap[emoji]
    if (effectId) {
      playFullscreenEffect(effectId)
    }
  }

  // Batch effects (for multiple reactions)
  const queueEffects = (effectIds: string[]): void => {
    effectQueue.value.push(...effectIds)
    processQueue()
  }

  // Process effect queue
  const processQueue = async (): Promise<void> => {
    if (isPlaying.value || effectQueue.value.length === 0) return

    const effectId = effectQueue.value.shift()
    if (effectId) {
      await playFullscreenEffect(effectId)
      // Process next
      processQueue()
    }
  }

  // Get effect by emoji
  const getEffectByEmoji = (emoji: string): ReactionEffect | null => {
    const effectMap: Record<string, string> = {
      '🔥': 'fire',
      '❤️': 'heart',
      '🎉': 'confetti',
      '💥': 'explosion',
      '🎆': 'fireworks',
      '✨': 'magic',
      '🎈': 'balloon',
      '🚀': 'rocket'
    }
    const effectId = effectMap[emoji]
    return effectId ? effects[effectId] : null
  }

  return {
    effects: readonly(effects),
    isPlaying: readonly(isPlaying),
    currentEffect: readonly(currentEffect),
    effectQueue: readonly(effectQueue),
    playEffect,
    playFullscreenEffect,
    triggerReactionEffect,
    queueEffects,
    processQueue,
    getEffectByEmoji
  }
}

// Hook for reaction with effect
export const useAnimatedReaction = () => {
  const { triggerReactionEffect } = useReactionEffects()
  const { addReaction } = useMessageReactions()

  const reactWithEffect = async (messageId: string, emoji: string): Promise<void> => {
    // Add reaction
    await addReaction(messageId, emoji)
    // Trigger effect
    triggerReactionEffect(emoji)
  }

  return {
    reactWithEffect
  }
}

// Import from useUtilities for addReaction
const useMessageReactions = () => {
  const reactions = ref<Map<string, Set<string>>>(new Map())

  const addReaction = async (messageId: string, emoji: string): Promise<void> => {
    await $fetch(`/api/chat/messages/${messageId}/react`, {
      method: 'POST',
      body: { emoji }
    })

    const messageReactions = reactions.value.get(messageId) || new Set()
    messageReactions.add(emoji)
    reactions.value.set(messageId, messageReactions)
  }

  return {
    reactions: readonly(reactions),
    addReaction
  }
}
