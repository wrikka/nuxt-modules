<script setup lang="ts">
const route = useRoute()
const { data: surround } = await useAsyncData('surround-' + route.path, () => {
  return queryCollection('content')
    .where('extension', '=', 'md')
    .findSurround(route.path)
})

const [prev, next] = surround.value || [null, null]
</script>

<template>
  <div v-if="prev || next" class="docs-prev-next">
    <div class="docs-prev">
      <NuxtLink v-if="prev" :to="prev.path" class="docs-prev-next-link">
        <span class="docs-prev-next-label">Previous</span>
        <span class="docs-prev-next-title flex items-center gap-2">
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          {{ prev.title }}
        </span>
      </NuxtLink>
    </div>
    <div class="docs-next">
      <NuxtLink v-if="next" :to="next.path" class="docs-prev-next-link">
        <span class="docs-prev-next-label">Next</span>
        <span class="docs-prev-next-title flex items-center gap-2 justify-end">
          {{ next.title }}
          <Icon name="lucide:arrow-right" class="w-4 h-4" />
        </span>
      </NuxtLink>
    </div>
  </div>
</template>
