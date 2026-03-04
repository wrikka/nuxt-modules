<script setup lang="ts">
import type { NavItem } from '../types'

const colorMode = useColorMode()
const { data: navigation } = await useAsyncData('navigation', () => {
  return queryCollection('navigation').all()
})

const searchOpen = ref(false)
const mobileMenuOpen = ref(false)

const socialLinks = [
  { icon: 'lucide:github', href: 'https://github.com', label: 'GitHub' },
  { icon: 'lucide:twitter', href: 'https://twitter.com', label: 'Twitter' }
]
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-4">
          <button class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" @click="mobileMenuOpen = !mobileMenuOpen">
            <Icon name="lucide:menu" class="w-5 h-5" />
          </button>
          <NuxtLink to="/" class="flex items-center gap-2 font-semibold text-lg">
            <Icon name="lucide:book-open" class="w-6 h-6 text-blue-600" />
            <span>WDocs</span>
          </NuxtLink>
        </div>

        <div class="hidden md:flex items-center gap-4">
          <button class="docs-search w-64" @click="searchOpen = true">
            <div class="docs-search-input py-1.5 text-sm cursor-pointer flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon name="lucide:search" class="w-4 h-4 text-gray-400" />
                <span class="text-gray-400">Search...</span>
              </div>
              <span class="docs-kbd">⌘ K</span>
            </div>
          </button>

          <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" @click="colorMode.toggle()">
            <Icon :name="colorMode.value === 'dark' ? 'lucide:sun' : 'lucide:moon'" class="w-5 h-5" />
          </button>

          <div class="docs-social">
            <a v-for="link in socialLinks" :key="link.label" :href="link.href" target="_blank" rel="noopener" class="docs-social-link" :aria-label="link.label">
              <Icon :name="link.icon" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <div class="flex md:hidden items-center gap-2">
          <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" @click="searchOpen = true">
            <Icon name="lucide:search" class="w-5 h-5" />
          </button>
          <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" @click="colorMode.toggle()">
            <Icon :name="colorMode.value === 'dark' ? 'lucide:sun' : 'lucide:moon'" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <DocsSearch v-model="searchOpen" />
  </header>
</template>
