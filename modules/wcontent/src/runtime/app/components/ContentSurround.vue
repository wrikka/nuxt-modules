<script setup lang="ts">
import type { ParsedContent } from "../../shared/types/collection";

interface Props {
  collection: string;
  path: string;
}

const props = defineProps<Props>();

const { data: surround, pending } = useAsyncData(
  () => queryContent(props.collection).findSurround(props.path),
  { watch: [() => props.path] }
);
</script>

<template>
  <nav v-if="surround && (surround.prev || surround.next)" class="content-surround">
    <NuxtLink
      v-if="surround.prev"
      :to="surround.prev._path"
      class="surround-link prev"
    >
      <span class="surround-label">← Previous</span>
      <span class="surround-title">{{ surround.prev.title }}</span>
    </NuxtLink>
    
    <div v-else class="surround-placeholder" />
    
    <NuxtLink
      v-if="surround.next"
      :to="surround.next._path"
      class="surround-link next"
    >
      <span class="surround-label">Next →</span>
      <span class="surround-title">{{ surround.next.title }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.content-surround {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 2rem 0;
  border-top: 1px solid var(--color-border);
  margin-top: 2rem;
}

.surround-link {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: var(--color-text);
  transition: background-color 0.2s;
  flex: 1;
}

.surround-link:hover {
  background-color: var(--color-bg-hover);
}

.surround-link.next {
  text-align: right;
  align-items: flex-end;
}

.surround-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 0.25rem;
}

.surround-title {
  font-weight: 500;
}

.surround-placeholder {
  flex: 1;
}
</style>
