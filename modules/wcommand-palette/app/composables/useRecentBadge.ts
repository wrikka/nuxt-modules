import { readonly, ref } from 'vue'
import type { Command } from '../types'

export interface RecentCommand {
  id: string
  addedAt: number
}

/**
 * Recent Badge - Show "New" badge for recently added commands
 */
export function useRecentBadge(daysThreshold = 7) {
  const recentCommands = ref<RecentCommand[]>([])

  const markAsNew = (commandId: string) => {
    recentCommands.value.push({
      id: commandId,
      addedAt: Date.now()
    })
  }

  const isNew = (command: Command): boolean => {
    const recent = recentCommands.value.find(r => r.id === command.id)
    if (!recent) return false

    const daysSinceAdded = (Date.now() - recent.addedAt) / (1000 * 60 * 60 * 24)
    return daysSinceAdded <= daysThreshold
  }

  const getNewCommands = (commands: Command[]): Command[] => {
    return commands.filter(c => isNew(c))
  }

  const clearOldBadges = () => {
    const cutoff = Date.now() - (daysThreshold * 24 * 60 * 60 * 1000)
    recentCommands.value = recentCommands.value.filter(r => r.addedAt > cutoff)
  }

  const removeBadge = (commandId: string) => {
    recentCommands.value = recentCommands.value.filter(r => r.id !== commandId)
  }

  const getBadgeText = (): string => {
    return 'NEW'
  }

  return {
    recentCommands: readonly(recentCommands),
    markAsNew,
    isNew,
    getNewCommands,
    clearOldBadges,
    removeBadge,
    getBadgeText
  }
}
