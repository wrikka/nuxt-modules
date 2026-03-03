<script setup lang="ts">
const _props = defineProps<{
	title: string;
	isActive?: boolean;
}>();
</script>

<template>
  <button
    :title="_props.title"
    class="flex items-center justify-center p-1.5 rounded cursor-pointer transition-colors"
    :class="[
      _props.isActive
        ? 'bg-gray-200 dark:bg-gray-700'
        : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
    ]"
  >
    <slot />
  </button>
</template>
