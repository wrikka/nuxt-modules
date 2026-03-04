import { readonly, ref } from 'vue'

export interface CommandCount {
  groupId: string
  groupName: string
  count: number
  total: number
}

/**
 * Command Count Badge - Show result count in group header
 */
export function useCommandCountBadge() {
  const counts = ref<CommandCount[]>([])

  const updateCounts = (groupedCommands: Record<string, unknown[]>) => {
    const total = Object.values(groupedCommands).reduce((sum, arr) => sum + arr.length, 0)

    counts.value = Object.entries(groupedCommands).map(([groupId, commands]) => ({
      groupId,
      groupName: groupId,
      count: commands.length,
      total
    }))
  }

  const getCountForGroup = (groupId: string): number => {
    return counts.value.find(c => c.groupId === groupId)?.count || 0
  }

  const getTotalCount = (): number => {
    return counts.value.reduce((sum, c) => sum + c.count, 0)
  }

  const formatCount = (count: number): string => {
    if (count === 0) return '0'
    if (count > 99) return '99+'
    return count.toString()
  }

  return {
    counts: readonly(counts),
    updateCounts,
    getCountForGroup,
    getTotalCount,
    formatCount
  }
}
