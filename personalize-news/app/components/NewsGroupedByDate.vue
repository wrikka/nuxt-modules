<script setup lang="ts">
import { computed } from 'vue'
import NewsCard from '~/components/NewsCard.vue'
import type { NewsItem } from '#shared/types/news'

const props = defineProps<{
  items: NewsItem[]
}>()

const groupedItems = computed(() => {
  const groups: Record<string, NewsItem[]> = {}

  for (const item of props.items) {
    const date = item.publishedAtLabel
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(item)
  }

  return Object.entries(groups).sort(([a], [b]) => {
    return new Date(b).getTime() - new Date(a).getTime()
  })
})
</script>

<template>
  <div class="space-y-6">
    <div v-for="[date, items] in groupedItems" :key="date" class="space-y-3">
      <div class="flex items-center gap-2">
        <div class="h-px flex-1 bg-white/10" />
        <div class="px-3 text-sm font-medium text-slate-300">
          {{ date }}
        </div>
        <div class="h-px flex-1 bg-white/10" />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <NewsCard
          v-for="item in items"
          :key="item.id"
          :item="item"
          @toggle-bookmark="$emit('toggle-bookmark', $event)"
        />
      </div>
    </div>
  </div>
</template>
