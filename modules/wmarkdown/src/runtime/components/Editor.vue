<script setup lang="ts">
import type { Token } from '../../types'

interface Block {
  id: string
  type: 'heading' | 'paragraph' | 'code' | 'blockquote' | 'list' | 'todo' | 'image' | 'divider'
  content: string
  props?: Record<string, unknown>
}

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const blocks = ref<Block[]>([
  { id: crypto.randomUUID(), type: 'heading', content: 'Untitled', props: { level: 1 } },
  { id: crypto.randomUUID(), type: 'paragraph', content: '' }
])

const activeBlockId = ref<string>('')
const showSlashMenu = ref(false)
const slashMenuPosition = ref({ x: 0, y: 0 })
const selectedBlockIndex = ref(0)

const slashCommands = [
  { type: 'heading', label: 'Heading 1', icon: 'h1', shortcut: '# ' },
  { type: 'heading', label: 'Heading 2', icon: 'h2', shortcut: '## ' },
  { type: 'heading', label: 'Heading 3', icon: 'h3', shortcut: '### ' },
  { type: 'paragraph', label: 'Text', icon: 'text', shortcut: '' },
  { type: 'code', label: 'Code', icon: 'code', shortcut: '```' },
  { type: 'blockquote', label: 'Quote', icon: 'quote', shortcut: '> ' },
  { type: 'list', label: 'Bullet List', icon: 'list', shortcut: '- ' },
  { type: 'list', label: 'Numbered List', icon: 'list-numbered', shortcut: '1. ' },
  { type: 'todo', label: 'To-do', icon: 'check-square', shortcut: '- [ ] ' },
  { type: 'image', label: 'Image', icon: 'image', shortcut: '![]()' },
  { type: 'divider', label: 'Divider', icon: 'minus', shortcut: '---' }
]

const filteredCommands = computed(() => {
  const activeBlock = blocks.value.find(b => b.id === activeBlockId.value)
  if (!activeBlock) return slashCommands

  const query = activeBlock.content.replace(/^\//, '').toLowerCase()
  if (!query) return slashCommands

  return slashCommands.filter(cmd =>
    cmd.label.toLowerCase().includes(query) ||
    cmd.shortcut.includes(query)
  )
})

const updateBlock = (id: string, content: string) => {
  const block = blocks.value.find(b => b.id === id)
  if (!block) return

  block.content = content

  if (content.startsWith('/')) {
    showSlashMenu.value = true
    selectedBlockIndex.value = 0
  } else {
    showSlashMenu.value = false
  }

  syncToMarkdown()
}

const syncToMarkdown = () => {
  const markdown = blocks.value.map(block => {
    switch (block.type) {
      case 'heading':
        const level = (block.props?.level as number) || 1
        return `${'#'.repeat(level)} ${block.content}`
      case 'code':
        return `\`\`\`\n${block.content}\n\`\`\``
      case 'blockquote':
        return block.content.split('\n').map(line => `> ${line}`).join('\n')
      case 'list':
        const ordered = block.props?.ordered as boolean
        return block.content.split('\n').map((line, i) =>
          ordered ? `${i + 1}. ${line}` : `- ${line}`
        ).join('\n')
      case 'todo':
        return `- [${block.props?.checked ? 'x' : ' '}] ${block.content}`
      case 'image':
        return `![${block.content}](${block.props?.src || ''})`
      case 'divider':
        return '---'
      default:
        return block.content
    }
  }).join('\n\n')

  emit('update:modelValue', markdown)
}

const insertBlock = (index: number, type: Block['type']) => {
  const newBlock: Block = {
    id: crypto.randomUUID(),
    type,
    content: '',
    props: type === 'heading' ? { level: 1 } : {}
  }

  blocks.value.splice(index + 1, 0, newBlock)
  activeBlockId.value = newBlock.id
  showSlashMenu.value = false

  nextTick(() => {
    const el = document.querySelector(`[data-block-id="${newBlock.id}"]`) as HTMLElement
    el?.focus()
  })
}

const deleteBlock = (id: string) => {
  const index = blocks.value.findIndex(b => b.id === id)
  if (index > 0) {
    blocks.value.splice(index, 1)
    activeBlockId.value = blocks.value[index - 1]?.id || ''
  }
}

const handleKeydown = (e: KeyboardEvent, block: Block, index: number) => {
  if (showSlashMenu.value) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      selectedBlockIndex.value = (selectedBlockIndex.value + 1) % filteredCommands.value.length
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      selectedBlockIndex.value = (selectedBlockIndex.value - 1 + filteredCommands.value.length) % filteredCommands.value.length
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const cmd = filteredCommands.value[selectedBlockIndex.value]
      if (cmd) {
        block.type = cmd.type as Block['type']
        if (cmd.type === 'heading') {
          block.props = { level: parseInt(cmd.icon.replace('h', '')) || 1 }
        }
        block.content = ''
        showSlashMenu.value = false
        syncToMarkdown()
      }
    } else if (e.key === 'Escape') {
      showSlashMenu.value = false
    }
    return
  }

  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    insertBlock(index, 'paragraph')
  } else if (e.key === 'Backspace' && block.content === '' && blocks.value.length > 1) {
    e.preventDefault()
    deleteBlock(block.id)
  } else if (e.key === '/' && block.content === '') {
    showSlashMenu.value = true
    selectedBlockIndex.value = 0
  }
}

