<script setup lang="ts">
const links = [
  { name: 'GitHub', href: 'https://github.com/wrikka/wdocs', icon: 'lucide:github' },
  { name: 'Twitter', href: 'https://twitter.com/wrikka', icon: 'lucide:twitter' }
]
</script>

<template>
  <footer class="docs-footer border-t border-gray-200 dark:border-gray-800 py-8 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          © {{ new Date().getFullYear() }} WDocs. Built with Nuxt & WUI.
        </p>
        <div class="flex items-center gap-4">
          <a
            v-for="link in links"
            :key="link.name"
            :href="link.href"
            target="_blank"
            rel="noopener"
            class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <Icon :name="link.icon" class="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
