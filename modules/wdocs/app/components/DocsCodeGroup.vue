<script setup lang="ts">
const props = defineProps<{
  tabs: Array<{
    label: string
    language?: string
  }>
}>()

const activeTab = ref(0)
</script>

<template>
  <div class="docs-code-group">
    <div class="docs-code-tabs">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        class="docs-code-tab"
        :class="{ 'docs-code-tab-active': activeTab === index }"
        @click="activeTab = index"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="docs-code-content">
      <slot :active="activeTab" />
    </div>
  </div>
</template>
