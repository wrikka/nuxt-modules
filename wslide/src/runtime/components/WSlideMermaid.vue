<script setup lang="ts">
const props = defineProps<{
	definition: string;
}>();

const containerRef = ref<HTMLDivElement | null>(null);
const isRendered = ref(false);

onMounted(async () => {
	if (typeof window === "undefined" || !containerRef.value) return;

	try {
		// Dynamically import mermaid
		const mermaid = await import("mermaid");
		mermaid.default.initialize({
			startOnLoad: false,
			theme: "dark",
			securityLevel: "strict",
		});

		const { svg } = await mermaid.default.render(`mermaid-${Date.now()}`, props.definition);
		containerRef.value.innerHTML = svg;
		isRendered.value = true;
	} catch (err) {
		console.error("Failed to render mermaid diagram:", err);
		if (containerRef.value) {
			containerRef.value.innerHTML = `<pre class="text-red-400">${props.definition}</pre>`;
		}
	}
});
</script>

<template>
	<div ref="containerRef" class="mermaid-diagram flex justify-center">
		<div v-if="!isRendered" class="text-gray-400">Loading diagram...</div>
	</div>
</template>

<style scoped>
.mermaid-diagram :deep(svg) {
	max-width: 100%;
	height: auto;
}
</style>
