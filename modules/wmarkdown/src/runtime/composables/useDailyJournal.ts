import { ref, computed } from 'vue'

interface JournalTemplate {
  id: string
  name: string
  content: string
  tags: string[]
}

interface JournalEntry {
  id: string
  date: string
  title: string
  content: string
  tags: string[]
  mood?: number
  wordCount: number
}

interface DailyJournalOptions {
  storageKey?: string
  defaultTemplate?: string
}

export function useDailyJournal(options: DailyJournalOptions = {}) {
  const { storageKey = 'wmarkdown-journal', defaultTemplate = 'default' } = options

  const entries = ref<JournalEntry[]>([])
  const templates = ref<JournalTemplate[]>([
    {
      id: 'default',
      name: 'Daily Journal',
      content: `# {{date}}

## Morning
- How am I feeling?
- What's my focus for today?
- Three things I'm grateful for:
  1.
  2.
  3.

## Throughout the Day
- Important events:
- Decisions made:
- Ideas that came up:

## Evening
- What went well today?
- What could have been better?
- Tomorrow's priorities:
`,
      tags: ['journal', 'daily']
    },
    {
      id: 'minimal',
      name: 'Minimal',
      content: `# {{date}}

## Today
{{content}}
`,
      tags: ['minimal']
    },
    {
      id: 'work',
      name: 'Work Journal',
      content: `# {{date}} - Work

## Goals
- [ ] Goal 1
- [ ] Goal 2
- [ ] Goal 3

## Completed
-

## Notes
{{content}}

## Tomorrow
-
`,
      tags: ['work', 'productivity']
    },
    {
      id: 'gratitude',
      name: 'Gratitude Journal',
      content: `# {{date}} - Gratitude

## I am grateful for:
1.
2.
3.

## Today's highlight:

## Looking forward to:
`,
      tags: ['gratitude', 'wellness']
    }
  ])

  const currentDate = computed(() => new Date().toISOString().split('T')[0])

  const todaysEntry = computed(() => {
    return entries.value.find(e => e.date === currentDate.value) || null
  })

  const hasEntryToday = computed(() => !!todaysEntry.value)

  const streak = computed(() => {
    if (entries.value.length === 0) return 0

    const sorted = [...entries.value].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    let currentStreak = 0
    let checkDate = new Date()

    for (const entry of sorted) {
      const entryDate = new Date(entry.date)
      const diffDays = Math.floor((checkDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays <= 1) {
        currentStreak++
        checkDate = new Date(entry.date)
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }

    return currentStreak
  })

  const generateEntry = (templateId?: string, customContent?: string): string => {
    const template = templates.value.find(t => t.id === (templateId || defaultTemplate))
    if (!template) return ''

    const date = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    let content = template.content
      .replace(/\{\{date\}\}/g, date)
      .replace(/\{\{content\}\}/g, customContent || '')

    return content
  }

  const createEntry = (content: string, mood?: number, tags: string[] = []): JournalEntry => {
    const entry: JournalEntry = {
      id: generateId(),
      date: currentDate.value,
      title: `Journal Entry - ${currentDate.value}`,
      content,
      tags,
      mood,
      wordCount: countWords(content)
    }

    // Remove existing entry for today
    const existingIndex = entries.value.findIndex(e => e.date === currentDate.value)
    if (existingIndex !== -1) {
      entries.value.splice(existingIndex, 1)
    }

    entries.value.push(entry)
    persistEntries()

    return entry
  }

  const updateEntry = (entryId: string, updates: Partial<JournalEntry>): boolean => {
    const entry = entries.value.find(e => e.id === entryId)
    if (!entry) return false

    Object.assign(entry, updates)
    if (updates.content) {
      entry.wordCount = countWords(updates.content)
    }

    persistEntries()
    return true
  }

  const deleteEntry = (entryId: string): boolean => {
    const index = entries.value.findIndex(e => e.id === entryId)
    if (index === -1) return false

    entries.value.splice(index, 1)
    persistEntries()
    return true
  }

  const getEntriesByDateRange = (startDate: string, endDate: string): JournalEntry[] => {
    return entries.value.filter(e =>
      e.date >= startDate && e.date <= endDate
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const getEntriesByTag = (tag: string): JournalEntry[] => {
    return entries.value.filter(e =>
      e.tags.includes(tag)
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const searchEntries = (query: string): JournalEntry[] => {
    const lowerQuery = query.toLowerCase()
    return entries.value.filter(e =>
      e.content.toLowerCase().includes(lowerQuery) ||
      e.title.toLowerCase().includes(lowerQuery)
    )
  }

  const addTemplate = (name: string, content: string, tags: string[] = []): JournalTemplate => {
    const template: JournalTemplate = {
      id: generateId(),
      name,
      content,
      tags
    }
    templates.value.push(template)
    return template
  }

  const persistEntries = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(entries.value))
    }
  }

  const loadEntries = () => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        try {
          entries.value = JSON.parse(stored)
        } catch {
          // Ignore parse errors
        }
      }
    }
  }

  const getStats = () => ({
    totalEntries: entries.value.length,
    streak: streak.value,
    hasEntryToday: hasEntryToday.value,
    averageWordCount: entries.value.length > 0
      ? Math.round(entries.value.reduce((sum, e) => sum + e.wordCount, 0) / entries.value.length)
      : 0
  })

  // Load on init
  loadEntries()

  return {
    entries,
    templates,
    currentDate,
    todaysEntry,
    hasEntryToday,
    streak,
    generateEntry,
    createEntry,
    updateEntry,
    deleteEntry,
    getEntriesByDateRange,
    getEntriesByTag,
    searchEntries,
    addTemplate,
    getStats
  }
}

function generateId(): string {
  return 'journal-' + Math.random().toString(36).substr(2, 9)
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length
}
