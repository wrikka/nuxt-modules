<script setup lang="ts">
interface Props {
  readingTime?: number;
  wordCount?: number;
  createdAt?: string;
  updatedAt?: string;
  separator?: string;
}

const props = withDefaults(defineProps<Props>(), {
  separator: "•",
});

const displayItems = computed(() => {
  const items = [];
  
  if (props.createdAt) {
    items.push(formatDate(props.createdAt));
  }
  
  if (props.readingTime) {
    items.push(`${props.readingTime} min read`);
  }
  
  if (props.wordCount) {
    items.push(`${props.wordCount.toLocaleString()} words`);
  }
  
  return items;
});

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
</script>

<template>
  <div v-if="displayItems.length" class="content-meta">
    <span
      v-for="(item, index) in displayItems"
      :key="index"
      class="meta-item"
    >
      <span v-if="index > 0" class="separator">{{ separator }}</span>
      {{ item }}
    </span>
  </div>
</template>

<style scoped>
.content-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.separator {
  opacity: 0.5;
}
</style>
