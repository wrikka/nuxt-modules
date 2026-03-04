<script setup lang="ts">
import { designTokens } from "../../shared/tokens/design-tokens";

defineProps<{
	class?: string;
}>();
</script>

<template>
	<div
		:class="['prose-loading', $props.class]"
		role="status"
		aria-live="polite"
	>
		<div class="prose-loading-spinner" />
		<p class="prose-loading-text">Loading content...</p>
	</div>
</template>

<style scoped>
.prose-loading {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: var(--prose-md);
	padding: var(--prose-xl);
	min-height: 200px;
}

.prose-loading-spinner {
	width: 40px;
	height: 40px;
	border: 3px solid var(--prose-border-light);
	border-top-color: var(--prose-link-default);
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.prose-loading-text {
	color: var(--prose-text-secondary);
	font-size: var(--prose-small-size);
	margin: 0;
}
</style>
