<script setup lang="ts">
interface Source {
  srcset: string
  media?: string
  type?: string
}

interface Props {
  sources?: Source[]
  src: string
  alt: string
  width?: number | string
  height?: number | string
  loading?: 'lazy' | 'eager'
}

withDefaults(defineProps<Props>(), {
  sources: () => [],
  loading: 'lazy'
})
</script>

<template>
  <picture>
    <source
      v-for="(source, index) in sources"
      :key="index"
      :srcset="source.srcset"
      :media="source.media"
      :type="source.type"
    />
    <img
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="loading"
      class="object-cover"
    />
  </picture>
</template>
