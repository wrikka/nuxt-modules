<script setup lang="ts">
import { computed, ref } from "vue";
import type { ParsedContent } from "../../shared/types/collection";

interface Props {
  content?: ParsedContent;
  path?: string;
  collection?: string;
  excerpt?: boolean;
  tag?: string;
}

const props = withDefaults(defineProps<Props>(), {
  tag: "article",
  excerpt: false,
});

const { data: resolvedContent, pending } = useAsyncData(
  () => {
    if (props.content) return Promise.resolve(props.content);
    if (props.path && props.collection) {
      return queryContent(props.collection).where("_path", props.path).findOne();
    }
    return Promise.resolve(null);
  },
  { watch: [() => props.content, () => props.path] }
);

const body = computed(() => {
  if (!resolvedContent.value) return "";
  if (props.excerpt && resolvedContent.value.excerpt) {
    return resolvedContent.value.excerpt;
  }
  return resolvedContent.value.body || "";
});

const meta = computed(() => {
  if (!resolvedContent.value) return null;
  return {
    title: resolvedContent.value.title,
    description: resolvedContent.value.description,
    readingTime: resolvedContent.value.readingTime,
    wordCount: resolvedContent.value.wordCount,
    createdAt: resolvedContent.value.createdAt,
    updatedAt: resolvedContent.value.updatedAt,
  };
});
</script>

<template>
  <component :is="tag" v-if="resolvedContent" class="content-doc">
    <header v-if="meta?.title || $slots.header" class="content-header">
      <slot name="header" :content="resolvedContent" :meta="meta">
        <h1 v-if="meta?.title">{{ meta.title }}</h1>
        <p v-if="meta?.description" class="description">{{ meta.description }}</p>
        <div v-if="meta?.createdAt || meta?.readingTime" class="meta">
          <time v-if="meta?.createdAt">{{ formatDate(meta.createdAt) }}</time>
          <span v-if="meta?.readingTime">{{ meta.readingTime }} min read</span>
        </div>
      </slot>
    </header>

    <div class="content-body" v-html="body" />

    <footer v-if="$slots.footer" class="content-footer">
      <slot name="footer" :content="resolvedContent" :surround="surround" />
    </footer>
  </component>

  <div v-else-if="pending" class="content-loading">
    <slot name="loading">
      <ContentLoading />
    </slot>
  </div>

  <div v-else class="content-error">
    <slot name="error">
      <ContentError message="Content not found" />
    </slot>
  </div>
</template>

<style scoped>
.content-doc {
  max-width: 65ch;
  margin: 0 auto;
}

.content-header {
  margin-bottom: 2rem;
}

.content-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.description {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}

.meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.content-body :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem;
}

.content-body :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
}

.content-body :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.7;
}

.content-body :deep(pre) {
  background: var(--color-bg-code);
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.content-body :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.875rem;
}

.content-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
}
</style>
