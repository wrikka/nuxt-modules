import { readonly, ref } from 'vue'
import { paletteRegistry } from '../core/registry'
import type { Command } from '../types'

export interface NLResult {
  intent: string
  confidence: number
  matchedCommand?: Command
  suggestedQueries: string[]
}

/**
 * Natural Language Input - Understand natural language commands
 */
export function useNaturalLanguage() {
  const isProcessing = ref(false)
  const lastResult = ref<NLResult | null>(null)

  const patterns: Record<string, string[]> = {
    'go-home': ['home', 'main page', 'dashboard', 'start'],
    'search': ['find', 'search for', 'look up', 'where is'],
    'settings': ['settings', 'preferences', 'config', 'options'],
    'logout': ['logout', 'sign out', 'exit', 'leave'],
    'create': ['new', 'create', 'add', 'make'],
    'delete': ['delete', 'remove', 'destroy', 'clear'],
    'edit': ['edit', 'modify', 'change', 'update'],
    'save': ['save', 'store', 'keep', 'preserve'],
    'help': ['help', 'support', 'assist', 'guide'],
    'refresh': ['refresh', 'reload', 'update', 'sync']
  }

  const parse = (input: string): NLResult => {
    isProcessing.value = true
    const query = input.toLowerCase().trim()
    const commands = paletteRegistry.getAll()

    let bestMatch: { command: Command; score: number } | null = null

    for (const command of commands) {
      let score = 0

      if (command.title.toLowerCase().includes(query)) score += 0.9
      if (command.description?.toLowerCase().includes(query)) score += 0.7
      if (command.keywords?.some(k => query.includes(k.toLowerCase()))) score += 0.8

      for (const [cmdId, cmdPatterns] of Object.entries(patterns)) {
        if (cmdId === command.id) {
          for (const pattern of cmdPatterns) {
            if (query.includes(pattern)) score += 0.6
          }
        }
      }

      if (score > (bestMatch?.score || 0)) {
        bestMatch = { command, score }
      }
    }

    const result: NLResult = {
      intent: bestMatch?.command.id || 'unknown',
      confidence: bestMatch?.score || 0,
      matchedCommand: bestMatch?.command,
      suggestedQueries: generateSuggestions(query)
    }

    lastResult.value = result
    isProcessing.value = false
    return result
  }

  const generateSuggestions = (query: string): string[] => {
    const suggestions: string[] = []

    if (query.includes('go') || query.includes('navigate')) {
      suggestions.push('Go to home page', 'Navigate to settings')
    }
    if (query.includes('find') || query.includes('search')) {
      suggestions.push('Search for files', 'Find documents')
    }
    if (query.includes('create') || query.includes('make')) {
      suggestions.push('Create new file', 'Add new item')
    }

    return suggestions.slice(0, 3)
  }

  return {
    isProcessing: readonly(isProcessing),
    lastResult: readonly(lastResult),
    parse,
    patterns
  }
}
