<script setup lang="ts">
import type { CloudExportSettings } from "#shared/types/audio";

const props = defineProps<{
	projectName: string;
	audioBlob: Blob | null;
}>();

const emit = defineEmits<{
	export: [config: CloudExportSettings];
}>();

const platforms = [
	{
		id: "youtube",
		name: "YouTube",
		icon:
			"M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 00.5 6.19 31.5 31.5 0 000 12a31.5 31.5 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.5 31.5 0 0024 12a31.5 31.5 0 00-.5-5.81zM9.55 15.5V8.5l6.27 3.5-6.27 3.5z",
		maxDuration: 43200,
	},
	{
		id: "soundcloud",
		name: "SoundCloud",
		icon:
			"M1.5 12.5v-9h1v9h-1zm3 0v-9h1v9h-1zm3 0v-9h1v9h-1zm3 0v-9h1v9h-1zm3 0v-9h1v9h-1zm3-3v-6h1v6h-1zm3 2v-8h1v8h-1zm3-1v-7h1v7h-1zm3-2v-5h1v5h-1zm3 1v-6h1v6h-1z",
		maxDuration: 10800,
	},
	{
		id: "spotify",
		name: "Spotify",
		icon:
			"M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z",
		maxDuration: 0,
	},
	{
		id: "podcast",
		name: "Podcast RSS",
		icon:
			"M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm0-14a6 6 0 100 12 6 6 0 000-12zm0 10a4 4 0 110-8 4 4 0 010 8z",
		maxDuration: 0,
	},
] as const;

const selectedPlatform = ref<typeof platforms[number]["id"]>("youtube");
const title = ref("");
const description = ref("");
const tags = ref("");
const visibility = ref<"public" | "unlisted" | "private">("public");
const isExporting = ref(false);
const exportProgress = ref(0);

const selectedPlatformInfo = computed(() => {
	return platforms.find(p => p.id === selectedPlatform.value);
});

const startExport = async () => {
	if (!props.audioBlob) return;

	isExporting.value = true;
	exportProgress.value = 0;

	// Simulate upload progress
	for (let i = 0; i <= 100; i += 10) {
		exportProgress.value = i;
		await new Promise(resolve => setTimeout(resolve, 300));
	}

	const config: CloudExportSettings = {
		platform: selectedPlatform.value,
		title: title.value || props.projectName,
		description: description.value,
		tags: tags.value.split(",").map(t => t.trim()).filter(Boolean),
		privacy: visibility.value,
	};

	emit("export", config);
	isExporting.value = false;
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium">Cloud Export</span>
		</div>

		<!-- Platform Selection -->
		<div class="mb-4">
			<label class="block text-gray-400 text-xs mb-2">Platform</label>
			<div class="grid grid-cols-2 gap-2">
				<button
					v-for="platform in platforms"
					:key="platform.id"
					@click="selectedPlatform = platform.id"
					:class="[
						'p-2 rounded flex items-center gap-2 transition-colors',
						selectedPlatform === platform.id
							? 'bg-blue-600 text-white'
							: 'bg-gray-800 text-gray-400 hover:bg-gray-700',
					]"
				>
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
						<path :d="platform.icon" />
					</svg>
					<span class="text-xs">{{ platform.name }}</span>
				</button>
			</div>
		</div>

		<!-- Export Settings -->
		<div class="space-y-3 mb-4">
			<div>
				<label class="block text-gray-400 text-xs mb-1">Title</label>
				<input
					v-model="title"
					:placeholder="projectName"
					class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700"
				>
			</div>

			<div>
				<label class="block text-gray-400 text-xs mb-1">Description</label>
				<textarea
					v-model="description"
					rows="2"
					class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 resize-none"
				/>
			</div>

			<div>
				<label class="block text-gray-400 text-xs mb-1"
				>Tags (comma separated)</label>
				<input
					v-model="tags"
					placeholder="music, podcast, audio..."
					class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700"
				>
			</div>

			<div>
				<label class="block text-gray-400 text-xs mb-1">Visibility</label>
				<select
					v-model="visibility"
					class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700"
				>
					<option value="public">Public</option>
					<option value="unlisted">Unlisted</option>
					<option value="private">Private</option>
				</select>
			</div>
		</div>

		<!-- Progress -->
		<div v-if="isExporting" class="mb-4">
			<div class="flex justify-between text-xs mb-1">
				<span class="text-gray-400"
				>Uploading to {{ selectedPlatformInfo?.name }}...</span>
				<span class="text-blue-400">{{ exportProgress }}%</span>
			</div>
			<div class="h-2 bg-gray-800 rounded overflow-hidden">
				<div
					class="h-full bg-blue-500 transition-all"
					:style="{ width: `${exportProgress}%` }"
				/>
			</div>
		</div>

		<!-- Export Button -->
		<button
			@click="startExport"
			:disabled="!audioBlob || isExporting"
			class="w-full px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded text-sm transition-colors"
		>
			{{
				isExporting
				? "Uploading..."
				: `Export to ${selectedPlatformInfo?.name}`
			}}
		</button>

		<p class="mt-3 text-xs text-gray-500">
			Export directly to popular audio platforms. Requires connected account.
		</p>
	</div>
</template>
