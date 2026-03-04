<script setup lang="ts">
const props = defineProps({
  to: { type: String, default: null },
  icon: { type: String, default: null },
  label: { type: String, default: null },
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const _component = computed(() => {
  if (props.to) {
    return resolveComponent('NuxtLink')
  }
  return 'button'
})
</script>

<template>
  <AtomsButton
    :as="_component"
    :to="to"
    @click="emit('click', $event)"
  >
    <span v-if="icon" :class="[icon, '-ml-0.5 h-5 w-5']" />
    <span v-if="label">{{ label }}</span>
  </AtomsButton>
</template>
