import { readonly, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { Command } from '../types'

export interface CommandAlias {
  alias: string
  commandId: string
  createdAt: number
}

/**
 * Command Aliases - Create nicknames for commands
 */
export function useCommandAliases() {
  const aliases = useLocalStorage<Record<string, string>>('palette:aliases', {})
  const reverseAliases = useLocalStorage<Record<string, string[]>>('palette:reverse-aliases', {})

  const createAlias = (alias: string, commandId: string): boolean => {
    if (aliases.value[alias]) return false

    aliases.value[alias] = commandId

    if (!reverseAliases.value[commandId]) {
      reverseAliases.value[commandId] = []
    }
    reverseAliases.value[commandId].push(alias)

    return true
  }

  const removeAlias = (alias: string): boolean => {
    const commandId = aliases.value[alias]
    if (!commandId) return false

    delete aliases.value[alias]

    if (reverseAliases.value[commandId]) {
      reverseAliases.value[commandId] = reverseAliases.value[commandId].filter(a => a !== alias)
    }

    return true
  }

  const resolveAlias = (alias: string): string | null => {
    return aliases.value[alias] || null
  }

  const getAliasesForCommand = (commandId: string): string[] => {
    return reverseAliases.value[commandId] || []
  }

  const matchWithAliases = (query: string, commands: Command[]): Command[] => {
    const directMatch = commands.find(c => c.id === query || c.title.toLowerCase() === query.toLowerCase())
    if (directMatch) return [directMatch]

    const aliasMatch = resolveAlias(query)
    if (aliasMatch) {
      const cmd = commands.find(c => c.id === aliasMatch)
      if (cmd) return [cmd]
    }

    return commands.filter(c => {
      const cmdAliases = getAliasesForCommand(c.id)
      return cmdAliases.some(a => a.toLowerCase().includes(query.toLowerCase()))
    })
  }

  const getAllAliases = (): CommandAlias[] => {
    return Object.entries(aliases.value).map(([alias, commandId]) => ({
      alias,
      commandId,
      createdAt: Date.now()
    }))
  }

  const clearAllAliases = () => {
    aliases.value = {}
    reverseAliases.value = {}
  }

  return {
    aliases: readonly(aliases),
    createAlias,
    removeAlias,
    resolveAlias,
    getAliasesForCommand,
    matchWithAliases,
    getAllAliases,
    clearAllAliases
  }
}
