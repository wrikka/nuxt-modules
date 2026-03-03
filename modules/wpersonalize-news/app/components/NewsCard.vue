<script setup lang="ts">
import type { NewsItem } from '#shared/types/news'

defineProps<{
  item: NewsItem
}>()

const emit = defineEmits<{
  toggleBookmark: [id: string]
}>()
</script>

<template>
  <article class="app-card overflow-hidden">
    <NuxtLink class="block" :to="`/news/${item.id}`">
      <div class="relative aspect-[16/9] w-full overflow-hidden bg-white/5">
        <img
          class="h-full w-full object-cover"
          :src="item.imageUrl"
          :alt="item.title"
          loading="lazy"
        />
        <div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
        <div class="absolute left-3 top-3 flex items-center gap-2">
          <span class="app-chip">{{ item.category }}</span>
          <span class="app-chip">{{ item.publishedAtLabel }}</span>
        </div>
      </div>

      <div class="p-4">
        <h3 class="line-clamp-2 text-sm font-semibold leading-5">
          {{ item.title }}
        </h3>

        <div class="mt-2 flex items-center gap-2 text-xs text-slate-300">
          <span class="truncate">{{ item.source }}</span>
          <span class="text-slate-500">•</span>
          <span class="truncate">{{ item.publishedAtLabel }}</span>
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
          <span v-for="t in item.tags" :key="t" class="app-chip">{{ t }}</span>
        </div>
      </div>
    </NuxtLink>

    <div class="flex items-center justify-between gap-3 border-t border-white/10 p-3">
      <button class="app-btn-ghost" type="button" @click.stop="emit('toggleBookmark', item.id)">
        <span class="i-lucide-bookmark" />
      </button>

      <a class="app-btn-ghost" :href="item.url" target="_blank" rel="noreferrer">
        <span class="i-lucide-external-link" />
      </a>
    </div>
  </article>
</template>
