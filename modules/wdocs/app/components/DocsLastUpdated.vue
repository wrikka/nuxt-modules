<script setup lang="ts">
const props = defineProps<{
  date?: string
  format?: string
}>()

const formattedDate = computed(() => {
  if (!props.date) return ''
  const d = new Date(props.date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>

<template>
  <div v-if="date" class="docs-last-updated">
    Last updated: {{ formattedDate }}
  </div>
</template>
