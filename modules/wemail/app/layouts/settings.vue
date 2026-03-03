<script setup lang="ts">
const route = useRoute()

const menu = [
  {
    label: 'General',
    to: '/settings',
  },
  {
    label: 'Labels',
    to: '/settings/labels',
  },
  {
    label: 'Rules',
    to: '/settings/rules',
  }
]
</script>

<template>
  <div class="h-screen w-screen flex flex-col bg-slate-50 dark:bg-black text-slate-800 dark:text-slate-200 font-sans">
    <div class="max-w-screen-2xl mx-auto flex-1 flex flex-col w-full bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden relative">
      <AppHeader />
      <div class="flex flex-1 overflow-hidden">
        <AppSidebar />
        <main class="flex-1 overflow-y-auto p-6">
          <h1 class="text-2xl font-bold mb-6">Settings</h1>
          <nav class="border-b border-gray-200 dark:border-gray-800 mb-6">
            <ul class="flex items-center gap-x-8">
              <li v-for="item in menu" :key="item.to">
                <NuxtLink
                  :to="item.to"
                  class="pb-3 border-b-2 transition-colors"
                  :class="[route.path === item.to ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200']"
                >
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </nav>
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
