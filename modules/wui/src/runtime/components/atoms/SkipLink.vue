<script setup lang="ts">
interface Props {
  to: string
  text?: string
}

withDefaults(defineProps<Props>(), {
  text: 'Skip to main content'
})
</script>

<template>
  <a
    :href="to"
    class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:shadow-lg"
  >
    {{ text }}
  </a>
</template>
