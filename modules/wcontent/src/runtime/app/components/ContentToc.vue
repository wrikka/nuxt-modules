<script setup lang="ts">
import type { TocItem } from "../../server/utils/markdown";

interface Props {
  items: TocItem[];
}

defineProps<Props>();
</script>

<template>
  <nav class="toc" aria-label="Table of contents">
    <ul class="toc-list">
      <li v-for="item in items" :key="item.id" class="toc-item" :class="`toc-level-${item.level}`">
        <a :href="`#${item.id}`" class="toc-link">{{ item.text }}</a>
        <TableOfContents v-if="item.children?.length" :items="item.children" />
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.toc {
  padding: 1rem;
  border-left: 2px solid var(--color-border);
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin: 0.25rem 0;
}

.toc-link {
  display: block;
  padding: 0.25rem 0;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.toc-link:hover {
  color: var(--color-primary);
}

.toc-level-1 { padding-left: 0; }
.toc-level-2 { padding-left: 1rem; }
.toc-level-3 { padding-left: 2rem; }
.toc-level-4 { padding-left: 3rem; }
.toc-level-5 { padding-left: 4rem; }
.toc-level-6 { padding-left: 5rem; }
</style>
