import { readonly, ref } from 'vue'

export interface EmojiData {
  emoji: string
  name: string
  category: string
  keywords: string[]
}

/**
 * Emoji Picker - Quick emoji selection from palette
 */
export function useEmojiPicker() {
  const selectedEmoji = ref<string | null>(null)
  const recentEmojis = ref<string[]>([])

  const emojis: EmojiData[] = [
    { emoji: '👍', name: 'thumbs up', category: 'people', keywords: ['like', 'good', 'yes'] },
    { emoji: '❤️', name: 'heart', category: 'symbols', keywords: ['love', 'favorite'] },
    { emoji: '😊', name: 'smile', category: 'people', keywords: ['happy', 'face'] },
    { emoji: '🎉', name: 'party', category: 'objects', keywords: ['celebrate', 'congrats'] },
    { emoji: '✅', name: 'check', category: 'symbols', keywords: ['done', 'complete'] },
    { emoji: '🔥', name: 'fire', category: 'nature', keywords: ['hot', 'trending'] },
    { emoji: '💡', name: 'bulb', category: 'objects', keywords: ['idea', 'light'] },
    { emoji: '🚀', name: 'rocket', category: 'travel', keywords: ['launch', 'fast'] },
    { emoji: '⭐', name: 'star', category: 'nature', keywords: ['favorite', 'rate'] },
    { emoji: '📌', name: 'pin', category: 'objects', keywords: ['save', 'bookmark'] },
    { emoji: '💻', name: 'computer', category: 'objects', keywords: ['work', 'code'] },
    { emoji: '🐛', name: 'bug', category: 'nature', keywords: ['error', 'issue'] },
    { emoji: '✨', name: 'sparkles', category: 'nature', keywords: ['magic', 'new'] },
    { emoji: '📊', name: 'chart', category: 'objects', keywords: ['data', 'stats'] },
    { emoji: '📅', name: 'calendar', category: 'objects', keywords: ['date', 'schedule'] },
    { emoji: '⏰', name: 'clock', category: 'objects', keywords: ['time', 'alarm'] },
    { emoji: '📝', name: 'memo', category: 'objects', keywords: ['note', 'write'] },
    { emoji: '🗑️', name: 'trash', category: 'objects', keywords: ['delete', 'remove'] },
    { emoji: '🔍', name: 'search', category: 'objects', keywords: ['find', 'look'] },
    { emoji: '📎', name: 'link', category: 'objects', keywords: ['attach', 'url'] }
  ]

  const searchEmojis = (query: string): EmojiData[] => {
    const q = query.toLowerCase()
    return emojis.filter(e =>
      e.name.includes(q) ||
      e.keywords.some(k => k.includes(q)) ||
      e.emoji === query
    )
  }

  const selectEmoji = (emoji: string) => {
    selectedEmoji.value = emoji
    if (!recentEmojis.value.includes(emoji)) {
      recentEmojis.value = [emoji, ...recentEmojis.value].slice(0, 10)
    }
  }

  const getByCategory = (category: string): EmojiData[] => {
    return emojis.filter(e => e.category === category)
  }

  const getCategories = (): string[] => {
    return [...new Set(emojis.map(e => e.category))]
  }

  const copyToClipboard = async (emoji: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(emoji)
      return true
    }
    catch {
      return false
    }
  }

  return {
    selectedEmoji: readonly(selectedEmoji),
    recentEmojis: readonly(recentEmojis),
    emojis,
    searchEmojis,
    selectEmoji,
    getByCategory,
    getCategories,
    copyToClipboard
  }
}
