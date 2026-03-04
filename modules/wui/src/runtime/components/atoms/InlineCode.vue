<script setup lang="ts">
interface Props {
  code: string
  language?: string
}

defineProps<Props>()
</script>

<template>
  <code
    class="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-pink-600"
    :class="language ? `language-${language}` : ''"
  >
    {{ code }}
  </code>
</template>
