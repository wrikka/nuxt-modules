<script setup lang="ts">
import { computed, ref } from 'vue'
import NewsGroupedByDate from '~/components/NewsGroupedByDate.vue'
import type { NewsCategory, NewsItem } from '#shared/types/news'

type FeedPreferences = {
  sources: string[]
  tags: string[]
}

const category = useState<NewsCategory>('category', () => 'All')

const newsQuery = useState<string>('newsQuery', () => '')

const route = useRoute()
const feedPreferences = useState<FeedPreferences>('feedPreferences', () => ({ sources: [], tags: [] }))

const fetchQuery = computed(() => ({
  category: category.value,
  q: newsQuery.value,
  range: route.query.range,
  sources: feedPreferences.value.sources.join(','),
  tags: feedPreferences.value.tags.join(','),
}))

const { data, refresh } = await useFetch<{ items: NewsItem[] }>('/api/news', {
  query: fetchQuery,
})

const items = computed(() => data.value?.items ?? [])

const bookmarked = ref(new Set<string>())

function toggleBookmark(id: string) {
  if (bookmarked.value.has(id)) bookmarked.value.delete(id)
  else bookmarked.value.add(id)
}
</script>

<template>
  <div class="space-y-6">
    <section class="app-card p-4">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div class="text-sm text-slate-300">Your feed</div>
          <h1 class="text-lg font-semibold">Personalized News</h1>
        </div>

        <div class="flex items-center gap-2">
          <button class="app-btn-ghost" type="button" @click="refresh()">
            <span class="i-lucide-refresh-cw" />
            <span class="ml-2 hidden sm:inline">Refresh</span>
          </button>
          <button class="app-btn-primary" type="button">
            <span class="i-lucide-sliders-horizontal" />
            <span class="ml-2">Tune</span>
          </button>
        </div>
      </div>

      <div class="mt-4 grid gap-3 md:grid-cols-2">
        <div class="app-card p-3">
          <div class="text-xs text-slate-400">Topics</div>
          <div class="mt-1 text-sm">Politics, Tech, Business</div>
        </div>
        <div class="app-card p-3">
          <div class="text-xs text-slate-400">Sources</div>
          <div class="mt-1 text-sm">Reuters, AP, The Verge</div>
        </div>
      </div>
    </section>

    <section>
      <NewsGroupedByDate :items="items" @toggle-bookmark="toggleBookmark" />
    </section>
  </div>
</template>
