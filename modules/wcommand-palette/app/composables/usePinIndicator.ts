import { readonly, ref } from 'vue'
import type { Command } from '../types'

/**
 * Pin Indicator - Show icon for pinned commands
 */
export function usePinIndicator() {
  const pinnedIds = ref<Set<string>>(new Set())

  const addPin = (commandId: string) => {
    pinnedIds.value.add(commandId)
  }

  const removePin = (commandId: string) => {
    pinnedIds.value.delete(commandId)
  }

  const togglePin = (commandId: string): boolean => {
    if (pinnedIds.value.has(commandId)) {
      removePin(commandId)
      return false
    }
    addPin(commandId)
    return true
  }

  const isPinned = (commandId: string): boolean => {
    return pinnedIds.value.has(commandId)
  }

  const getPinnedCommands = (commands: Command[]): Command[] => {
    return commands.filter(c => pinnedIds.value.has(c.id))
  }

  const getPinIcon = (isPinned: boolean): string => {
    return isPinned ? '📌' : '📍'
  }

  return {
    pinnedIds: readonly(pinnedIds),
    addPin,
    removePin,
    togglePin,
    isPinned,
    getPinnedCommands,
    getPinIcon
  }
}
