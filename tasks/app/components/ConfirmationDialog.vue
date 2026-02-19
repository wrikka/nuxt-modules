<script setup lang="ts">
defineProps<{
	title: string;
	message: string;
}>();

const emit = defineEmits(["confirm", "cancel"]);
</script>

<template>
  <BaseModal ~/close="emit('cancel')">
    <template #header>
      <h2 class="text-lg font-semibold text-gray-100">{{ title }}</h2>
    </template>
    <p class="text-sm text-gray-400">{{ message }}</p>
    <template #footer>
      <button ~/click="emit('cancel')" type="button" class="rounded-md bg-gray-700/50 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700/80 transition">
        Cancel
      </button>
      <button ~/click="emit('confirm')" type="button" class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 transition">
        Confirm
      </button>
    </template>
  </BaseModal>
</template>
