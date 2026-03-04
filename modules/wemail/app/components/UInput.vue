<script setup lang="ts">
const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  icon: { type: String, default: null },
})

const emit = defineEmits(['update:modelValue'])

const _localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <AtomsInput
    v-model="_localValue"
    :placeholder="placeholder"
    :icon="icon"
  />
</template>
