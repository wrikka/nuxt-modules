<script setup lang="ts">
interface Props {
  label?: string
  class?: string
}

const _props = defineProps<Props>()
</script>

<template>
  <div class="relative py-1.5">
    <div class="absolute inset-0 flex items-center">
      <span class="w-full border-t" />
    </div>
    <div v-if="label" class="relative flex justify-center text-xs uppercase">
      <span class="bg-popover px-2 text-muted-foreground">{{ label }}</span>
    </div>
  </div>
</template>
