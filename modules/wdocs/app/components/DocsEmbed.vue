<script setup lang="ts">
const props = defineProps<{
  url: string
  type: 'youtube' | 'codesandbox' | 'codepen' | 'stackblitz'
}>()

const embedUrl = computed(() => {
  if (props.type === 'youtube') {
    const id = props.url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1]
    return `https://www.youtube.com/embed/${id}`
  }
  return props.url
})
</script>

<template>
  <div class="docs-embed" :class="{ 'docs-embed-youtube': type === 'youtube' }">
    <iframe
      :src="embedUrl"
      class="w-full h-full"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
</template>
