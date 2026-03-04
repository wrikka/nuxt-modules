import { ref, computed } from 'vue'

interface WordCountStats {
  words: number
  characters: number
  charactersNoSpaces: number
  lines: number
  paragraphs: number
  sentences: number
  averageWordLength: number
}

export function useWordCount() {
  const text = ref('')

  const stats = computed<WordCountStats>(() => {
    const content = text.value

    if (!content) {
      return {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        lines: 0,
        paragraphs: 0,
        sentences: 0,
        averageWordLength: 0
      }
    }

    // Count characters
    const characters = content.length
    const charactersNoSpaces = content.replace(/\s/g, '').length

    // Count lines
    const lines = content.split(/\r\n|\r|\n/).length

    // Count paragraphs (non-empty lines separated by blank lines)
    const paragraphs = content
      .split(/\n\s*\n/)
      .filter(p => p.trim().length > 0).length

    // Count words
    const words = content
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0)

    // Count sentences (approximate by punctuation)
    const sentences = content
      .split(/[.!?]+/)
      .filter(s => s.trim().length > 0).length

    // Average word length
    const totalWordLength = words.reduce((sum, word) => sum + word.length, 0)
    const averageWordLength = words.length > 0 ? totalWordLength / words.length : 0

    return {
      words: words.length,
      characters,
      charactersNoSpaces,
      lines,
      paragraphs,
      sentences,
      averageWordLength: Math.round(averageWordLength * 10) / 10
    }
  })

  const selectedStats = computed(() => {
    const selection = window.getSelection()
    const selectedText = selection?.toString() || ''

    if (!selectedText) return null

    const words = selectedText
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0).length

    const characters = selectedText.length
    const charactersNoSpaces = selectedText.replace(/\s/g, '').length

    return {
      words,
      characters,
      charactersNoSpaces
    }
  })

  const setText = (newText: string) => {
    text.value = newText
  }

  const updateStats = (content: string): WordCountStats => {
    text.value = content
    return stats.value
  }

  const formatNumber = (num: number): string => {
    return num.toLocaleString()
  }

  return {
    text,
    stats,
    selectedStats,
    setText,
    updateStats,
    formatNumber
  }
}
