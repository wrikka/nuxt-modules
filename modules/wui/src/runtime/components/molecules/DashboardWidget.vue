<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  class?: string
}

defineProps<Props>()
</script>

<template>
  <AtomsCard :class="['overflow-hidden', $props.class]">
    <div class="flex flex-col space-y-1.5 p-6">
      <h3 v-if="title" class="text-lg font-semibold">
        {{ title }}
      </h3>
      <p v-if="description" class="text-sm text-muted-foreground">
        {{ description }}
      </p>
    </div>
    <div class="p-6 pt-0">
      <slot />
    </div>
  </AtomsCard>
</template>
