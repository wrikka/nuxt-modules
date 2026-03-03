<script setup lang="ts">
const route = useRoute()

function categoryTo(c: string) {
  const path = c === 'All' ? '/' : `/${c.toLowerCase()}`
  return { path, query: route.query }
}

const currentCategory = computed(() => {
  const path = route.path
  if (path === '/') return 'All'
  return path.slice(1).charAt(0).toUpperCase() + path.slice(2)
})

withDefaults(
  defineProps<{
    title?: string
    categories?: string[]
  }>(),
  {
    title: 'Top News',
    categories: () => [
      'All',
      'Breaking',
      'Politics',
      'Sports',
      'Tech',
      'Business',
      'World',
      'Science',
      'Geopolitic',
      'Startup',
      'Agriculture',
      'Entertainment',
      'Cybersecurity',
      'Healthcare',
      'Education',
      'Supply Chain',
      'Regulation',
      'Economy',
      'Local',
    ],
  },
)
</script>

<template>
  <div class="flex flex-col gap-3 md:flex-row md:items-center">
    <div class="text-xl font-semibold">{{ title }}</div>

    <div class="flex flex-wrap items-center gap-2">
      <NuxtLink
        v-for="c in categories"
        :key="c"
        :to="categoryTo(c)"
        class="rounded-md px-3 py-1.5 text-sm transition-colors"
        :class="c === currentCategory ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/8'"
      >
        {{ c }}
      </NuxtLink>
    </div>

    <div class="ml-auto hidden items-center gap-2 md:flex">
      <button class="app-btn-ghost" aria-label="Search">
        <span class="i-lucide-search" />
      </button>
      <button class="app-btn-ghost" aria-label="Bookmarks">
        <span class="i-lucide-bookmark" />
      </button>
    </div>
  </div>
</template>
