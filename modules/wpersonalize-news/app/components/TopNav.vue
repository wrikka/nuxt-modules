<script setup lang="ts">
const query = useState<string>('newsQuery', () => '')
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="flex items-center gap-2">
      <div class="h-6 w-6 rounded-md bg-white/10" />
      <div class="text-sm font-semibold tracking-tight">Personalize News</div>
    </div>

    <div class="flex-1">
      <div class="relative">
        <span class="i-lucide-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          v-model="query"
          class="app-input pl-9"
          placeholder="Search news"
          type="search"
        />
      </div>
    </div>

    <nav class="hidden items-center gap-2 md:flex">
      <NuxtLink class="app-btn-ghost" to="/customize">Customize</NuxtLink>
      <button class="app-btn-ghost">Log in</button>
      <button class="app-btn-primary">Sign up</button>
    </nav>

    <button class="app-btn-ghost md:hidden" aria-label="Open menu">
      <span class="i-lucide-menu" />
    </button>
  </div>
</template>
