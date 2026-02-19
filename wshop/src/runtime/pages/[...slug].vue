<template>
  <div>
    <div v-if="pending">Loading page...</div>
    <BlocksNotFound v-else-if="error" />
    <div v-else-if="page" class="container mx-auto p-4">
            <!-- Dynamic component renderer -->
      <div v-for="(block, index) in page.content as any[]" :key="block.id || index">
        <component :is="resolveComponent(block.type)" v-bind="block.props" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports';

const { page, pending, error } = usePage()

useHead(() => ({
  title: page.value?.metaTitle || page.value?.title,
  meta: [
    {
      name: 'description',
      content: page.value?.metaDescription || '',
    },
  ],
}));

const resolveComponent = (typeName: string) => {
  // Nuxt 3 auto-imports components from ~/components and prefixes them.
  // For a component at '~/components/blocks/Heading.vue', the name will be 'BlocksHeading'.
  return `Blocks${typeName}`;
};
</script>
