<script setup lang="ts">
import { computed, ref } from 'vue'

interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  action: string
  description: string
  scope?: 'global' | 'editor' | 'viewer'
}

interface Props {
  shortcuts?: KeyboardShortcut[]
  showHelp?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showHelp: true,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'shortcut', action: string, event: KeyboardEvent): void
}>()

const showShortcutsPanel = ref(false)
const activeScope = ref<'global' | 'editor' | 'viewer'>('global')

const defaultShortcuts: KeyboardShortcut[] = [
  // Navigation
  { key: 'j', action: 'nextLine', description: 'Go to next line', scope: 'viewer' },
  { key: 'k', action: 'prevLine', description: 'Go to previous line', scope: 'viewer' },
  { key: 'g', ctrl: true, action: 'goToLine', description: 'Go to specific line', scope: 'viewer' },
  { key: 'Home', action: 'goToFirst', description: 'Go to first line', scope: 'viewer' },
  { key: 'End', action: 'goToLast', description: 'Go to last line', scope: 'viewer' },
  
  // Diff actions
  { key: 'n', action: 'nextDiff', description: 'Go to next difference', scope: 'viewer' },
  { key: 'p', action: 'prevDiff', description: 'Go to previous difference', scope: 'viewer' },
  { key: 'a', action: 'acceptChange', description: 'Accept current change', scope: 'viewer' },
  { key: 'r', action: 'rejectChange', description: 'Reject current change', scope: 'viewer' },
  
  // View modes
  { key: '1', action: 'splitView', description: 'Split view mode', scope: 'viewer' },
  { key: '2', action: 'unifiedView', description: 'Unified view mode', scope: 'viewer' },
  { key: '3', action: 'inlineView', description: 'Inline view mode', scope: 'viewer' },
  
  // Editor actions
  { key: 'z', ctrl: true, action: 'undo', description: 'Undo', scope: 'editor' },
  { key: 'z', ctrl: true, shift: true, action: 'redo', description: 'Redo', scope: 'editor' },
  { key: 's', ctrl: true, action: 'save', description: 'Save changes', scope: 'editor' },
  { key: 'f', ctrl: true, action: 'find', description: 'Find', scope: 'editor' },
  { key: 'h', ctrl: true, action: 'replace', description: 'Find and replace', scope: 'editor' },
  
  // General
  { key: '/', action: 'search', description: 'Quick search', scope: 'global' },
  { key: '?', action: 'help', description: 'Show keyboard shortcuts', scope: 'global' },
  { key: 'Escape', action: 'close', description: 'Close/cancel', scope: 'global' },
  { key: 'F11', action: 'fullscreen', description: 'Toggle fullscreen', scope: 'global' },
  { key: 'm', action: 'toggleMenu', description: 'Toggle menu', scope: 'global' },
]

const allShortcuts = computed(() => [
  ...defaultShortcuts,
  ...(props.shortcuts || []),
])

const groupedShortcuts = computed(() => {
  const groups: Record<string, KeyboardShortcut[]> = {}
  
  for (const shortcut of allShortcuts.value) {
    const scope = shortcut.scope || 'global'
    if (!groups[scope]) {
      groups[scope] = []
    }
    groups[scope].push(shortcut)
  }
  
  return groups
})

const formatShortcut = (shortcut: KeyboardShortcut): string => {
  const parts: string[] = []
  
  if (shortcut.ctrl) parts.push('Ctrl')
  if (shortcut.alt) parts.push('Alt')
  if (shortcut.shift) parts.push('Shift')
  if (shortcut.meta) parts.push('⌘')
  
  // Format special keys
  const keyMap: Record<string, string> = {
    'ArrowUp': '↑',
    'ArrowDown': '↓',
    'ArrowLeft': '←',
    'ArrowRight': '→',
    'Enter': '↵',
    'Escape': 'Esc',
    'Home': 'Home',
    'End': 'End',
    'PageUp': 'PgUp',
    'PageDown': 'PgDn',
    'Tab': 'Tab',
  }
  
  parts.push(keyMap[shortcut.key] || shortcut.key.toUpperCase())
  
  return parts.join(' + ')
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return
  
  // Don't trigger shortcuts in input fields unless specifically allowed
  const target = event.target as HTMLElement
  const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
  
  for (const shortcut of allShortcuts.value) {
    if (matchesShortcut(event, shortcut)) {
      // Check scope
      if (isInput && shortcut.scope !== 'editor') {
        continue
      }
      
      event.preventDefault()
      emit('shortcut', shortcut.action, event)
      
      // Handle built-in actions
      handleBuiltInAction(shortcut.action)
      
      return
    }
  }
}

const matchesShortcut = (event: KeyboardEvent, shortcut: KeyboardShortcut): boolean => {
  const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase() ||
                   event.code === shortcut.key
  
  const ctrlMatch = !!shortcut.ctrl === (event.ctrlKey || event.metaKey)
  const shiftMatch = !!shortcut.shift === event.shiftKey
  const altMatch = !!shortcut.alt === event.altKey
  const metaMatch = !!shortcut.meta === event.metaKey
  
  return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch
}

