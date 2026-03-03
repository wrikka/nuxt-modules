<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  class?: string
}

const _props = defineProps<Props>()
</script>

<template>
  <section :class="['py-8 md:py-12', _props.class]">
    <div v-if="title || description || $slots.header" class="mb-6">
      <slot name="header">
        <h2 v-if="title" class="text-2xl font-bold tracking-tight">{{ title }}</h2>
        <p v-if="description" class="mt-2 text-muted-foreground">{{ description }}</p>
      </slot>
    </div>
    <slot />
  </section>
</template>
