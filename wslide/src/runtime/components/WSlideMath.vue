<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps<{
	expression: string;
	display?: boolean;
}>();

const containerRef = ref<HTMLDivElement | null>(null);

onMounted(async () => {
	if (typeof window === "undefined" || !containerRef.value) return;

	try {
		// Dynamically import KaTeX
		const katex = await import("katex");
		katex.default.render(props.expression, containerRef.value, {
			throwOnError: false,
			displayMode: props.display ?? false,
		});
	} catch (err) {
		console.error("Failed to render math:", err);
		if (containerRef.value) {
			containerRef.value.textContent = props.expression;
		}
	}
});
</script>

<template>
	<span ref="containerRef" class="math-expression" />
</template>

<style scoped>
.math-expression :deep(.katex) {
	font-size: 1.1em;
}
</style>
