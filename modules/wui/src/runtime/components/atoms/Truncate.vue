<script setup lang="ts">
interface Props {
  text: string
  lines?: number
  suffix?: string
}

withDefaults(defineProps<Props>(), {
  lines: 1,
  suffix: '...'
})
</script>

<template>
  <span
    class="overflow-hidden text-ellipsis"
    :class="lines > 1 ? 'line-clamp-' + lines : 'whitespace-nowrap'"
    :style="lines > 1 ? { '-webkit-line-clamp': lines } : {}"
  >
    {{ text }}
  </span>
</template>
