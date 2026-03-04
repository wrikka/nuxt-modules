<script setup lang="ts">
interface Props {
  as?: string
}

withDefaults(defineProps<Props>(), {
  as: 'span'
})
</script>

<template>
  <component :is="as" class="sr-only">
    <slot />
  </component>
</template>
