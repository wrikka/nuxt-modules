<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	title?: string;
	url?: string;
}>();

const emit = defineEmits<{ close: [] }>();
const showUrl = ref(false);
const embedUrl = computed(() => props.url || "https://example.com");
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		@click.self="emit('close')"
	>
		<div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl h-[80vh] shadow-2xl flex flex-col">
			<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					{{ title || "Preview" }}
				</h3>
				<div class="flex items-center gap-2">
					<button
						@click="showUrl = !showUrl"
						class="p-2 hover:bg-gray-100 rounded-lg"
					>
						<Icon name="mdi:link" class="w-5 h-5" />
					</button>
					<button
						@click="emit('close')"
						class="p-2 hover:bg-gray-100 rounded-lg"
					>
						<Icon name="mdi:close" class="w-5 h-5" />
					</button>
				</div>
			</div>
			<div
				v-if="showUrl"
				class="p-2 bg-gray-50 border-b border-gray-200 dark:border-gray-700"
			>
				<input
					:value="embedUrl"
					readonly
					class="w-full px-3 py-2 bg-white border rounded text-sm"
				/>
			</div>
			<div class="flex-1 bg-gray-100 dark:bg-gray-900">
				<iframe :src="embedUrl" class="w-full h-full border-0" />
			</div>
		</div>
	</div>
</template>
