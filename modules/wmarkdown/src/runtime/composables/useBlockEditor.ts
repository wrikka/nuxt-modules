import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { SlashCommand, BlockEditorOptions } from '../types'

const defaultCommands: SlashCommand[] = [
  {
    id: 'heading1',
    label: 'Heading 1',
    icon: 'h-1',
    description: 'Insert a large heading',
    action: () => {}
  },
  {
    id: 'heading2',
    label: 'Heading 2',
    icon: 'h-2',
    description: 'Insert a medium heading',
    action: () => {}
  },
  {
    id: 'heading3',
    label: 'Heading 3',
    icon: 'h-3',
    description: 'Insert a small heading',
    action: () => {}
  },
  {
    id: 'paragraph',
    label: 'Text',
    icon: 'type',
    description: 'Insert plain text block',
    action: () => {}
  },
  {
    id: 'bulleted-list',
    label: 'Bulleted List',
    icon: 'list',
    description: 'Create a bulleted list',
    action: () => {}
  },
  {
    id: 'numbered-list',
    label: 'Numbered List',
    icon: 'list-ordered',
    description: 'Create a numbered list',
    action: () => {}
  },
  {
    id: 'to-do',
    label: 'To-do List',
    icon: 'check-square',
    description: 'Create a to-do list',
    action: () => {}
  },
  {
    id: 'code',
    label: 'Code',
    icon: 'code',
    description: 'Insert a code block',
    action: () => {}
  },
  {
    id: 'quote',
    label: 'Quote',
    icon: 'quote',
    description: 'Insert a quote block',
    action: () => {}
  },
  {
    id: 'callout',
    label: 'Callout',
    icon: 'alert-circle',
    description: 'Insert a callout block',
    action: () => {}
  },
  {
    id: 'table',
    label: 'Table',
    icon: 'table',
    description: 'Insert a table',
    action: () => {}
  },
  {
    id: 'divider',
    label: 'Divider',
    icon: 'minus',
    description: 'Insert a horizontal divider',
    action: () => {}
  },
  {
    id: 'image',
    label: 'Image',
    icon: 'image',
    description: 'Upload or embed an image',
    action: () => {}
  },
  {
    id: 'embed',
    label: 'Embed',
    icon: 'link',
    description: 'Embed external content',
    action: () => {}
  }
]

export function useBlockEditor(options: Partial<BlockEditorOptions> = {}) {
  const commands = ref<SlashCommand[]>([
    ...defaultCommands,
    ...(options.slashCommands || [])
  ])
  const isMenuOpen = ref(false)
  const searchQuery = ref('')
  const selectedIndex = ref(0)
  const filteredCommands = computed(() => {
    const query = searchQuery.value.toLowerCase()
    return commands.value.filter(
      cmd =>
        cmd.label.toLowerCase().includes(query) ||
        cmd.description.toLowerCase().includes(query)
    )
  })

  const showMenu = () => {
    isMenuOpen.value = true
    searchQuery.value = ''
    selectedIndex.value = 0
  }

  const hideMenu = () => {
    isMenuOpen.value = false
  }

  const selectCommand = (index: number) => {
    selectedIndex.value = index
  }

  const executeCommand = (index?: number) => {
    const cmdIndex = index ?? selectedIndex.value
    const command = filteredCommands.value[cmdIndex]
    if (command) {
      command.action()
      hideMenu()
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isMenuOpen.value) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        selectedIndex.value = (selectedIndex.value + 1) % filteredCommands.value.length
        break
      case 'ArrowUp':
        event.preventDefault()
        selectedIndex.value =
          (selectedIndex.value - 1 + filteredCommands.value.length) %
          filteredCommands.value.length
        break
      case 'Enter':
        event.preventDefault()
        executeCommand()
        break
      case 'Escape':
        event.preventDefault()
        hideMenu()
        break
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })

  return {
    commands,
    isMenuOpen,
    searchQuery,
    selectedIndex,
    filteredCommands,
    showMenu,
    hideMenu,
    selectCommand,
    executeCommand
  }
}
