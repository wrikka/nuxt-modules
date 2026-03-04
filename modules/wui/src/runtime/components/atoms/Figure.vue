<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  caption?: string
  width?: number | string
  height?: number | string
}

defineProps<Props>()
</script>

<template>
  <figure class="my-4">
    <img
      :src="src"
      :alt="alt || caption"
      :width="width"
      :height="height"
      class="rounded-lg object-cover"
    />
    <figcaption v-if="caption" class="mt-2 text-center text-sm text-gray-500">
      {{ caption }}
    </figcaption>
  </figure>
</template>
