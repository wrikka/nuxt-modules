<script setup lang="ts">
const props = defineProps<{
	src: string;
	title?: string;
	width?: string;
	height?: string;
}>();

const isLoading = ref(true);
const hasError = ref(false);

function onLoad() {
	isLoading.value = false;
}

function onError() {
	isLoading.value = false;
	hasError.value = true;
}
</script>

<template>
	<div class="relative rounded-lg overflow-hidden bg-gray-900">
		<div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-gray-800">
			<div class="flex items-center gap-2 text-gray-400">
				<svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
				</svg>
				<span>Loading...</span>
			</div>
		</div>

		<div v-if="hasError" class="p-8 text-center text-gray-400">
			<svg class="w-12 h-12 mx-auto mb-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10" />
				<path d="M15 9l-6 6M9 9l6 6" />
			</svg>
			<p>Failed to load embedded content</p>
			<p class="text-sm text-gray-500 mt-1">{{ src }}</p>
		</div>

		<iframe
			v-show="!isLoading && !hasError"
			:src="src"
			:title="title || 'Embedded content'"
			class="w-full border-0"
			:style="{ height: height || '400px' }"
			@load="onLoad"
			@error="onError"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		/>
	</div>
</template>
