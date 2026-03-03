<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

const route = useRoute()

type RangeKey = 'today' | '7d' | 'all'

const ranges: { key: RangeKey; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7D' },
  { key: 'all', label: 'All' },
]

const activeRange = computed<RangeKey>(() => {
  const r = String(route.query.range ?? 'all')
  if (r === 'today' || r === '7d' || r === 'all') return r
  return 'all'
})

function hrefFor(range: RangeKey): RouteLocationRaw {
  const basePath = route.path
  const query = { ...route.query, range }

  if (range === 'all') {
    delete (query as Record<string, unknown>).range
  }

  return { path: basePath, query }
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <NuxtLink
      v-for="r in ranges"
      :key="r.key"
      :to="hrefFor(r.key)"
      class="rounded-md px-3 py-1.5 text-sm transition-colors"
      :class="r.key === activeRange ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/8'"
    >
      {{ r.label }}
    </NuxtLink>
  </div>
</template>
