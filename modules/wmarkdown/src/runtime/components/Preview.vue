<script setup lang="ts">
import { useMarkdownParser } from '../../composables/useMarkdownParser'
import type { Token } from '../../types'

interface Props {
  content: string
  highlight?: boolean
  theme?: string
}

const props = withDefaults(defineProps<Props>(), {
  highlight: true,
  theme: 'github-light'
})

const { parse } = useMarkdownParser()
const html = ref('')
const tokens = ref<Token[]>([])

watch(() => props.content, async (newContent) => {
  const result = await parse(newContent, {
    highlight: props.highlight,
    theme: props.theme
  })
  html.value = result.html
  tokens.value = result.tokens
}, { immediate: true })
</script>

<template>
  <article
    class="wmarkdown-preview prose prose-slate max-w-none"
    v-html="html"
  />
</template>

<style>
.wmarkdown-preview {
  @apply prose max-w-none;
  font-family: var(--wmd-font-sans);
  color: var(--wmd-text-primary);
  line-height: var(--wmd-leading-relaxed);
}

.wmarkdown-preview :deep(h1) {
  @apply text-4xl font-bold tracking-tight mb-6 mt-8 pb-4;
  color: var(--wmd-text-primary);
  border-bottom: 2px solid var(--wmd-border-light);
  line-height: var(--wmd-leading-tight);
  letter-spacing: -0.025em;
}

.wmarkdown-preview :deep(h2) {
  @apply text-2xl font-semibold tracking-tight mb-4 mt-8 pb-2;
  color: var(--wmd-text-primary);
  border-bottom: 1px solid var(--wmd-border-light);
  line-height: var(--wmd-leading-tight);
  letter-spacing: -0.025em;
}

.wmarkdown-preview :deep(h3) {
  @apply text-xl font-semibold mb-3 mt-6;
  color: var(--wmd-text-primary);
  line-height: var(--wmd-leading-tight);
}

.wmarkdown-preview :deep(h4) {
  @apply text-lg font-semibold mb-2 mt-5;
  color: var(--wmd-text-secondary);
}

.wmarkdown-preview :deep(p) {
  @apply mb-4;
  color: var(--wmd-text-secondary);
  line-height: var(--wmd-leading-relaxed);
}

.wmarkdown-preview :deep(a) {
  @apply underline decoration-2 underline-offset-2;
  color: var(--wmd-primary-600);
  transition: all var(--wmd-transition-fast);
}

.wmarkdown-preview :deep(a:hover) {
  color: var(--wmd-primary-700);
  text-decoration-color: var(--wmd-primary-400);
}

.wmarkdown-preview :deep(pre) {
  @apply rounded-xl p-5 mb-6 overflow-x-auto;
  background: var(--wmd-gray-900);
  border: 1px solid var(--wmd-gray-800);
  box-shadow: var(--wmd-shadow-lg);
}

.wmarkdown-preview :deep(code) {
  @apply font-mono text-sm;
  font-family: var(--wmd-font-mono);
}

.wmarkdown-preview :deep(:not(pre) > code) {
  @apply px-2 py-1 rounded-md text-sm;
  background: var(--wmd-primary-100);
  color: var(--wmd-primary-700);
  font-family: var(--wmd-font-mono);
  font-weight: 500;
}

.wmarkdown-preview :deep(ul) {
  @apply list-disc pl-6 mb-4;
  color: var(--wmd-text-secondary);
}

.wmarkdown-preview :deep(ol) {
  @apply list-decimal pl-6 mb-4;
  color: var(--wmd-text-secondary);
}

.wmarkdown-preview :deep(li) {
  @apply mb-2;
  line-height: var(--wmd-leading-relaxed);
}

.wmarkdown-preview :deep(li > ul),
.wmarkdown-preview :deep(li > ol) {
  @apply mt-2 mb-2;
}

.wmarkdown-preview :deep(blockquote) {
  @apply pl-6 py-4 pr-4 my-6 rounded-r-lg;
  border-left: 4px solid var(--wmd-primary-400);
  background: linear-gradient(to right, var(--wmd-primary-50), transparent);
  font-style: italic;
  color: var(--wmd-text-secondary);
}

.wmarkdown-preview :deep(blockquote p:last-child) {
  @apply mb-0;
}

