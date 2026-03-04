<script setup lang="ts">
const { undo, redo, loadAudioFile } = useAudioEditor();
const fileInput = ref<HTMLInputElement | null>(null);

const emit = defineEmits<{
	openBatchProcessor: [];
	openCloudExport: [];
	openAudioCalculator: [];
	openTemplates: [];
}>();

const handleImport = () => {
	fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	if (file) {
		await loadAudioFile(file);
	}
	target.value = "";
};
</script>

<template>
	<div class="h-14 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4">
		<div class="flex items-center gap-4">
			<NuxtLink to="/" class="text-gray-400 hover:text-white transition-colors">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
			</NuxtLink>
			<h1 class="text-white font-semibold text-lg">Audio Editor</h1>
		</div>

		<div class="flex items-center gap-4">
			<button
				@click="undo"
				class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
				title="Undo (Ctrl+Z)"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
					/>
				</svg>
			</button>
			<button
				@click="redo"
				class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
				title="Redo (Ctrl+Y)"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
					/>
				</svg>
			</button>
			<div class="w-px h-6 bg-gray-700"></div>
			<button
				@click="handleImport"
				class="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm font-medium"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
					/>
				</svg>
				Import Audio
			</button>
			<div class="w-px h-6 bg-gray-700"></div>
			<button
				@click="emit('openBatchProcessor')"
				class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
				title="Batch Process"
			>
				<svg
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>
			<button
				@click="emit('openTemplates')"
				class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
				title="Templates"
			>
				<svg
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
					/>
				</svg>
			</button>
			<button
				@click="emit('openAudioCalculator')"
				class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
				title="Audio Calculator"
			>
				<svg
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
					/>
				</svg>
			</button>
			<input
				ref="fileInput"
				type="file"
				accept="audio/*"
				class="hidden"
				@change="handleFileChange"
			>
		</div>
	</div>
</template>
