import { ref, computed } from 'vue'

interface Flashcard {
  id: string
  front: string
  back: string
  tags: string[]
  createdAt: number
  lastReviewed?: number
  reviewCount: number
  difficulty: 'easy' | 'medium' | 'hard'
}

interface FlashcardDeck {
  id: string
  name: string
  description: string
  cards: Flashcard[]
  tags: string[]
}

interface StudySession {
  deckId: string
  cardIds: string[]
  currentIndex: number
  correctCount: number
  incorrectCount: number
}

export function useFlashcards() {
  const decks = ref<FlashcardDeck[]>([])
  const currentSession = ref<StudySession | null>(null)
  const isFlipped = ref(false)

  const allCards = computed(() => {
    return decks.value.flatMap(d => d.cards)
  })

  const currentCard = computed(() => {
    if (!currentSession.value) return null
    const deck = decks.value.find(d => d.id === currentSession.value!.deckId)
    if (!deck) return null
    const cardId = currentSession.value.cardIds[currentSession.value.currentIndex]
    return deck.cards.find(c => c.id === cardId) || null
  })

  const sessionProgress = computed(() => {
    if (!currentSession.value || currentSession.value.cardIds.length === 0) return 0
    return (currentSession.value.currentIndex / currentSession.value.cardIds.length) * 100
  })

  const parseFromMarkdown = (markdown: string, deckName: string): FlashcardDeck => {
    const cards: Flashcard[] = []
    const lines = markdown.split('\n')
    let currentFront = ''
    let currentBack = ''
    let isBackSide = false
    let tags: string[] = []

    const flushCard = () => {
      if (currentFront.trim()) {
        cards.push({
          id: generateId(),
          front: currentFront.trim(),
          back: currentBack.trim() || '(No back content)',
          tags,
          createdAt: Date.now(),
          reviewCount: 0,
          difficulty: 'medium'
        })
      }
      currentFront = ''
      currentBack = ''
      isBackSide = false
    }

    for (const line of lines) {
      // Tags: #tag1 #tag2
      const tagMatch = line.match(/^#(\w+)/g)
      if (tagMatch) {
        tags = tagMatch.map(t => t.slice(1))
        continue
      }

      // Card separator ---
      if (line.match(/^---\s*$/)) {
        flushCard()
        continue
      }

      // Separator :: or |||
      if (line.match(/^[\|:]{2,}\s*$/)) {
        isBackSide = true
        continue
      }

      if (isBackSide) {
        currentBack += line + '\n'
      } else {
        currentFront += line + '\n'
      }
    }

    flushCard()

    const deck: FlashcardDeck = {
      id: generateId(),
      name: deckName,
      description: `Imported from markdown with ${cards.length} cards`,
      cards,
      tags: [...new Set(cards.flatMap(c => c.tags))]
    }

    decks.value.push(deck)
    return deck
  }

  const toMarkdown = (deckId: string): string => {
    const deck = decks.value.find(d => d.id === deckId)
    if (!deck) return ''

    return deck.cards.map(card => {
      const tags = card.tags.map(t => `#${t}`).join(' ')
      return `${tags}
${card.front}
---
${card.back}
---`
    }).join('\n\n')
  }

  const createDeck = (name: string, description: string = ''): FlashcardDeck => {
    const deck: FlashcardDeck = {
      id: generateId(),
      name,
      description,
      cards: [],
      tags: []
    }
    decks.value.push(deck)
    return deck
  }

  const addCard = (deckId: string, front: string, back: string, tags: string[] = []): Flashcard | null => {
    const deck = decks.value.find(d => d.id === deckId)
    if (!deck) return null

    const card: Flashcard = {
      id: generateId(),
      front,
      back,
      tags,
      createdAt: Date.now(),
      reviewCount: 0,
      difficulty: 'medium'
    }

    deck.cards.push(card)
    return card
  }

  const removeCard = (deckId: string, cardId: string): boolean => {
    const deck = decks.value.find(d => d.id === deckId)
    if (!deck) return false

    const index = deck.cards.findIndex(c => c.id === cardId)
    if (index === -1) return false

    deck.cards.splice(index, 1)
    return true
  }

  const updateCard = (deckId: string, cardId: string, updates: Partial<Flashcard>): boolean => {
    const deck = decks.value.find(d => d.id === deckId)
    if (!deck) return false

    const card = deck.cards.find(c => c.id === cardId)
    if (!card) return false

    Object.assign(card, updates)
    return true
  }

  const startStudySession = (deckId: string, shuffle: boolean = true): boolean => {
    const deck = decks.value.find(d => d.id === deckId)
    if (!deck || deck.cards.length === 0) return false

    let cardIds = deck.cards.map(c => c.id)
    if (shuffle) {
      cardIds = cardIds.sort(() => Math.random() - 0.5)
    }

    currentSession.value = {
      deckId,
      cardIds,
      currentIndex: 0,
      correctCount: 0,
      incorrectCount: 0
    }

    isFlipped.value = false
    return true
  }

  const flipCard = () => {
    isFlipped.value = !isFlipped.value
  }

  const rateCard = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentSession.value || !currentCard.value) return

    const card = currentCard.value
    card.lastReviewed = Date.now()
    card.reviewCount++

    switch (rating) {
      case 'again':
        card.difficulty = 'hard'
        currentSession.value.incorrectCount++
        // Move card to end of session
        currentSession.value.cardIds.push(card.id)
        break
      case 'hard':
        card.difficulty = 'hard'
        currentSession.value.correctCount++
        break
      case 'good':
        card.difficulty = 'medium'
        currentSession.value.correctCount++
        break
      case 'easy':
        card.difficulty = 'easy'
        currentSession.value.correctCount++
        break
    }

    isFlipped.value = false
    currentSession.value.currentIndex++
  }

  const nextCard = () => {
    if (!currentSession.value) return
    isFlipped.value = false
    currentSession.value.currentIndex++
  }

  const endSession = () => {
    currentSession.value = null
    isFlipped.value = false
  }

  const getDeckStats = (deckId: string) => {
    const deck = decks.value.find(d => d.id === deckId)
    if (!deck) return null

    const totalCards = deck.cards.length
    const reviewedCards = deck.cards.filter(c => c.reviewCount > 0).length
    const avgReviews = totalCards > 0
      ? deck.cards.reduce((sum, c) => sum + c.reviewCount, 0) / totalCards
      : 0

    return {
      totalCards,
      reviewedCards,
      avgReviews: Math.round(avgReviews * 10) / 10,
      needsReview: deck.cards.filter(c => !c.lastReviewed || Date.now() - c.lastReviewed > 24 * 60 * 60 * 1000).length
    }
  }

  return {
    decks,
    allCards,
    currentCard,
    isFlipped,
    sessionProgress,
    parseFromMarkdown,
    toMarkdown,
    createDeck,
    addCard,
    removeCard,
    updateCard,
    startStudySession,
    flipCard,
    rateCard,
    nextCard,
    endSession,
    getDeckStats
  }
}

function generateId(): string {
  return 'fc-' + Math.random().toString(36).substr(2, 9)
}
