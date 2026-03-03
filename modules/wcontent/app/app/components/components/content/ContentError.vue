<script setup lang="ts">
import { designTokens } from "../../../../shared/tokens/design-tokens";

defineProps<{
	class?: string;
	error?: string;
}>();
</script>

<template>
	<div
		:class="['prose-error', $props.class]"
		role="alert"
		aria-live="assertive"
	>
		<div class="prose-error-icon">⚠️</div>
		<div class="prose-error-content">
			<h3 class="prose-error-title">Error Loading Content</h3>
			<p class="prose-error-message">
				{{ error || "Failed to load content. Please try again later." }}
			</p>
		</div>
	</div>
</template>

<style scoped>
.prose-error {
	display: flex;
	align-items: flex-start;
	gap: var(--prose-md);
	padding: var(--prose-md);
	background-color: var(--prose-bg-secondary);
	border: 1px solid var(--prose-border-default);
	border-radius: var(--prose-radius-md);
}

.prose-error-icon {
	font-size: 1.5rem;
	flex-shrink: 0;
}

.prose-error-content {
	flex: 1;
}

.prose-error-title {
	margin: 0 0 var(--prose-xs) 0;
	font-size: var(--prose-body-size);
	font-weight: var(--prose-weight-semibold);
	color: var(--prose-text-primary);
}

.prose-error-message {
	margin: 0;
	font-size: var(--prose-small-size);
	color: var(--prose-text-secondary);
}
</style>
