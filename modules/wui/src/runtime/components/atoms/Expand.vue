<script setup lang="ts">
interface Props {
  modelValue?: boolean
  defaultOpen?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  defaultOpen: true
})
</script>

<template>
  <Collapse :model-value="modelValue" :default-open="defaultOpen">
    <template #trigger="{ isOpen, toggle }">
      <slot name="trigger" :is-open="isOpen" :toggle="toggle" />
    </template>
    <slot />
  </Collapse>
</template>
