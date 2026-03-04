<script setup lang="ts">
const route = useRoute()
const { data: navigation } = await useAsyncData('navigation', () => {
  return queryCollection('navigation').all()
})

const currentPath = computed(() => route.path)

function isActive(path: string): boolean {
  return currentPath.value === path || currentPath.value.startsWith(path + '/')
}
</script>

<template>
  <aside class="fixed left-0 top-16 bottom-0 w-64 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto hidden lg:block">
    <nav class="p-4 space-y-1">
      <template v-for="item in navigation" :key="item.path">
        <NuxtLink
          :to="item.path"
          class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="isActive(item.path) ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'"
        >
          {{ item.title }}
        </NuxtLink>
      </template>
    </nav>
  </aside>
</template>
