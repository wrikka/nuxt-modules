<script setup lang="ts">
import NewsCard from '~/components/NewsCard.vue'
import type { NewsItem } from '#shared/types/news'

defineProps<{
  items: NewsItem[]
}>()

const emit = defineEmits<{
  toggleBookmark: [id: string]
}>()
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <NewsCard
      v-for="n in items"
      :key="n.id"
      :item="n"
      @toggle-bookmark="(id) => emit('toggleBookmark', id)"
    />
  </div>
</template>
