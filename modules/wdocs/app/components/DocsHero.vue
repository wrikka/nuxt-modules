<script setup lang="ts">
const props = defineProps<{
  title?: string
  description?: string
  actions?: Array<{
    text: string
    link?: string
    variant?: 'primary' | 'secondary'
  }>
}>()
</script>

<template>
  <section class="docs-hero">
    <div class="docs-hero-content">
      <h1 class="docs-hero-title">{{ title || 'WDocs' }}</h1>
      <p class="docs-hero-description">{{ description || 'Documentation made simple' }}</p>
      <div v-if="actions" class="docs-hero-actions">
        <NuxtLink
          v-for="(action, index) in actions"
          :key="index"
          :to="action.link || '#" class="px-6 py-3 rounded-lg font-medium transition-colors"
          :class="action.variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'"
        >
          {{ action.text }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
