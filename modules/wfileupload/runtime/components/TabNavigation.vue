<template>
  <div class="flex border-b border-gray-200 mb-6">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="$emit('tabChange', tab.id)"
      :class="[
        'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
        activeTab === tab.id
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      ]"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  tabs: { id: string; label: string }[]
  activeTab: string
}>()

const emit = defineEmits<{
  tabChange: [tabId: string]
}>()
</script>
