<script setup lang="ts">
import { designTokens } from "../../shared/tokens/design-tokens";

defineProps<{
	class?: string;
}>();
</script>

<template>
	<article :class="['prose-content', $props.class]" role="article">
		<slot />
	</article>
</template>

<style scoped>
.prose-content {
	font-family: var(--prose-font-sans);
	font-size: var(--prose-body-size);
	line-height: var(--prose-line-relaxed);
	color: var(--prose-text-primary);
	max-width: 65ch;
	margin: 0 auto;
	padding: var(--prose-xl);
}

@media (max-width: 768px) {
	.prose-content {
		padding: var(--prose-md);
		font-size: var(--prose-small-size);
	}
}
</style>
