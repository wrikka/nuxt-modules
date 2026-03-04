<script setup lang="ts">
interface Props {
  text: string
  query: string
  highlightClass?: string
}

withDefaults(defineProps<Props>(), {
  highlightClass: 'bg-yellow-200'
})

const getHighlightedText = (text: string, query: string) => {
  if (!query) return [{ text, isHighlight: false }]
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  const parts = text.split(regex)
  const queryLower = query.toLowerCase()
  return parts.map(part => ({
    text: part,
    isHighlight: part.toLowerCase() === queryLower
  }))
}
</script>

<template>
  <span>
    <template v-for="(part, index) in getHighlightedText(text, query)" :key="index">
      <mark v-if="part.isHighlight" :class="highlightClass">{{ part.text }}</mark>
      <template v-else>{{ part.text }}</template>
    </template>
  </span>
</template>
