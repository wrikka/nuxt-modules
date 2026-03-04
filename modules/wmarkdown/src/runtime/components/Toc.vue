<script setup lang="ts">
import { useToc } from '../../composables/useToc'
import type { Token } from '../../types'

interface Props {
  tokens: Token[]
  maxDepth?: number
  scrollSpy?: boolean
  collapsible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  maxDepth: 3,
  scrollSpy: true,
  collapsible: false
})

const { items, activeId, generateToc, scrollToId, setupScrollSpy } = useToc()
const expandedItems = ref<Set<string>>(new Set())

watch(() => props.tokens, (newTokens) => {
  generateToc(newTokens)
  if (props.scrollSpy) {
    nextTick(() => {
      setupScrollSpy()
    })
  }
}, { immediate: true })

const toggleExpand = (id: string) => {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id)
  } else {
    expandedItems.value.add(id)
  }
}

const isExpanded = (id: string): boolean => {
  return expandedItems.value.has(id) || !props.collapsible
}

const handleClick = (id: string) => {
  scrollToId(id)
}
</script>

<template>
  <nav class="wmarkdown-toc">
    <div class="toc-header">
      <Icon name="lucide:list" />
      <span>Table of Contents</span>
    </div>

    <ul class="toc-list">
      <li
        v-for="item in items.filter(i => i.level <= maxDepth)"
        :key="item.id"
        class="toc-item"
        :class="{
          'toc-active': activeId === item.id,
          [`toc-level-${item.level}`]: true,
          'toc-has-children': item.children?.length
        }"
        :style="{ paddingLeft: `${(item.level - 1) * 16}px` }"
      >
        <div class="toc-item-content">
          <button
            v-if="item.children?.length && collapsible"
            class="toc-expand-btn"
            @click="toggleExpand(item.id)"
          >
            <Icon
              :name="isExpanded(item.id) ? 'lucide:chevron-down' : 'lucide:chevron-right'"
            />
          </button>

          <a
            :href="`#${item.id}`"
            class="toc-link"
            :class="{ 'toc-link-active': activeId === item.id }"
            @click.prevent="handleClick(item.id)"
          >
            {{ item.text }}
          </a>
        </div>

        <ul
          v-if="item.children?.length && isExpanded(item.id)"
          class="toc-sublist"
        >
          <li
            v-for="child in item.children.filter(c => c.level <= maxDepth)"
            :key="child.id"
            class="toc-item"
            :class="{
              'toc-active': activeId === child.id,
              [`toc-level-${child.level}`]: true
            }"
            :style="{ paddingLeft: `${(child.level - 1) * 16}px` }"
          >
            <a
              :href="`#${child.id}`"
              class="toc-link"
              :class="{ 'toc-link-active': activeId === child.id }"
              @click.prevent="handleClick(child.id)"
            >
              {{ child.text }}
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.wmarkdown-toc {
  @apply p-5 rounded-xl sticky top-4;
  background: var(--wmd-bg-secondary);
  border: 1px solid var(--wmd-border-light);
  box-shadow: var(--wmd-shadow-sm);
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  transition: all var(--wmd-transition-base);
}

.wmarkdown-toc:hover {
  box-shadow: var(--wmd-shadow-md);
}

.wmarkdown-toc::-webkit-scrollbar {
  width: 4px;
}

.wmarkdown-toc::-webkit-scrollbar-thumb {
  background: var(--wmd-border-strong);
  border-radius: var(--wmd-radius-full);
}

.toc-header {
  @apply flex items-center gap-2 font-semibold mb-4 pb-3;
  color: var(--wmd-text-primary);
  border-bottom: 1px solid var(--wmd-border-light);
  font-size: var(--wmd-text-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.toc-header svg {
  @apply w-4 h-4;
  color: var(--wmd-text-muted);
}

.toc-list {
  @apply space-y-0.5;
}

.toc-item {
  @apply relative;
}

.toc-item-content {
  @apply flex items-center gap-1;
}

.toc-expand-btn {
  @apply p-1 rounded-md flex-shrink-0;
  @apply transition-all duration-150;
  color: var(--wmd-text-muted);
  background: transparent;
}

.toc-expand-btn:hover {
  background: var(--wmd-bg-tertiary);
  color: var(--wmd-text-secondary);
}

.toc-link {
  @apply block py-1.5 text-sm rounded-md relative;
  @apply transition-all duration-150;
  color: var(--wmd-text-secondary);
  padding-left: var(--wmd-space-3);
  border-left: 2px solid transparent;
}

.toc-link:hover {
  color: var(--wmd-primary-600);
  background: var(--wmd-bg-tertiary);
}

.toc-link-active {
  color: var(--wmd-primary-600);
  border-left-color: var(--wmd-primary-500);
  background: var(--wmd-primary-50);
  font-weight: 500;
}

.toc-level-1 .toc-link {
  @apply font-medium;
  color: var(--wmd-text-primary);
}

.toc-level-2 .toc-link {
  color: var(--wmd-text-secondary);
}

.toc-level-3 .toc-link {
  @apply text-xs;
  color: var(--wmd-text-muted);
}

.toc-sublist {
  @apply space-y-0.5;
  animation: wmd-fade-in var(--wmd-transition-base);
}

.toc-active::before {
  content: '';
  @apply absolute left-0 top-0 bottom-0 w-0.5 rounded-full;
  background: var(--wmd-primary-500);
  opacity: 0;
  transition: opacity var(--wmd-transition-fast);
}

.toc-active.toc-link-active::before {
  opacity: 1;
}

/* Progress indicator */
.toc-progress {
  @apply absolute left-0 top-0 bottom-0 w-0.5;
  background: var(--wmd-primary-200);
  border-radius: var(--wmd-radius-full);
}

/* Dark mode adjustments */
[data-theme="dark"] .wmarkdown-toc {
  background: var(--wmd-bg-secondary);
  border-color: var(--wmd-border-default);
}

[data-theme="dark"] .toc-header {
  border-color: var(--wmd-border-default);
}

[data-theme="dark"] .toc-link:hover {
  background: var(--wmd-bg-tertiary);
}

[data-theme="dark"] .toc-link-active {
  background: rgba(59, 130, 246, 0.15);
  border-left-color: var(--wmd-primary-400);
}

[data-theme="dark"] .toc-expand-btn:hover {
  background: var(--wmd-bg-tertiary);
}

/* Smooth scrolling for the whole document when clicking TOC links */
html {
  scroll-behavior: smooth;
}

/* Offset for fixed headers */
[id] {
  scroll-margin-top: 2rem;
}
</style>