const getBlockPlaceholder = (block: Block): string => {
  switch (block.type) {
    case 'heading': return `Heading ${block.props?.level || 1}`
    case 'code': return "Enter code, type '/' for commands"
    case 'blockquote': return 'Empty quote'
    case 'list': return 'List item'
    case 'todo': return 'To-do'
    case 'image': return 'Add a caption'
    case 'divider': return ''
    default: return "Type '/' for commands"
  }
}
</script>

<template>
  <div class="wmarkdown-editor">
    <div class="blocks">
      <div
        v-for="(block, index) in blocks"
        :key="block.id"
        class="block-wrapper"
        :data-block-type="block.type"
      >
        <div class="block-controls">
          <button
            class="drag-handle"
            title="Drag to reorder"
          >
            <Icon name="lucide:grip-vertical" />
          </button>
          <button
            class="add-block"
            @click="insertBlock(index, 'paragraph')"
          >
            <Icon name="lucide:plus" />
          </button>
        </div>

        <div
          :data-block-id="block.id"
          class="block-content"
          :class="[`block-${block.type}`]"
          contenteditable
          @input="(e) => updateBlock(block.id, (e.target as HTMLElement).innerText)"
          @keydown="(e) => handleKeydown(e, block, index)"
          @focus="activeBlockId = block.id"
        >
          <span
            v-if="!block.content"
            class="placeholder"
          >{{ getBlockPlaceholder(block) }}</span>
        </div>

        <!-- Slash Menu -->
        <div
          v-if="showSlashMenu && activeBlockId === block.id"
          class="slash-menu"
          :style="{ top: slashMenuPosition.y + 'px', left: slashMenuPosition.x + 'px' }"
        >
          <div class="slash-menu-header">
            Basic blocks
          </div>
          <div
            v-for="(cmd, cmdIndex) in filteredCommands"
            :key="cmd.type + cmd.label"
            class="slash-item"
            :class="{ selected: cmdIndex === selectedBlockIndex }"
            @click="() => {
              block.type = cmd.type as Block['type']
              if (cmd.type === 'heading') {
                block.props = { level: parseInt(cmd.icon.replace('h', '')) || 1 }
              }
              block.content = ''
              showSlashMenu = false
            }"
          >
            <Icon
              :name="`lucide:${cmd.icon}`"
              class="slash-icon"
            />
            <div class="slash-info">
              <div class="slash-label">{{ cmd.label }}</div>
              <div class="slash-shortcut">{{ cmd.shortcut }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wmarkdown-editor {
  @apply relative max-w-3xl mx-auto px-8 py-12;
  font-family: var(--wmd-font-sans);
  color: var(--wmd-text-primary);
}

.blocks {
  @apply space-y-1;
}

.block-wrapper {
  @apply relative flex items-start gap-3 group;
  @apply transition-all duration-200;
  @apply hover:bg-gray-50/50 rounded-lg;
  padding: var(--wmd-space-1) var(--wmd-space-2);
  margin: calc(var(--wmd-space-1) * -1) calc(var(--wmd-space-2) * -1);
}

.block-wrapper:focus-within {
  @apply bg-blue-50/30;
}

.block-controls {
  @apply flex items-center gap-1;
  @apply opacity-0 group-hover:opacity-100 transition-all duration-200;
  @apply absolute -left-10 top-1.5;
}

.block-controls {
  transform: translateX(-4px);
  transition: opacity var(--wmd-transition-base), transform var(--wmd-transition-base);
}

.group:hover .block-controls {
  transform: translateX(0);
}

.drag-handle,
.add-block {
  @apply p-1.5 rounded-md;
  @apply text-gray-400 hover:text-gray-600 hover:bg-gray-100;
  @apply transition-all duration-150;
  @apply hover:scale-105 active:scale-95;
}

.drag-handle:hover {
  @apply cursor-grab;
}

.drag-handle:active {
  @apply cursor-grabbing;
}

.add-block {
  @apply opacity-0 group-hover:opacity-100;
  transition-delay: 50ms;
}

.block-content {
  @apply flex-1 min-h-[1.6em] outline-none cursor-text;
  @apply text-base leading-relaxed;
  font-family: var(--wmd-font-sans);
  line-height: var(--wmd-leading-relaxed);
  padding: var(--wmd-space-1) 0;
  transition: all var(--wmd-transition-base);
}

.block-content:focus {
  @apply outline-none;
}

.placeholder {
  @apply text-gray-400 pointer-events-none;
  font-style: italic;
  opacity: 0.7;
}

/* Heading Styles with beautiful typography */
.block-h1 {
  @apply text-4xl font-bold tracking-tight;
  color: var(--wmd-text-primary);
  line-height: var(--wmd-leading-tight);
  margin-bottom: var(--wmd-space-6);
  margin-top: var(--wmd-space-8);
}

.block-h2 {
  @apply text-3xl font-bold tracking-tight;
  color: var(--wmd-text-primary);
  line-height: var(--wmd-leading-tight);
  margin-bottom: var(--wmd-space-4);
  margin-top: var(--wmd-space-6);
}

.block-h3 {
  @apply text-2xl font-semibold;
  color: var(--wmd-text-primary);
  line-height: var(--wmd-leading-tight);
  margin-bottom: var(--wmd-space-3);
  margin-top: var(--wmd-space-5);
}

/* Code block with syntax highlighting feel */
.block-code {
  @apply font-mono rounded-lg p-4;
  background: var(--wmd-bg-secondary);
  border: 1px solid var(--wmd-border-light);
  font-family: var(--wmd-font-mono);
  font-size: var(--wmd-text-sm);
  line-height: var(--wmd-leading-normal);
  white-space: pre-wrap;
  overflow-x: auto;
}

.block-code:focus-within {
  @apply ring-2 ring-blue-200;
}

/* Blockquote with elegant styling */
.block-blockquote {
  @apply border-l-4 pl-4 py-2 italic;
  border-color: var(--wmd-primary-300);
  background: linear-gradient(to right, var(--wmd-primary-50), transparent);
  border-radius: 0 var(--wmd-radius-md) var(--wmd-radius-md) 0;
}

/* List styling */
.block-list {
  @apply pl-6;
}

/* To-do with checkbox styling */
.block-todo {
  @apply flex items-center gap-3;
}

.block-todo::before {
  content: '';
  @apply w-5 h-5 border-2 rounded;
  border-color: var(--wmd-border-strong);
  background: var(--wmd-bg-primary);
  transition: all var(--wmd-transition-fast);
}

.block-todo:hover::before {
  border-color: var(--wmd-primary-400);
}

/* Divider with subtle gradient */
.block-divider {
  @apply my-6 relative;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--wmd-border-default), transparent);
}

