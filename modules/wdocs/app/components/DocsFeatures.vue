<script setup lang="ts">
const props = defineProps<{
  features?: Array<{
    icon?: string
    title: string
    description: string
  }>
}>()

const defaultFeatures = [
  {
    icon: 'lucide:zap',
    title: 'Fast',
    description: 'Lightning fast static site generation'
  },
  {
    icon: 'lucide:search',
    title: 'Search',
    description: 'Full-text search built-in'
  },
  {
    icon: 'lucide:palette',
    title: 'Themable',
    description: 'Customize to match your brand'
  }
]

const displayFeatures = computed(() => props.features || defaultFeatures)
</script>

<template>
  <div class="docs-feature-grid">
    <div v-for="(feature, index) in displayFeatures" :key="index" class="docs-feature-card">
      <div class="docs-feature-icon">
        <Icon :name="feature.icon || 'lucide:star'" class="w-6 h-6" />
      </div>
      <h3 class="docs-feature-title">{{ feature.title }}</h3>
      <p class="docs-feature-desc">{{ feature.description }}</p>
    </div>
  </div>
</template>
