<script setup lang="ts">
interface Props {
  ratio?: number | string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  ratio: 16 / 9
})

const paddingBottom = `${(1 / Number(props.ratio)) * 100}%`
</script>

<template>
  <div class="relative w-full" :style="{ paddingBottom }">
    <div class="absolute inset-0" :class="$props.class">
      <slot />
    </div>
  </div>
</template>
