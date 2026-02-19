<script setup lang="ts">
const _props = defineProps<{
	title: string;
	message: string;
	icon: string;
}>();

const _emit = defineEmits(["action"]);
</script>

<template>
  <div class="text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
    <div class="mx-auto w-12 h-12 flex items-center justify-center bg-gray-800 rounded-full mb-4">
      <Icon :name="icon" class="w-6 h-6 text-gray-500" />
    </div>
    <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
    <p class="mt-1 text-sm text-gray-400">{{ message }}</p>
    <div class="mt-6">
      <slot name="action" />
    </div>
  </div>
</template>
