<script setup lang="ts">
const sidebarStore = useSidebarStore()
const colorMode = useColorMode()
const searchStore = useSearchStore()
const { searchQuery } = storeToRefs(searchStore)
const localSearchQuery = ref(searchQuery.value)

watchDebounced(
  localSearchQuery,
  () => {
    searchStore.searchQuery = localSearchQuery.value
  },
  { debounce: 300, maxWait: 1000 },
)
</script>

<template>
  <header class="h-16 border-b border-slate-200 dark:border-zinc-800 flex-shrink-0 flex items-center justify-between px-4 gap-4">
    <div class="flex items-center gap-2">
      <button class="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 md:hidden" @click="sidebarStore.toggleSidebar">
        <Icon name="mdi:menu" class="text-2xl" />
      </button>
      <div class="flex items-center gap-2">
        <img src="/gmail.svg" alt="Gmail Logo" class="w-7 h-7" />
        <span class="text-xl font-medium text-slate-700 dark:text-slate-200">GMail</span>
      </div>
    </div>
    <div class="flex-1 max-w-3xl">
      <div class="relative group">
        <Icon name="mdi:magnify" class="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-500 dark:text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
        <input v-model="localSearchQuery" type="text" placeholder="Search mail" class="w-full bg-slate-100 dark:bg-zinc-800 rounded-full py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow duration-200 group-hover:shadow-md" />
      </div>
    </div>
    <div class="flex items-center gap-2">
      <button
        class="p-2 rounded-full text-2xl hover:bg-slate-200 dark:hover:bg-zinc-800"
        @click="colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'"
      >
        <Icon :name="colorMode.value === 'dark' ? 'mdi:weather-night' : 'mdi:white-balance-sunny'" />
      </button>
      <button class="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800">
        <Icon name="mdi:help-circle-outline" class="text-2xl" />
      </button>
      <button class="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800">
        <Icon name="mdi:cog-outline" class="text-2xl" />
      </button>
      <button class="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800">
        <Icon name="mdi:apps" class="text-2xl" />
      </button>
    </div>
  </header>
</template>
