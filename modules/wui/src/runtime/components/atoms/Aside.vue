<script setup lang="ts">
interface Props {
  position?: 'left' | 'right'
  width?: string
  sticky?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  position: 'right',
  width: '20rem',
  sticky: false
})

const _classes = [
  'flex-shrink-0',
  sticky && 'sticky top-0 h-fit'
]
</script>

<template>
  <aside
    :class="[_classes, _props.class]"
    :style="{ width }"
  >
    <slot />
  </aside>
</template>
