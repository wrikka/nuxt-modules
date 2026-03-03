<script setup lang="ts">
interface Props {
  message?: string
  class?: string
}

const _props = defineProps<Props>()
</script>

<template>
  <p
    v-if="message"
    class="text-sm text-destructive flex items-center gap-1"
    :class="_props.class"
  >
    <span class="i-lucide-alert-circle h-4 w-4" />
    {{ message }}
  </p>
</template>
