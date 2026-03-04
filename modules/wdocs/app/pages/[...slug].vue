<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'WDocs',
  description: 'Documentation made simple'
})

useHead({
  title: props.title,
  meta: [
    { name: 'description', content: props.description }
  ]
})
</script>

<template>
  <div class="docs-page">
    <article class="prose dark:prose-invert max-w-none">
      <ContentDoc />
    </article>
  </div>
</template>
