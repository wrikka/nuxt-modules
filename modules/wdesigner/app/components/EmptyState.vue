<script setup lang="ts">
const props = defineProps<{
	icon: string;
	title: string;
	description: string;
	actionLabel?: string;
}>();

const emit = defineEmits<{
	action: [];
}>();
</script>

<template>
	<div class="flex flex-col items-center justify-center p-8 text-center">
		<div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
			<svg
				class="w-8 h-8 text-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					:d="icon"
				/>
			</svg>
		</div>
		<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
			{{ title }}
		</h3>
		<p class="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-sm">
			{{ description }}
		</p>
		<Button v-if="actionLabel" variant="primary" @click="$emit('action')">
			{{ actionLabel }}
		</Button>
	</div>
</template>
