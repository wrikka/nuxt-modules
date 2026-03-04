<script setup lang="ts">
const props = defineProps<{
  type: 'stable' | 'beta' | 'new' | 'deprecated'
}>()

const badgeClass = computed(() => `docs-badge docs-badge-${props.type}`)
const badgeText = computed(() => {
  const texts = {
    stable: 'Stable',
    beta: 'Beta',
    new: 'New',
    deprecated: 'Deprecated'
  }
  return texts[props.type]
})
</script>

<template>
  <span :class="badgeClass">{{ badgeText }}</span>
</template>
