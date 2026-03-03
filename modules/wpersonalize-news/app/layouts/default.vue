<script setup lang="ts">
import CategoryTabs from '~/components/CategoryTabs.vue'
import RangeTabs from '~/components/RangeTabs.vue'
import TopNav from '~/components/TopNav.vue'
</script>

<template>
  <div class="app-shell">
    <header class="sticky top-0 z-50 border-b border-white/10 bg-[#0B1220]/80 backdrop-blur">
      <div class="app-container py-3">
        <TopNav />
      </div>
      <div class="app-container pb-3">
        <CategoryTabs title="News" />
        <div class="mt-2">
          <RangeTabs />
        </div>
      </div>
    </header>

    <main class="app-container py-6">
      <slot />
    </main>
  </div>
</template>
