import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Command {
  id: string
  label: string
  icon?: string
  shortcut?: string
  category: string
  action: () => void
  disabled?: boolean
}

interface CommandPaletteState {
  isOpen: boolean
  searchQuery: string
  selectedIndex: number
  recentCommands: string[]
}

export function useCommandPalette() {
  const commands = ref<Command[]>([])
  const state = ref<CommandPaletteState>({
    isOpen: false,
    searchQuery: '',
    selectedIndex: 0,
    recentCommands: []
  })

  const filteredCommands = computed(() => {
    const query = state.value.searchQuery.toLowerCase().trim()

    if (!query) {
      // Show recent commands first, then all commands
      const recent = state.value.recentCommands
        .map(id => commands.value.find(c => c.id === id))
        .filter(Boolean) as Command[]

      const others = commands.value.filter(c =>
        !state.value.recentCommands.includes(c.id) && !c.disabled
      )

      return [...recent, ...others]
    }

    // Search by label, category, and shortcut
    return commands.value.filter(cmd => {
      if (cmd.disabled) return false

      const searchText = `${cmd.label} ${cmd.category} ${cmd.shortcut || ''}`.toLowerCase()
      return searchText.includes(query)
    }).sort((a, b) => {
      // Prioritize exact matches
      const aExact = a.label.toLowerCase().startsWith(query)
      const bExact = b.label.toLowerCase().startsWith(query)
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1
      return 0
    })
  })

  const groupedCommands = computed(() => {
    const groups: Record<string, Command[]> = {}

    filteredCommands.value.forEach(cmd => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = []
      }
      groups[cmd.category].push(cmd)
    })

    return groups
  })

  const selectedCommand = computed(() => {
    return filteredCommands.value[state.value.selectedIndex] || null
  })

  const registerCommand = (command: Command) => {
    if (!commands.value.find(c => c.id === command.id)) {
      commands.value.push(command)
    }
  }

  const unregisterCommand = (commandId: string) => {
    const index = commands.value.findIndex(c => c.id === commandId)
    if (index !== -1) {
      commands.value.splice(index, 1)
    }
  }

  const open = () => {
    state.value.isOpen = true
    state.value.searchQuery = ''
    state.value.selectedIndex = 0
  }

  const close = () => {
    state.value.isOpen = false
    state.value.searchQuery = ''
  }

  const toggle = () => {
    if (state.value.isOpen) {
      close()
    } else {
      open()
    }
  }

  const selectNext = () => {
    state.value.selectedIndex = Math.min(
      state.value.selectedIndex + 1,
      filteredCommands.value.length - 1
    )
  }

  const selectPrevious = () => {
    state.value.selectedIndex = Math.max(state.value.selectedIndex - 1, 0)
  }

  const executeSelected = () => {
    const cmd = selectedCommand.value
    if (cmd && !cmd.disabled) {
      executeCommand(cmd.id)
    }
  }

  const executeCommand = (commandId: string) => {
    const command = commands.value.find(c => c.id === commandId)
    if (!command || command.disabled) return false

    // Add to recent commands
    if (!state.value.recentCommands.includes(commandId)) {
      state.value.recentCommands.unshift(commandId)
      if (state.value.recentCommands.length > 5) {
        state.value.recentCommands.pop()
      }
    } else {
      // Move to top
      state.value.recentCommands = state.value.recentCommands.filter(id => id !== commandId)
      state.value.recentCommands.unshift(commandId)
    }

    command.action()
    close()
    return true
  }

  const setSearchQuery = (query: string) => {
    state.value.searchQuery = query
    state.value.selectedIndex = 0
  }

  // Keyboard shortcuts
  const handleKeyDown = (event: KeyboardEvent) => {
    // Cmd/Ctrl + K to toggle
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault()
      toggle()
      return
    }

    if (!state.value.isOpen) return

    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        close()
        break
      case 'ArrowDown':
        event.preventDefault()
        selectNext()
        break
      case 'ArrowUp':
        event.preventDefault()
        selectPrevious()
        break
      case 'Enter':
        event.preventDefault()
        executeSelected()
        break
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })

  // Default commands
  const registerDefaultCommands = () => {
    const defaults: Command[] = [
      {
        id: 'new-document',
        label: 'New Document',
        icon: 'file-plus',
        shortcut: 'Ctrl+N',
        category: 'File',
        action: () => {}
      },
      {
        id: 'save',
        label: 'Save',
        icon: 'save',
        shortcut: 'Ctrl+S',
        category: 'File',
        action: () => {}
      },
      {
        id: 'search',
        label: 'Search',
        icon: 'search',
        shortcut: 'Ctrl+F',
        category: 'Edit',
        action: () => {}
      },
      {
        id: 'toggle-preview',
        label: 'Toggle Preview',
        icon: 'eye',
        shortcut: 'Ctrl+P',
        category: 'View',
        action: () => {}
      },
      {
        id: 'toggle-zen-mode',
        label: 'Zen Mode',
        icon: 'maximize-2',
        shortcut: 'Ctrl+Shift+Z',
        category: 'View',
        action: () => {}
      },
      {
        id: 'export-markdown',
        label: 'Export as Markdown',
        icon: 'file-text',
        category: 'Export',
        action: () => {}
      },
      {
        id: 'export-html',
        label: 'Export as HTML',
        icon: 'code',
        category: 'Export',
        action: () => {}
      },
      {
        id: 'insert-heading',
        label: 'Insert Heading',
        icon: 'heading',
        shortcut: 'Ctrl+1',
        category: 'Insert',
        action: () => {}
      },
      {
        id: 'insert-list',
        label: 'Insert List',
        icon: 'list',
        shortcut: 'Ctrl+L',
        category: 'Insert',
        action: () => {}
      },
      {
        id: 'insert-code',
        label: 'Insert Code Block',
        icon: 'code',
        shortcut: 'Ctrl+Shift+C',
        category: 'Insert',
        action: () => {}
      }
    ]

    defaults.forEach(registerCommand)
  }

  return {
    commands,
    state,
    filteredCommands,
    groupedCommands,
    selectedCommand,
    registerCommand,
    unregisterCommand,
    open,
    close,
    toggle,
    selectNext,
    selectPrevious,
    executeSelected,
    executeCommand,
    setSearchQuery,
    registerDefaultCommands
  }
}
