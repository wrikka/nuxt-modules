import { ref, computed } from 'vue'

interface Block {
  id: string
  type: string
  content: string
  props?: Record<string, unknown>
}

interface DragState {
  isDragging: boolean
  draggedBlockId: string | null
  dropTargetId: string | null
  dropPosition: 'before' | 'after' | 'inside' | null
}

export function useDragDropBlocks() {
  const blocks = ref<Block[]>([])
  const dragState = ref<DragState>({
    isDragging: false,
    draggedBlockId: null,
    dropTargetId: null,
    dropPosition: null
  })

  const draggedBlock = computed(() => {
    return blocks.value.find(b => b.id === dragState.value.draggedBlockId) || null
  })

  const startDrag = (blockId: string) => {
    dragState.value.isDragging = true
    dragState.value.draggedBlockId = blockId
  }

  const endDrag = () => {
    dragState.value.isDragging = false
    dragState.value.draggedBlockId = null
    dragState.value.dropTargetId = null
    dragState.value.dropPosition = null
  }

  const setDropTarget = (targetId: string | null, position: 'before' | 'after' | 'inside' | null) => {
    dragState.value.dropTargetId = targetId
    dragState.value.dropPosition = position
  }

  const moveBlock = (blockId: string, targetId: string, position: 'before' | 'after' | 'inside'): boolean => {
    const sourceIndex = blocks.value.findIndex(b => b.id === blockId)
    const targetIndex = blocks.value.findIndex(b => b.id === targetId)

    if (sourceIndex === -1 || targetIndex === -1) return false
    if (sourceIndex === targetIndex) return false

    const [movedBlock] = blocks.value.splice(sourceIndex, 1)

    let newIndex = targetIndex
    if (position === 'after') {
      newIndex = sourceIndex < targetIndex ? targetIndex : targetIndex + 1
    } else if (position === 'before') {
      newIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex
    }

    // Clamp index
    newIndex = Math.max(0, Math.min(newIndex, blocks.value.length))

    if (position === 'inside') {
      // Handle nested blocks - for now just insert after
      blocks.value.splice(targetIndex + 1, 0, movedBlock)
    } else {
      blocks.value.splice(newIndex, 0, movedBlock)
    }

    endDrag()
    return true
  }

  const reorderBlocks = (fromIndex: number, toIndex: number): boolean => {
    if (fromIndex < 0 || fromIndex >= blocks.value.length) return false
    if (toIndex < 0 || toIndex >= blocks.value.length) return false

    const [movedBlock] = blocks.value.splice(fromIndex, 1)
    blocks.value.splice(toIndex, 0, movedBlock)

    return true
  }

  const addBlock = (type: string, content: string, index?: number, props?: Record<string, unknown>): Block => {
    const block: Block = {
      id: generateId(),
      type,
      content,
      props
    }

    if (index !== undefined && index >= 0 && index <= blocks.value.length) {
      blocks.value.splice(index, 0, block)
    } else {
      blocks.value.push(block)
    }

    return block
  }

  const removeBlock = (blockId: string): boolean => {
    const index = blocks.value.findIndex(b => b.id === blockId)
    if (index === -1) return false

    blocks.value.splice(index, 1)
    return true
  }

  const updateBlock = (blockId: string, updates: Partial<Block>): boolean => {
    const block = blocks.value.find(b => b.id === blockId)
    if (!block) return false

    Object.assign(block, updates)
    return true
  }

  const duplicateBlock = (blockId: string, index?: number): Block | null => {
    const block = blocks.value.find(b => b.id === blockId)
    if (!block) return null

    const duplicated: Block = {
      ...block,
      id: generateId()
    }

    const targetIndex = index !== undefined
      ? index
      : blocks.value.findIndex(b => b.id === blockId) + 1

    blocks.value.splice(targetIndex, 0, duplicated)
    return duplicated
  }

  const moveBlockUp = (blockId: string): boolean => {
    const index = blocks.value.findIndex(b => b.id === blockId)
    if (index <= 0) return false

    return reorderBlocks(index, index - 1)
  }

  const moveBlockDown = (blockId: string): boolean => {
    const index = blocks.value.findIndex(b => b.id === blockId)
    if (index === -1 || index >= blocks.value.length - 1) return false

    return reorderBlocks(index, index + 1)
  }

  const getBlockIndex = (blockId: string): number => {
    return blocks.value.findIndex(b => b.id === blockId)
  }

  const toMarkdown = (): string => {
    return blocks.value.map(block => {
      switch (block.type) {
        case 'heading':
          const level = (block.props?.level as number) || 1
          return `${'#'.repeat(level)} ${block.content}`
        case 'paragraph':
          return block.content
        case 'code':
          const lang = (block.props?.lang as string) || ''
          return `\`\`\`${lang}\n${block.content}\n\`\`\``
        case 'blockquote':
          return block.content.split('\n').map(line => `> ${line}`).join('\n')
        case 'list':
          const ordered = block.props?.ordered as boolean
          return block.content.split('\n').map((line, i) =>
            ordered ? `${i + 1}. ${line}` : `- ${line}`
          ).join('\n')
        case 'divider':
          return '---'
        default:
          return block.content
      }
    }).join('\n\n')
  }

  const fromMarkdown = (markdown: string) => {
    const lines = markdown.split('\n')
    const newBlocks: Block[] = []
    let currentBlock: Partial<Block> | null = null
    let codeBlockContent: string[] = []
    let inCodeBlock = false
    let codeBlockLang = ''

    for (const line of lines) {
      // Code block handling
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          newBlocks.push({
            id: generateId(),
            type: 'code',
            content: codeBlockContent.join('\n'),
            props: { lang: codeBlockLang }
          })
          inCodeBlock = false
          codeBlockContent = []
        } else {
          inCodeBlock = true
          codeBlockLang = line.slice(3).trim()
        }
        continue
      }

      if (inCodeBlock) {
        codeBlockContent.push(line)
        continue
      }

      // Heading
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
      if (headingMatch) {
        newBlocks.push({
          id: generateId(),
          type: 'heading',
          content: headingMatch[2],
          props: { level: headingMatch[1].length }
        })
        continue
      }

      // Horizontal rule
      if (line.match(/^(---|___|\*\*\*)$/)) {
        newBlocks.push({
          id: generateId(),
          type: 'divider',
          content: ''
        })
        continue
      }

      // Blockquote
      if (line.startsWith('> ')) {
        const content = line.slice(2)
        const lastBlock = newBlocks[newBlocks.length - 1]
        if (lastBlock?.type === 'blockquote') {
          lastBlock.content += '\n' + content
        } else {
          newBlocks.push({
            id: generateId(),
            type: 'blockquote',
            content
          })
        }
        continue
      }

      // List items
      if (line.match(/^[-*+]\s/)) {
        const content = line.replace(/^[-*+]\s/, '')
        const lastBlock = newBlocks[newBlocks.length - 1]
        if (lastBlock?.type === 'list' && !lastBlock.props?.ordered) {
          lastBlock.content += '\n' + content
        } else {
          newBlocks.push({
            id: generateId(),
            type: 'list',
            content,
            props: { ordered: false }
          })
        }
        continue
      }

      // Ordered list
      if (line.match(/^\d+\.\s/)) {
        const content = line.replace(/^\d+\.\s/, '')
        const lastBlock = newBlocks[newBlocks.length - 1]
        if (lastBlock?.type === 'list' && lastBlock.props?.ordered) {
          lastBlock.content += '\n' + content
        } else {
          newBlocks.push({
            id: generateId(),
            type: 'list',
            content,
            props: { ordered: true }
          })
        }
        continue
      }

      // Paragraph (empty lines separate paragraphs)
      if (line.trim() === '') {
        continue
      }

      const lastBlock = newBlocks[newBlocks.length - 1]
      if (lastBlock?.type === 'paragraph') {
        lastBlock.content += '\n' + line
      } else {
        newBlocks.push({
          id: generateId(),
          type: 'paragraph',
          content: line
        })
      }
    }

    blocks.value = newBlocks
  }

  return {
    blocks,
    dragState,
    draggedBlock,
    startDrag,
    endDrag,
    setDropTarget,
    moveBlock,
    reorderBlocks,
    addBlock,
    removeBlock,
    updateBlock,
    duplicateBlock,
    moveBlockUp,
    moveBlockDown,
    getBlockIndex,
    toMarkdown,
    fromMarkdown
  }
}

function generateId(): string {
  return 'block-' + Math.random().toString(36).substr(2, 9)
}