.wmarkdown-preview :deep(table) {
  @apply w-full border-collapse mb-6 rounded-lg overflow-hidden;
  box-shadow: var(--wmd-shadow-sm);
  border: 1px solid var(--wmd-border-light);
}

.wmarkdown-preview :deep(th),
.wmarkdown-preview :deep(td) {
  @apply px-4 py-3 text-left;
  border: 1px solid var(--wmd-border-light);
}

.wmarkdown-preview :deep(th) {
  @apply font-semibold text-sm uppercase tracking-wider;
  background: var(--wmd-bg-secondary);
  color: var(--wmd-text-primary);
}

.wmarkdown-preview :deep(tr:nth-child(even)) {
  background: var(--wmd-bg-secondary);
}

.wmarkdown-preview :deep(tr:hover) {
  background: var(--wmd-primary-50);
  transition: background var(--wmd-transition-fast);
}

.wmarkdown-preview :deep(hr) {
  @apply my-8;
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--wmd-border-default), transparent);
}

.wmarkdown-preview :deep(.task-list-item) {
  @apply list-none relative pl-6;
}

.wmarkdown-preview :deep(.task-list-item input[type="checkbox"]) {
  @apply absolute left-0 top-1 w-4 h-4 cursor-pointer;
  accent-color: var(--wmd-primary-500);
}

.wmarkdown-preview :deep(img) {
  @apply max-w-full h-auto rounded-xl my-6;
  box-shadow: var(--wmd-shadow-lg);
  border: 1px solid var(--wmd-border-light);
  transition: transform var(--wmd-transition-base), box-shadow var(--wmd-transition-base);
}

.wmarkdown-preview :deep(img:hover) {
  transform: scale(1.01);
  box-shadow: var(--wmd-shadow-xl);
}

.wmarkdown-preview :deep(mark) {
  @apply px-1.5 py-0.5 rounded;
  background: var(--wmd-warning-200);
  color: var(--wmd-warning-800);
}

.wmarkdown-preview :deep(details) {
  @apply border rounded-xl p-4 mb-4;
  border-color: var(--wmd-border-light);
  background: var(--wmd-bg-secondary);
}

.wmarkdown-preview :deep(summary) {
  @apply font-semibold cursor-pointer flex items-center gap-2;
  color: var(--wmd-text-primary);
  transition: color var(--wmd-transition-fast);
}

.wmarkdown-preview :deep(summary:hover) {
  color: var(--wmd-primary-600);
}

.wmarkdown-preview :deep(summary::marker) {
  display: none;
}

/* Dark mode adjustments */
[data-theme="dark"] .wmarkdown-preview :deep(h1),
[data-theme="dark"] .wmarkdown-preview :deep(h2),
[data-theme="dark"] .wmarkdown-preview :deep(h3) {
  color: var(--wmd-text-primary);
  border-color: var(--wmd-border-default);
}

[data-theme="dark"] .wmarkdown-preview :deep(p),
[data-theme="dark"] .wmarkdown-preview :deep(li),
[data-theme="dark"] .wmarkdown-preview :deep(blockquote) {
  color: var(--wmd-text-secondary);
}

[data-theme="dark"] .wmarkdown-preview :deep(pre) {
  background: var(--wmd-gray-800);
  border-color: var(--wmd-gray-700);
}

[data-theme="dark"] .wmarkdown-preview :deep(:not(pre) > code) {
  background: var(--wmd-primary-900);
  color: var(--wmd-primary-200);
}

[data-theme="dark"] .wmarkdown-preview :deep(blockquote) {
  background: linear-gradient(to right, rgba(59, 130, 246, 0.1), transparent);
  border-color: var(--wmd-primary-500);
}

[data-theme="dark"] .wmarkdown-preview :deep(th) {
  background: var(--wmd-bg-tertiary);
}

[data-theme="dark"] .wmarkdown-preview :deep(tr:nth-child(even)) {
  background: var(--wmd-bg-tertiary);
}

[data-theme="dark"] .wmarkdown-preview :deep(tr:hover) {
  background: rgba(59, 130, 246, 0.1);
}

[data-theme="dark"] .wmarkdown-preview :deep(img) {
  border-color: var(--wmd-border-default);
}

[data-theme="dark"] .wmarkdown-preview :deep(details) {
  background: var(--wmd-bg-tertiary);
  border-color: var(--wmd-border-default);
}
</style>
