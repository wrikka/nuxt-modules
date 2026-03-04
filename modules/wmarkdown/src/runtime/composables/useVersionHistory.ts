import { ref, computed } from 'vue'

interface Version {
  id: string
  content: string
  timestamp: number
  author?: string
  message?: string
  wordCount: number
  charCount: number
}

interface VersionHistoryOptions {
  maxVersions?: number
  autoSaveInterval?: number
  storageKey?: string
}

export function useVersionHistory(options: VersionHistoryOptions = {}) {
  const {
    maxVersions = 50,
    autoSaveInterval = 30000, // 30 seconds
    storageKey = 'wmarkdown-versions'
  } = options

  const versions = ref<Version[]>([])
  const currentIndex = ref(-1)
  const lastSavedContent = ref('')
  let autoSaveTimer: NodeJS.Timeout | null = null

  const currentVersion = computed(() => {
    if (currentIndex.value >= 0 && currentIndex.value < versions.value.length) {
      return versions.value[currentIndex.value]
    }
    return null
  })

  const canUndo = computed(() => currentIndex.value > 0)
  const canRedo = computed(() => currentIndex.value < versions.value.length - 1)

  const saveVersion = (content: string, message?: string): Version => {
    const version: Version = {
      id: generateId(),
      content,
      timestamp: Date.now(),
      message,
      wordCount: countWords(content),
      charCount: content.length
    }

    // Remove future versions if we're not at the end
    if (currentIndex.value < versions.value.length - 1) {
      versions.value = versions.value.slice(0, currentIndex.value + 1)
    }

    versions.value.push(version)

    // Limit max versions
    if (versions.value.length > maxVersions) {
      versions.value.shift()
    } else {
      currentIndex.value++
    }

    lastSavedContent.value = content
    persistVersions()

    return version
  }

  const autoSave = (content: string) => {
    if (content === lastSavedContent.value) return

    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
    }

    autoSaveTimer = setTimeout(() => {
      saveVersion(content, 'Auto-saved')
    }, autoSaveInterval)
  }

  const undo = (): string | null => {
    if (!canUndo.value) return null

    currentIndex.value--
    return versions.value[currentIndex.value]?.content || null
  }

  const redo = (): string | null => {
    if (!canRedo.value) return null

    currentIndex.value++
    return versions.value[currentIndex.value]?.content || null
  }

  const restoreVersion = (versionId: string): string | null => {
    const index = versions.value.findIndex(v => v.id === versionId)
    if (index === -1) return null

    currentIndex.value = index
    return versions.value[index].content
  }

  const deleteVersion = (versionId: string): boolean => {
    const index = versions.value.findIndex(v => v.id === versionId)
    if (index === -1) return false

    versions.value.splice(index, 1)

    // Adjust current index
    if (index <= currentIndex.value) {
      currentIndex.value = Math.max(0, currentIndex.value - 1)
    }

    persistVersions()
    return true
  }

  const clearHistory = () => {
    versions.value = []
    currentIndex.value = -1
    lastSavedContent.value = ''
    persistVersions()
  }

  const getVersionAt = (index: number): Version | null => {
    return versions.value[index] || null
  }

  const compareVersions = (versionId1: string, versionId2: string): {
    added: number
    removed: number
    changed: number
  } | null => {
    const v1 = versions.value.find(v => v.id === versionId1)
    const v2 = versions.value.find(v => v.id === versionId2)

    if (!v1 || !v2) return null

    const lines1 = v1.content.split('\n')
    const lines2 = v2.content.split('\n')

    let added = 0
    let removed = 0

    // Simple line-by-line comparison
    const maxLen = Math.max(lines1.length, lines2.length)
    for (let i = 0; i < maxLen; i++) {
      if (i >= lines1.length) added++
      else if (i >= lines2.length) removed++
      else if (lines1[i] !== lines2[i]) {
        added++
        removed++
      }
    }

    return {
      added,
      removed,
      changed: added + removed
    }
  }

  const persistVersions = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify({
        versions: versions.value,
        currentIndex: currentIndex.value
      }))
    }
  }

  const loadVersions = () => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        try {
          const data = JSON.parse(stored)
          versions.value = data.versions || []
          currentIndex.value = data.currentIndex || -1
        } catch {
          // Ignore parse errors
        }
      }
    }
  }

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    // Less than 1 minute
    if (diff < 60000) {
      return 'Just now'
    }

    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000)
      return `${minutes} min ago`
    }

    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000)
      return `${hours} hr ago`
    }

    return date.toLocaleDateString()
  }

  // Load on init
  loadVersions()

  return {
    versions,
    currentIndex,
    currentVersion,
    canUndo,
    canRedo,
    saveVersion,
    autoSave,
    undo,
    redo,
    restoreVersion,
    deleteVersion,
    clearHistory,
    getVersionAt,
    compareVersions,
    formatTimestamp
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length
}
