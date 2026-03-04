<script setup lang="ts">
import type { MentionItem } from '../composables/useMentions'

const props = defineProps<{
  items: MentionItem[]
  selectedIndex: number
  position: { x: number; y: number }
  query: string
}>()

const emit = defineEmits<{
  select: [item: MentionItem]
  close: []
  'update:selectedIndex': [index: number]
}>()

const popupRef = ref<HTMLElement>()

// Adjust position to stay within viewport
const adjustedPosition = computed(() => {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const popupWidth = 320
  const popupHeight = Math.min(props.items.length * 48 + 60, 400)

  let x = props.position.x
  let y = props.position.y

  // Adjust horizontal position
  if (x + popupWidth > viewportWidth) {
    x = viewportWidth - popupWidth - 16
  }

  // Adjust vertical position (show above if not enough space below)
  if (y + popupHeight > viewportHeight) {
    y = props.position.y - popupHeight - 16
  }

  return { x, y }
})

const selectItem = (item: MentionItem) => {
  emit('select', item)
}

const close = () => {
  emit('close')
}

// Click outside to close
onClickOutside(popupRef, close)

// Scroll selected item into view
watch(() => props.selectedIndex, (newIndex) => {
  nextTick(() => {
    const selectedEl = popupRef.value?.querySelector(`[data-index="${newIndex}"]`)
    selectedEl?.scrollIntoView({ block: 'nearest' })
  })
})

const getTypeIcon = (type: MentionItem['type']) => {
  const icons: Record<string, string> = {
    page: 'lucide:file-text',
    user: 'lucide:user',
    date: 'lucide:calendar',
    block: 'lucide:link'
  }
  return icons[type] || 'lucide:file'
}

const getTypeColor = (type: MentionItem['type']) => {
  const colors: Record<string, string> = {
    page: 'bg-blue-500',
    user: 'bg-green-500',
    date: 'bg-amber-500',
    block: 'bg-purple-500'
  }
  return colors[type] || 'bg-gray-500'
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        ref="popupRef"
        class="mention-popup"
        :style="{
          left: `${adjustedPosition.x}px`,
          top: `${adjustedPosition.y}px`
        }"
      >
        <!-- Header -->
        <div class="popup-header">
          <span class="header-text">Mention</span>
          <span v-if="query" class="query-text">"{{ query }}"</span>
        </div>

        <!-- Items List -->
        <ul class="items-list">
          <li
            v-for="(item, index) in items"
            :key="item.id"
            :data-index="index"
            class="mention-item"
            :class="{ 'item-selected': index === selectedIndex }"
            @click="selectItem(item)"
            @mouseenter="$emit('update:selectedIndex', index)"
          >
            <!-- Type Icon -->
            <div
              class="type-icon"
              :class="getTypeColor(item.type)"
            >
              <Icon :name="getTypeIcon(item.type)" />
            </div>

            <!-- Content -->
            <div class="item-content">
              <div class="item-title">{{ item.title }}</div>
              <div v-if="item.subtitle" class="item-subtitle">
                {{ item.subtitle }}
              </div>
            </div>

            <!-- Metadata -->
            <div v-if="item.metadata" class="item-metadata">
              <span
                v-for="(value, key) in item.metadata"
                :key="key"
                class="metadata-tag"
              >
                {{ value }}
              </span>
            </div>
          </li>
        </ul>

        <!-- Empty State -->
        <div v-if="items.length === 0" class="empty-state">
          <Icon name="lucide:search" />
          <span>No results found</span>
        </div>

        <!-- Footer -->
        <div class="popup-footer">
          <div class="shortcut-hint">
            <kbd>↑↓</kbd>
            <span>to navigate</span>
          </div>
          <div class="shortcut-hint">
            <kbd>↵</kbd>
            <span>to select</span>
          </div>
          <div class="shortcut-hint">
            <kbd>esc</kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.mention-popup {
  @apply fixed z-50 w-80 rounded-xl overflow-hidden;
  background: var(--wmd-bg-primary);
  border: 1px solid var(--wmd-border-light);
  box-shadow: var(--wmd-shadow-xl), 0 0 0 1px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(12px);
  max-height: 400px;
  display: flex;
  flex-direction: column;
}

[data-theme="dark"] .mention-popup {
  background: rgba(30, 41, 59, 0.95);
  border-color: var(--wmd-border-default);
}

.popup-header {
  @apply px-4 py-3 flex items-center gap-2 border-b;
  border-color: var(--wmd-border-light);
  background: var(--wmd-bg-secondary);
}

.header-text {
  @apply text-sm font-semibold uppercase tracking-wide;
  color: var(--wmd-text-muted);
}

.query-text {
  @apply text-sm italic;
  color: var(--wmd-text-secondary);
}

.items-list {
  @apply overflow-y-auto flex-1 py-2;
  max-height: 280px;
}

.items-list::-webkit-scrollbar {
  width: 4px;
}

.items-list::-webkit-scrollbar-thumb {
  background: var(--wmd-border-strong);
  border-radius: var(--wmd-radius-full);
}

.mention-item {
  @apply mx-2 px-3 py-2.5 flex items-center gap-3 rounded-lg cursor-pointer;
  @apply transition-all duration-150;
}

.mention-item:hover,
.mention-item.item-selected {
  background: var(--wmd-primary-50);
}

[data-theme="dark"] .mention-item:hover,
[data-theme="dark"] .mention-item.item-selected {
  background: rgba(59, 130, 246, 0.15);
}

.type-icon {
  @apply w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0;
  @apply text-white;
}

.type-icon svg {
  @apply w-4 h-4;
}

.item-content {
  @apply flex-1 min-w-0;
}

.item-title {
  @apply text-sm font-medium truncate;
  color: var(--wmd-text-primary);
}

.item-subtitle {
  @apply text-xs truncate mt-0.5;
  color: var(--wmd-text-muted);
}

.item-metadata {
  @apply flex items-center gap-1;
}

.metadata-tag {
  @apply px-2 py-0.5 text-xs rounded-full;
  background: var(--wmd-bg-tertiary);
  color: var(--wmd-text-secondary);
}

.empty-state {
  @apply py-8 flex flex-col items-center gap-2;
  color: var(--wmd-text-muted);
}

.empty-state svg {
  @apply w-8 h-8 opacity-50;
}

.popup-footer {
  @apply px-4 py-2 flex items-center gap-4 border-t;
  border-color: var(--wmd-border-light);
  background: var(--wmd-bg-secondary);
}

.shortcut-hint {
  @apply flex items-center gap-1.5 text-xs;
  color: var(--wmd-text-muted);
}

.shortcut-hint kbd {
  @apply px-1.5 py-0.5 rounded text-xs font-mono;
  background: var(--wmd-bg-tertiary);
  border: 1px solid var(--wmd-border-light);
  color: var(--wmd-text-secondary);
}
</style>
