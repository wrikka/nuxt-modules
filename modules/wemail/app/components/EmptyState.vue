<script setup lang="ts">
defineProps({
  icon: { type: String, default: 'mdi:email-outline' },
  title: { type: String, default: 'No messages' },
  message: { type: String, default: 'There are no messages to display here.' },
})
</script>

<template>
  <AtomsEmpty
    :icon="icon"
    :title="title"
    :message="message"
  >
    <template v-if="$slots.action" #action>
      <slot name="action" />
    </template>
  </AtomsEmpty>
</template>
