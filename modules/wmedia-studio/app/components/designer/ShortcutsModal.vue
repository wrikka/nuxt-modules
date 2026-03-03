<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

defineProps<Props>();

defineEmits<{
	close: [];
}>();
</script>

<template>
	<Modal :show="isOpen" size="md" @close="$emit('close')">
