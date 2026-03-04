<script setup lang="ts">
const props = defineProps<{
  editLink?: {
    pattern: string
    text?: string
  }
}>()

const route = useRoute()

const editUrl = computed(() => {
  if (!props.editLink?.pattern) return null
  return props.editLink.pattern.replace(':path', route.path.slice(1) + '.md')
})
</script>

<template>
  <a v-if="editUrl" :href="editUrl" target="_blank" rel="noopener" class="docs-edit-link">
    <Icon name="lucide:edit-3" class="w-4 h-4" />
    <span>{{ editLink?.text || 'Edit this page' }}</span>
  </a>
</template>
