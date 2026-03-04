<script setup lang="ts">
interface Props {
  lines?: number
}

withDefaults(defineProps<Props>(), {
  lines: 3
})
</script>

<template>
  <div
    class="overflow-hidden text-ellipsis"
    style="display: -webkit-box; -webkit-box-orient: vertical;"
    :style="{ '-webkit-line-clamp': lines }"
  >
    <slot />
  </div>
</template>
