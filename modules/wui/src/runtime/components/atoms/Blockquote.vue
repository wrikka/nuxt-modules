<script setup lang="ts">
interface Props {
  cite?: string
  author?: string
  source?: string
}

defineProps<Props>()
</script>

<template>
  <figure class="my-4 border-l-4 border-gray-300 pl-4">
    <blockquote :cite="cite" class="text-lg italic text-gray-700">
      <slot />
    </blockquote>
    <figcaption v-if="author || source" class="mt-2 text-sm text-gray-500">
      <span v-if="author">— {{ author }}</span>
      <cite v-if="source" class="ml-1 not-italic">{{ source }}</cite>
    </figcaption>
  </figure>
</template>
