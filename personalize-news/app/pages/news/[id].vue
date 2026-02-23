<script setup lang="ts">
import type { NewsItem } from '#shared/types/news'

type NewsSource = {
  title: string
  source: string
  url: string
}

type NewsAiSummary = {
  summary: string
  keyPoints: string[]
  sources: NewsSource[]
}

type NewsDetailResponse = {
  item: NewsItem
  ai: NewsAiSummary
}

const route = useRoute()

const id = computed(() => String(route.params.id ?? ''))

const { data } = await useFetch<NewsDetailResponse>(() => `/api/news/${id.value}`)

const item = computed(() => data.value?.item)
const ai = computed(() => data.value?.ai)
</script>

<template>
  <div class="space-y-6">
    <section v-if="item" class="app-card overflow-hidden">
      <div class="relative aspect-[21/9] w-full overflow-hidden bg-white/5">
        <img
          class="h-full w-full object-cover"
          :src="item.imageUrl"
          :alt="item.title"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div class="absolute bottom-4 left-4 right-4 space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <span class="app-chip">{{ item.category }}</span>
            <span class="app-chip">{{ item.publishedAtLabel }}</span>
            <span class="app-chip">{{ item.source }}</span>
          </div>
          <h1 class="text-xl font-semibold leading-tight sm:text-2xl">
            {{ item.title }}
          </h1>
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div class="space-y-4">
        <div class="app-card p-4">
          <div class="flex items-center gap-2">
            <span class="i-lucide-sparkles" />
            <div class="text-sm font-semibold">AI Summary</div>
          </div>

          <div v-if="ai" class="mt-3 space-y-3">
            <p class="text-sm leading-6 text-slate-200">
              {{ ai.summary }}
            </p>

            <div class="space-y-2">
              <div class="text-xs font-medium text-slate-400">Key points</div>
              <ul class="space-y-2">
                <li v-for="(p, idx) in ai.keyPoints" :key="idx" class="app-card bg-white/5 p-3">
                  <div class="text-sm text-slate-200">{{ p }}</div>
                </li>
              </ul>
            </div>
          </div>

          <div v-else class="mt-3 text-sm text-slate-400">
            Loading summary...
          </div>
        </div>

        <div v-if="item" class="app-card p-4">
          <div class="flex flex-wrap items-center gap-2">
            <span v-for="t in item.tags" :key="t" class="app-chip">{{ t }}</span>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <NuxtLink class="app-btn-ghost" to="/">
              <span class="i-lucide-arrow-left" />
              <span class="ml-2">Back</span>
            </NuxtLink>

            <a class="app-btn-primary" :href="item.url" target="_blank" rel="noreferrer">
              <span class="i-lucide-external-link" />
              <span class="ml-2">Read original</span>
            </a>
          </div>
        </div>
      </div>

      <aside class="space-y-4">
        <div class="app-card p-4">
          <div class="flex items-center gap-2">
            <span class="i-lucide-layers" />
            <div class="text-sm font-semibold">Sources</div>
          </div>

          <div v-if="ai" class="mt-3 space-y-2">
            <a
              v-for="s in ai.sources"
              :key="s.url"
              class="block rounded-lg border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/8"
              :href="s.url"
              target="_blank"
              rel="noreferrer"
            >
              <div class="text-xs text-slate-400">{{ s.source }}</div>
              <div class="mt-1 line-clamp-2 text-sm text-slate-100">{{ s.title }}</div>
              <div class="mt-2 flex items-center gap-2 text-xs text-slate-400">
                <span class="truncate">{{ s.url }}</span>
                <span class="ml-auto i-lucide-arrow-up-right" />
              </div>
            </a>
          </div>

          <div v-else class="mt-3 text-sm text-slate-400">
            Loading sources...
          </div>
        </div>
      </aside>
    </section>
  </div>
</template>
