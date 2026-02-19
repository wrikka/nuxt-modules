<script setup lang="ts">
const props = defineProps({
  to: { type: String, default: null },
  icon: { type: String, default: null },
  label: { type: String, default: null },
})

const _component = computed(() => {
  if (props.to) {
    return resolveComponent('NuxtLink')
  }
  return 'button'
})
</script>

<template>
  <component
    :is="_component"
    :to="to"
    class="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
  >
    <Icon v-if="icon" :name="icon" class="-ml-0.5 h-5 w-5" />
    <span v-if="label">{{ label }}</span>
  </component>
</template>