const handleBuiltInAction = (action: string) => {
  switch (action) {
    case 'help':
      showShortcutsPanel.value = true
      break
    case 'close':
      showShortcutsPanel.value = false
      break
  }
}

// Composable for keyboard shortcuts
export const useKeyboardShortcuts = (
  customShortcuts: KeyboardShortcut[],
  onShortcut: (action: string, event: KeyboardEvent) => void
) => {
  const handleKeydown = (event: KeyboardEvent) => {
    for (const shortcut of customShortcuts) {
      if (matchesShortcut(event, shortcut)) {
        event.preventDefault()
        onShortcut(shortcut.action, event)
        return
      }
    }
  }
  
  return {
    handleKeydown,
    formatShortcut,
  }
}

defineExpose({
  showShortcutsPanel,
  activeScope,
  allShortcuts,
  handleKeydown,
})
</script>

<template>
  <div class="keyboard-shortcuts-system">
    <!-- Global keydown listener -->
    <div tabindex="0" class="keydown-listener" @keydown="handleKeydown">
      <slot />
    </div>

    <!-- Shortcuts help panel -->
    <Teleport v-if="showHelp" to="body">
      <Transition name="fade">
        <div
          v-if="showShortcutsPanel"
          class="shortcuts-overlay"
          @click="showShortcutsPanel = false"
        >
          <div class="shortcuts-panel" @click.stop>
            <div class="panel-header">
              <h3>⌨️ Keyboard Shortcuts</h3>
              <button class="btn-close" @click="showShortcutsPanel = false">
                ×
              </button>
            </div>

            <div class="scope-selector">
              <button
                v-for="scope in ['global', 'viewer', 'editor']"
                :key="scope"
                :class="['scope-btn', { active: activeScope === scope }]"
                @click="activeScope = scope as typeof activeScope"
              >
                {{ scope }}
              </button>
            </div>

            <div class="shortcuts-list">
              <div
                v-for="(shortcuts, scope) in groupedShortcuts"
                :key="scope"
                :class="['scope-section', { active: activeScope === scope }]"
              >
                <h4 class="scope-title">{{ scope }}</h4>
                <div class="shortcut-items">
                  <div
                    v-for="shortcut in shortcuts"
                    :key="`${shortcut.key}-${shortcut.action}`"
                    class="shortcut-item"
                  >
                    <kbd class="shortcut-key">{{ formatShortcut(shortcut) }}</kbd>
                    <span class="shortcut-description">{{ shortcut.description }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="panel-footer">
              <span class="hint">Press ? anytime to show this help</span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Quick help indicator -->
    <div v-if="showHelp" class="help-indicator" @click="showShortcutsPanel = true">
      <span class="help-key">?</span>
      <span class="help-text">Shortcuts</span>
    </div>
  </div>
</template>

<style scoped>
.keyboard-shortcuts-system {
  @apply contents;
}

.keydown-listener {
  @apply outline-none;
}

.shortcuts-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center;
  @apply bg-black/50 backdrop-blur-sm;
}

.shortcuts-panel {
  @apply w-full max-w-2xl max-h-[80vh] bg-white dark:bg-gray-900 rounded-lg shadow-xl;
  @apply flex flex-col overflow-hidden;
}

.panel-header {
  @apply flex items-center justify-between px-6 py-4;
  @apply border-b border-gray-200 dark:border-gray-700;
}

.panel-header h3 {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.btn-close {
  @apply w-8 h-8 flex items-center justify-center rounded-full;
  @apply text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800;
  @apply transition-colors;
}

.scope-selector {
  @apply flex gap-1 p-4 border-b border-gray-200 dark:border-gray-700;
}

.scope-btn {
  @apply px-4 py-2 text-sm rounded-md capitalize;
  @apply text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800;
  @apply transition-colors;
}

.scope-btn.active {
  @apply bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium;
}

.shortcuts-list {
  @apply flex-1 overflow-y-auto p-4;
}

.scope-section {
  @apply hidden;
}

.scope-section.active {
  @apply block;
}

.scope-title {
  @apply text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider;
  @apply mb-3;
}

.shortcut-items {
  @apply space-y-2;
}

.shortcut-item {
  @apply flex items-center justify-between py-2 px-3 rounded;
  @apply hover:bg-gray-50 dark:hover:bg-gray-800/50;
  @apply transition-colors;
}

.shortcut-key {
  @apply px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded;
  @apply text-sm font-mono font-semibold text-gray-700 dark:text-gray-300;
  @apply border border-gray-300 dark:border-gray-600 shadow-sm;
}

.shortcut-description {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.panel-footer {
  @apply px-6 py-3 bg-gray-50 dark:bg-gray-800;
  @apply border-t border-gray-200 dark:border-gray-700;
}

.hint {
  @apply text-xs text-gray-500 dark:text-gray-400;
}

.help-indicator {
  @apply fixed bottom-4 right-4 flex items-center gap-2;
  @apply px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg;
  @apply border border-gray-200 dark:border-gray-700;
  @apply cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700;
  @apply transition-all z-40;
}

.help-key {
  @apply w-6 h-6 flex items-center justify-center;
  @apply bg-gray-100 dark:bg-gray-700 rounded text-sm font-semibold;
}

.help-text {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-200;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}
</style>
