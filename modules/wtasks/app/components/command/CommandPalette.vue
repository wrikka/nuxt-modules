<script setup lang="ts">
import { useCommandPalette } from "../../composables/useCommandPalette"

const { isOpen, searchQuery, groupedCommands, selectedIndex, close, executeSelected, registerCommand } = useCommandPalette()

// Convert grouped commands to flat array for wui CommandPalette
const allCommands = computed(() => {
  const result: Array<{
    id: string
    label: string
    description?: string
    icon?: string
    shortcut?: string
    section: string
    action: () => void | Promise<void>
  }> = []
  for (const [section, items] of groupedCommands.value) {
    for (const item of items) {
      result.push({
        ...item,
        section
      })
    }
  }
  return result
})
</script>

<template>
  <OrganismsCommandPalette
    v-model="isOpen"
    :commands="allCommands"
    @select="executeSelected"
    @close="close"
  />
</template>
