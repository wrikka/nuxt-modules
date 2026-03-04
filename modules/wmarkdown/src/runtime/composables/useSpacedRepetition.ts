import { ref, computed } from 'vue'

interface SRSCard {
  id: string
  front: string
  back: string
  deckId: string
  easeFactor: number // SM-2 ease factor, starts at 2.5
  interval: number // days
  repetitions: number // successful reviews
  lapses: number // failed reviews
  nextReview: number // timestamp
  lastReviewed?: number
  due: boolean
}

interface ReviewLog {
  cardId: string
  timestamp: number
  rating: number // 0-5 (again=0, hard=3, good=4, easy=5)
  elapsedDays: number
  scheduledDays: number
  easeFactor: number
}

interface SRSStats {
  totalCards: number
  dueCards: number
  newCards: number
  learningCards: number
  matureCards: number
  retentionRate: number
  averageEase: number
}

export function useSpacedRepetition() {
  const cards = ref<SRSCard[]>([])
  const reviewLogs = ref<ReviewLog[]>([])
  const dailyNewCardLimit = ref(20)
  const dailyReviewLimit = ref(100)

  const dueCards = computed(() => {
    const now = Date.now()
    return cards.value.filter(c => c.nextReview <= now)
  })

  const newCards = computed(() => {
    return cards.value.filter(c => c.repetitions === 0)
  })

  const learningCards = computed(() => {
    return cards.value.filter(c => c.repetitions > 0 && c.repetitions < 3)
  })

  const matureCards = computed(() => {
    return cards.value.filter(c => c.repetitions >= 3)
  })

  const stats = computed<SRSStats>(() => {
    const total = cards.value.length
    const due = dueCards.value.length
    const newC = newCards.value.length
    const learning = learningCards.value.length
    const mature = matureCards.value.length

    // Calculate retention rate from recent reviews
    const recentReviews = reviewLogs.value.slice(-100)
    const passed = recentReviews.filter(r => r.rating >= 3).length
    const retention = recentReviews.length > 0 ? passed / recentReviews.length : 0

    const avgEase = cards.value.length > 0
      ? cards.value.reduce((sum, c) => sum + c.easeFactor, 0) / cards.value.length
      : 2.5

    return {
      totalCards: total,
      dueCards: due,
      newCards: newC,
      learningCards: learning,
      matureCards: mature,
      retentionRate: Math.round(retention * 100),
      averageEase: Math.round(avgEase * 100) / 100
    }
  })

  // SM-2 Algorithm implementation
  const reviewCard = (cardId: string, rating: 0 | 3 | 4 | 5) => {
    const card = cards.value.find(c => c.id === cardId)
    if (!card) return

    const now = Date.now()
    const elapsedDays = card.lastReviewed
      ? Math.floor((now - card.lastReviewed) / (24 * 60 * 60 * 1000))
      : 0

    let interval: number
    let easeFactor = card.easeFactor
    let repetitions = card.repetitions

    if (rating === 0) {
      // Again - reset repetitions but keep ease factor
      repetitions = 0
      interval = 1
      card.lapses++
    } else {
      // Hard, Good, or Easy
      if (repetitions === 0) {
        interval = 1
      } else if (repetitions === 1) {
        interval = 6
      } else {
        interval = Math.round(card.interval * easeFactor)
      }

      repetitions++

      // Adjust ease factor based on rating
      easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02))
      if (easeFactor < 1.3) easeFactor = 1.3

      // Hard rating reduces interval
      if (rating === 3) {
        interval = Math.round(interval * 1.2)
      }
      // Easy rating increases interval
      if (rating === 5) {
        interval = Math.round(interval * 1.5)
      }
    }

    // Cap interval at 365 days
    if (interval > 365) interval = 365

    // Update card
    card.interval = interval
    card.easeFactor = easeFactor
    card.repetitions = repetitions
    card.lastReviewed = now
    card.nextReview = now + interval * 24 * 60 * 60 * 1000
    card.due = false

    // Log review
    reviewLogs.value.push({
      cardId: card.id,
      timestamp: now,
      rating,
      elapsedDays,
      scheduledDays: interval,
      easeFactor
    })
  }

  const addCard = (front: string, back: string, deckId: string): SRSCard => {
    const card: SRSCard = {
      id: generateId(),
      front,
      back,
      deckId,
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      lapses: 0,
      nextReview: Date.now(),
      due: true
    }
    cards.value.push(card)
    return card
  }

  const getStudyQueue = (newCardLimit: number = dailyNewCardLimit.value): SRSCard[] => {
    const queue: SRSCard[] = []

    // Add due cards first
    const due = dueCards.value.sort((a, b) => a.nextReview - b.nextReview)
    queue.push(...due.slice(0, dailyReviewLimit.value))

    // Add new cards if there's room
    const remainingSlots = dailyReviewLimit.value - queue.length
    if (remainingSlots > 0) {
      const newbies = newCards.value.slice(0, Math.min(newCardLimit, remainingSlots))
      queue.push(...newbies)
    }

    return queue
  }

  const rescheduleCard = (cardId: string, days: number) => {
    const card = cards.value.find(c => c.id === cardId)
    if (card) {
      card.interval = days
      card.nextReview = Date.now() + days * 24 * 60 * 60 * 1000
      card.due = false
    }
  }

  const suspendCard = (cardId: string) => {
    const card = cards.value.find(c => c.id === cardId)
    if (card) {
      card.nextReview = Infinity
      card.due = false
    }
  }

  const unsuspendCard = (cardId: string) => {
    const card = cards.value.find(c => c.id === cardId)
    if (card) {
      card.nextReview = Date.now()
      card.due = true
    }
  }

  const buryCard = (cardId: string) => {
    // Bury until tomorrow
    rescheduleCard(cardId, 1)
  }

  const getForecast = (days: number = 7): number[] => {
    const forecast: number[] = new Array(days).fill(0)
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000

    cards.value.forEach(card => {
      const daysUntilDue = Math.ceil((card.nextReview - now) / dayMs)
      if (daysUntilDue >= 0 && daysUntilDue < days) {
        forecast[daysUntilDue]++
      }
    })

    return forecast
  }

  return {
    cards,
    reviewLogs,
    dueCards,
    newCards,
    learningCards,
    matureCards,
    stats,
    dailyNewCardLimit,
    dailyReviewLimit,
    reviewCard,
    addCard,
    getStudyQueue,
    rescheduleCard,
    suspendCard,
    unsuspendCard,
    buryCard,
    getForecast
  }
}

function generateId(): string {
  return 'srs-' + Math.random().toString(36).substr(2, 9)
}
