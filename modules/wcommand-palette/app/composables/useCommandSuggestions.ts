import { useFetch } from '#app'
import { paletteRegistry } from '../core/registry'
import type { Command, SuggestionItem } from '../types'

/**
 * AI-Powered command suggestions based on user patterns and intent
 */
export function useCommandSuggestions() {
  const suggestions = ref<SuggestionItem[]>([])
  const isLoading = ref(false)
  const lastSuggestionTime = ref(0)

  const analyzePatterns = (commands: Command[]) => {
    const analytics = useCommandAnalytics()
    const topCommands = analytics.getTopCommands(10)
    const timeOfDay = new Date().getHours()
    const dayOfWeek = new Date().getDay()

    // Time-based patterns
    const morningCommands = ['daily-standup', 'check-calendar', 'coffee-break']
    const afternoonCommands = ['review-prs', 'deploy-check', 'meeting-prep']
    const eveningCommands = ['daily-summary', 'backup-data', 'shutdown']

    let contextualSuggestions: string[] = []
    if (timeOfDay >= 9 && timeOfDay < 12) {
      contextualSuggestions = morningCommands
    }
    else if (timeOfDay >= 12 && timeOfDay < 17) {
      contextualSuggestions = afternoonCommands
    }
    else {
      contextualSuggestions = eveningCommands
    }

    // Weekend vs weekday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    if (isWeekend) {
      contextualSuggestions.push('weekend-mode', 'personal-tasks')
    }

    return contextualSuggestions
      .map(id => commands.find(c => c.id === id))
      .filter((c): c is Command => c !== undefined)
  }

  const getUnusedCommands = (commands: Command[]) => {
    const analytics = useCommandAnalytics()
    const executedIds = new Set(analytics.getExecutedCommands().map(c => c.commandId))

    return commands
      .filter(c => !executedIds.has(c.id) && !c.hidden)
      .slice(0, 5)
  }

  const generateSuggestions = (commands: Command[]) => {
    isLoading.value = true

    try {
      const patternBased = analyzePatterns(commands)
      const unused = getUnusedCommands(commands)

      const items: SuggestionItem[] = [
        ...patternBased.map(cmd => ({
          id: `pattern-${cmd.id}`,
          type: 'suggestion' as const,
          title: cmd.title,
          description: `Suggested based on your usage pattern`,
          icon: '✨',
          command: cmd
        })),
        ...unused.map(cmd => ({
          id: `discover-${cmd.id}`,
          type: 'suggestion' as const,
          title: cmd.title,
          description: `Try this command you haven't used yet`,
          icon: '🆕',
          command: cmd
        }))
      ]

      suggestions.value = items
      lastSuggestionTime.value = Date.now()
    }
    finally {
      isLoading.value = false
    }
  }

  const refreshSuggestions = () => {
    generateSuggestions(paletteRegistry.getAll())
  }

  return {
    suggestions: readonly(suggestions),
    isLoading: readonly(isLoading),
    generateSuggestions,
    refreshSuggestions,
    lastSuggestionTime: readonly(lastSuggestionTime)
  }
}