.block-divider::before {
  content: '';
  @apply absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2;
  @apply w-8 h-1 rounded-full;
  background: var(--wmd-border-default);
}

/* Slash Menu with modern glassmorphism */
.slash-menu {
  @apply absolute z-50 rounded-xl overflow-hidden;
  @apply w-80 max-h-96;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid var(--wmd-border-light);
  box-shadow: var(--wmd-shadow-xl), 0 0 0 1px rgba(0, 0, 0, 0.05);
  animation: wmd-scale-in var(--wmd-transition-spring);
}

[data-theme="dark"] .slash-menu {
  background: rgba(30, 41, 59, 0.95);
  border-color: var(--wmd-border-default);
}

.slash-menu-header {
  @apply px-4 py-3 text-xs font-semibold uppercase tracking-wider;
  color: var(--wmd-text-muted);
  background: var(--wmd-bg-secondary);
  border-bottom: 1px solid var(--wmd-border-light);
}

.slash-item {
  @apply flex items-center gap-4 px-4 py-3 cursor-pointer;
  @apply transition-all duration-150;
  border-bottom: 1px solid var(--wmd-border-light);
}

.slash-item:last-child {
  border-bottom: none;
}

.slash-item:hover,
.slash-item.selected {
  background: var(--wmd-primary-50);
}

[data-theme="dark"] .slash-item:hover,
[data-theme="dark"] .slash-item.selected {
  background: var(--wmd-primary-900);
}

.slash-icon {
  @apply w-10 h-10 flex items-center justify-center rounded-lg;
  background: var(--wmd-bg-secondary);
  color: var(--wmd-text-secondary);
  transition: all var(--wmd-transition-fast);
}

.slash-item:hover .slash-icon,
.slash-item.selected .slash-icon {
  background: var(--wmd-primary-100);
  color: var(--wmd-primary-600);
  transform: scale(1.05);
}

.slash-info {
  @apply flex-1;
}

.slash-label {
  @apply text-sm font-medium;
  color: var(--wmd-text-primary);
}

.slash-shortcut {
  @apply text-xs mt-0.5;
  color: var(--wmd-text-muted);
  font-family: var(--wmd-font-mono);
}

/* Block hover indicator */
.block-wrapper::before {
  content: '';
  @apply absolute left-0 top-0 bottom-0 w-0.5 rounded-full;
  background: var(--wmd-primary-400);
  opacity: 0;
  transition: opacity var(--wmd-transition-fast);
}

.block-wrapper:hover::before {
  opacity: 1;
}

/* Empty state styling */
.wmarkdown-editor:empty::after {
  content: 'Start typing or type "/" for commands';
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
  @apply text-gray-400 text-lg;
  font-style: italic;
}
</style>
