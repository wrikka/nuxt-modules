<script setup lang="ts">
defineProps({
    icon: { type: String, default: 'mdi:email-outline' },
  title: { type: String, default: 'No messages' },
  message: { type: String, default: 'There are no messages to display here.' },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 rounded-lg bg-gray-50/50 dark:bg-gray-900/50 p-8 text-center sm:p-12 md:p-16">
    <div class="rounded-full bg-gray-200/50 dark:bg-gray-800/50 p-4">
      <Icon :name="icon" class="text-5xl text-gray-400 dark:text-gray-500" />
    </div>
    <div class="space-y-2">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">{{ title }}</h2>
      <p class="max-w-xs text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>
    </div>
    <div v-if="$slots.action" class="mt-4">
      <slot name="action" />
    </div>
  </div>
</template>
