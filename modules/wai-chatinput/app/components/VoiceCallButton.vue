<template>
  <button
    @click="$emit('start')"
    class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
    :disabled="disabled"
    title="Start voice call"
  >
    <Icon name="mdi:phone" class="w-5 h-5" />
  </button>
</template>

<script setup lang="ts">
interface Props {
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false
})

defineEmits<{
  start: []
}>()
</script>
