import { readonly, ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { paletteRegistry } from '../core/registry'
import type { Command } from '../types'

export interface ShortcutTip {
  commandId: string
  shortcut: string
  title: string
  timesUsed: number
  learnStatus: 'new' | 'learning' | 'learned'
}

/**
 * Keyboard Shortcut Helper - Discover and learn shortcuts
 */
export function useShortcutHelper() {
  const tips = useLocalStorage<ShortcutTip[]>('palette:shortcut-tips', [])
  const dismissedTips = useLocalStorage<string[]>('palette:dismissed-tips', [])
  const showTips = ref(true)

  const allCommands = computed(() => paletteRegistry.getAll())

  const availableShortcuts = computed(() => {
    return allCommands.value
      .filter(c => c.shortcut && !dismissedTips.value.includes(c.id))
      .map(c => ({
        commandId: c.id,
        shortcut: c.shortcut!,
        title: c.title,
        timesUsed: tips.value.find(t => t.commandId === c.id)?.timesUsed || 0,
        learnStatus: tips.value.find(t => t.commandId === c.id)?.learnStatus || 'new'
      }))
  })

  const unlearnedShortcuts = computed(() =>
    availableShortcuts.value.filter(s => s.learnStatus !== 'learned')
  )

  const getTipToShow = (): ShortcutTip | null => {
    if (!showTips.value) return null

    const candidates = unlearnedShortcuts.value
      .sort((a, b) => {
        if (a.timesUsed !== b.timesUsed) return a.timesUsed - b.timesUsed
        return a.learnStatus === 'new' ? -1 : 1
      })

    return candidates[0] || null
  }

  const recordUsage = (commandId: string) => {
    const existing = tips.value.find(t => t.commandId === commandId)
    if (existing) {
      existing.timesUsed++
      if (existing.timesUsed >= 5) {
        existing.learnStatus = 'learned'
      }
      else if (existing.timesUsed >= 2) {
        existing.learnStatus = 'learning'
      }
    }
    else {
      const cmd = allCommands.value.find(c => c.id === commandId)
      if (cmd?.shortcut) {
        tips.value.push({
          commandId,
          shortcut: cmd.shortcut,
          title: cmd.title,
          timesUsed: 1,
          learnStatus: 'learning'
        })
      }
    }
  }

  const dismissTip = (commandId: string) => {
    dismissedTips.value.push(commandId)
  }

  const showTipAgain = (commandId: string) => {
    dismissedTips.value = dismissedTips.value.filter(id => id !== commandId)
  }

  const getProgress = () => {
    const total = availableShortcuts.value.length
    const learned = availableShortcuts.value.filter(s => s.learnStatus === 'learned').length
    return {
      total,
      learned,
      percentage: total > 0 ? Math.round((learned / total) * 100) : 0
    }
  }

  return {
    tips: readonly(tips),
    showTips,
    availableShortcuts,
    unlearnedShortcuts,
    getTipToShow,
    recordUsage,
    dismissTip,
    showTipAgain,
    getProgress
  }
}
