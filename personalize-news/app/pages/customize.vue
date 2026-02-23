<script setup lang="ts">
import { computed } from 'vue'
import type { NewsItem } from '#shared/types/news'

type FeedPreferences = {
  sources: string[]
  tags: string[]
}

const feedPreferences = useState<FeedPreferences>('feedPreferences', () => ({ sources: [], tags: [] }))

const { data } = await useFetch<{ items: NewsItem[] }>('/api/news', {
  query: { category: 'All', range: 'all' },
})

const allItems = computed(() => data.value?.items ?? [])

const availableSources = computed(() => {
  const set = new Set<string>()
  for (const item of allItems.value) set.add(item.source)
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

const availableTags = computed(() => {
  const set = new Set<string>()
  for (const item of allItems.value) {
    for (const t of item.tags) set.add(t)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

function toggleSource(source: string) {
  const next = new Set(feedPreferences.value.sources)
  if (next.has(source)) next.delete(source)
  else next.add(source)
  feedPreferences.value.sources = Array.from(next)
}

function toggleTag(tag: string) {
  const next = new Set(feedPreferences.value.tags)
  if (next.has(tag)) next.delete(tag)
  else next.add(tag)
  feedPreferences.value.tags = Array.from(next)
}

function clearAll() {
  feedPreferences.value = { sources: [], tags: [] }
}
</script>

<template>
  <div class="space-y-6">
    <section class="app-card p-4">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="text-sm text-slate-300">Customize</div>
          <h1 class="text-lg font-semibold">Tune your feed</h1>
        </div>

        <div class="flex items-center gap-2">
          <button class="app-btn-ghost" type="button" @click="clearAll()">
            <span class="i-lucide-rotate-ccw" />
            <span class="ml-2">Reset</span>
          </button>
          <NuxtLink class="app-btn-primary" to="/">
            <span class="i-lucide-check" />
            <span class="ml-2">Done</span>
          </NuxtLink>
        </div>
      </div>

      <div class="mt-4 grid gap-3 md:grid-cols-2">
        <div class="app-card p-3">
          <div class="text-xs text-slate-400">Selected sources</div>
          <div class="mt-2 flex flex-wrap gap-2">
            <span v-if="feedPreferences.sources.length === 0" class="text-sm text-slate-400">All</span>
            <span v-for="s in feedPreferences.sources" :key="s" class="app-chip">{{ s }}</span>
          </div>
        </div>
        <div class="app-card p-3">
          <div class="text-xs text-slate-400">Selected tags</div>
          <div class="mt-2 flex flex-wrap gap-2">
            <span v-if="feedPreferences.tags.length === 0" class="text-sm text-slate-400">All</span>
            <span v-for="t in feedPreferences.tags" :key="t" class="app-chip">{{ t }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <div class="app-card p-4">
        <div class="flex items-center gap-2">
          <span class="i-lucide-newspaper" />
          <div class="text-sm font-semibold">Sources</div>
        </div>

        <div class="mt-3 grid gap-2 sm:grid-cols-2">
          <button
            v-for="s in availableSources"
            :key="s"
            class="rounded-lg border border-white/10 px-3 py-2 text-left text-sm transition-colors"
            :class="feedPreferences.sources.includes(s) ? 'bg-white/10 text-white' : 'bg-white/5 text-slate-200 hover:bg-white/8'"
            type="button"
            @click="toggleSource(s)"
          >
            {{ s }}
          </button>
        </div>
      </div>

      <div class="app-card p-4">
        <div class="flex items-center gap-2">
          <span class="i-lucide-hash" />
          <div class="text-sm font-semibold">Topics</div>
        </div>

        <div class="mt-3 grid gap-2 sm:grid-cols-2">
          <button
            v-for="t in availableTags"
            :key="t"
            class="rounded-lg border border-white/10 px-3 py-2 text-left text-sm transition-colors"
            :class="feedPreferences.tags.includes(t) ? 'bg-white/10 text-white' : 'bg-white/5 text-slate-200 hover:bg-white/8'"
            type="button"
            @click="toggleTag(t)"
          >
            {{ t }}
          </button>
        </div>
      </div>
    </section>

    <section class="app-card p-4">
      <div class="text-xs text-slate-400">Tip</div>
      <div class="mt-1 text-sm text-slate-200">
        Your selections are applied immediately to the feed and all categories.
      </div>
    </section>
  </div>
</template>
