<script setup lang="ts">
interface ExportOptions {
	format: "png" | "svg" | "json";
	multiplier: number;
	includeBackground: boolean;
	selectionOnly: boolean;
}

interface Props {
	isOpen: boolean;
	options: ExportOptions;
}

defineProps<Props>();

defineEmits<{
	close: [];
	"update:options": [options: ExportOptions];
	export: [];
}>();
</script>

<template>
	<Modal :show="isOpen" size="md" @close="$emit('close')">
