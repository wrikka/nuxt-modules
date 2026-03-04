<script setup lang="ts">
import type { ParsedContent } from "../../shared/types/collection";

interface Props {
  collection: string;
  path?: string;
  sort?: string;
  order?: "asc" | "desc";
  limit?: number;
  skip?: number;
  where?: Record<string, any>;
  emptyText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  order: "desc",
  emptyText: "No items found",
});

const builder = queryContent(props.collection);

// Apply filters
if (props.path) {
  builder.where("_path", "$startsWith", props.path);
}

if (props.where) {
  builder.where(props.where);
}

if (props.sort) {
  builder.sort(props.sort, props.order);
}

if (props.skip) {
  builder.skip(props.skip);
}

if (props.limit) {
  builder.limit(props.limit);
}

const { data: items, pending } = useAsyncData(
  `${props.collection}-list-${props.path || "all"}`,
  () => builder.find()
);
</script>

<template>
  <div class="content-list">
    <div v-if="pending" class="list-loading">
      <slot name="loading">
        <ContentLoading />
      </slot>
    </div>

    <div v-else-if="items?.length" class="list-items">
      <slot
        v-for="item in items"
        :key="item._path"
        name="item"
        :item="item"
      >
        <article class="list-item">
          <NuxtLink :to="item._path" class="item-link">
            <h3 class="item-title">{{ item.title || item._path }}</h3>
            <p v-if="item.description" class="item-description">
              {{ item.description }}
            </p>
            <ContentMeta
              :reading-time="item.readingTime"
              :word-count="item.wordCount"
              :created-at="item.createdAt"
            />
          </NuxtLink>
        </article>
      </slot>
    </div>

    <div v-else class="list-empty">
      <slot name="empty">{{ emptyText }}</slot>
    </div>
  </div>
</template>

<style scoped>
.content-list {
  width: 100%;
}

.list-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.list-item {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1rem;
}

.item-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.item-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.item-link:hover .item-title {
  color: var(--color-primary);
}

.item-description {
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.list-empty {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
}
</style>
