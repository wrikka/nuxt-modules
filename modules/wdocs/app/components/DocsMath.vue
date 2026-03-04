<script setup lang="ts">
import katex from 'katex'

const props = defineProps<{
  expression: string
  display?: boolean
}>()

const rendered = computed(() => {
  try {
    return katex.renderToString(props.expression, {
      displayMode: props.display,
      throwOnError: false
    })
  } catch {
    return props.expression
  }
})
</script>

<template>
  <span class="docs-math" :class="{ 'block': display }" v-html="rendered" />
</template>
