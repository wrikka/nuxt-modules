<script setup lang="ts">
const {
	tracks,
	markers,
	regions,
	saveProject,
	loadProjectFromStorage,
	exportProject,
	importProject,
} = useAudioEditor();

const fileInput = ref<HTMLInputElement | null>(null);

const canSave = computed(() => tracks.value.length > 0);
const canLoad = computed(() => true);
const canExport = computed(() => tracks.value.length > 0);

const handleSave = () => {
	saveProject();
};

const handleLoad = () => {
	loadProjectFromStorage();
};

const handleExport = () => {
	exportProject();
};

const handleImport = () => {
	fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	if (file) {
		await importProject(file);
	}
	target.value = "";
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 px-4 py-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<span class="text-gray-400 text-sm font-medium">Project</span>
				<button
					:disabled="!canSave"
					@click="handleSave"
					class="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-xs transition-colors"
					title="Save Project"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-3 w-3"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
						/>
					</svg>
					Save
				</button>
				<button
					:disabled="!canLoad"
					@click="handleLoad"
					class="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded text-xs transition-colors"
					title="Load Project"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-3 w-3"
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
					Load
				</button>
				<button
					:disabled="!canExport"
					@click="handleExport"
					class="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded text-xs transition-colors"
					title="Export Project"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-3 w-3"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
						/>
					</svg>
					Export
				</button>
				<button
					@click="handleImport"
					class="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs transition-colors"
					title="Import Project"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-3 w-3"
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
					Import
				</button>
				<input
					ref="fileInput"
					type="file"
					accept=".json"
					class="hidden"
					@change="handleFileChange"
				>
			</div>
			<div class="flex items-center gap-2">
				<span class="text-gray-500 text-xs">{{ tracks.length }} tracks</span>
				<span class="text-gray-500 text-xs">{{ markers.length }} markers</span>
				<span class="text-gray-500 text-xs">{{ regions.length }} regions</span>
			</div>
		</div>
	</div>
</template>
