<script setup lang="ts">
interface AudioFile {
	id: string;
	name: string;
	title: string;
	artist: string;
	album: string;
	year: string;
	genre: string;
	comment: string;
	artwork: string | null;
}

const files = ref<AudioFile[]>([
	{
		id: "1",
		name: "song1.mp3",
		title: "Unknown Title",
		artist: "Unknown Artist",
		album: "",
		year: "",
		genre: "",
		comment: "",
		artwork: null,
	},
	{
		id: "2",
		name: "song2.wav",
		title: "Unknown Title",
		artist: "Unknown Artist",
		album: "",
		year: "",
		genre: "",
		comment: "",
		artwork: null,
	},
	{
		id: "3",
		name: "podcast.mp3",
		title: "Unknown Title",
		artist: "Unknown Artist",
		album: "",
		year: "",
		genre: "",
		comment: "",
		artwork: null,
	},
]);

const selectedFiles = ref<string[]>([]);
const isEditing = ref(false);
const searchQuery = ref("");

const filteredFiles = computed(() => {
	if (!searchQuery.value) return files.value;
	const query = searchQuery.value.toLowerCase();
	return files.value.filter(f =>
		f.name.toLowerCase().includes(query)
		|| f.title.toLowerCase().includes(query)
		|| f.artist.toLowerCase().includes(query)
	);
});

const selectAll = () => {
	selectedFiles.value = files.value.map(f => f.id);
};

const deselectAll = () => {
	selectedFiles.value = [];
};

const applyMetadata = () => {
	console.log("Applying metadata to", selectedFiles.value.length, "files");
};

const importFiles = () => {
	// Simulate file import
	console.log("Importing files...");
};

const exportFiles = () => {
	console.log("Exporting files...");
};
</script>

<template>
	<div class="bg-gray-900 rounded-lg p-4 space-y-4">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-semibold text-white flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-purple-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
				Batch Metadata Editor
			</h3>
			<div class="flex gap-2">
				<button
					@click="importFiles"
					class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
				>
					Import
				</button>
				<button
					@click="exportFiles"
					class="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
				>
					Export
				</button>
			</div>
		</div>

		<!-- Search -->
		<input
			v-model="searchQuery"
			type="text"
			placeholder="Search files..."
			class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500"
		/>

		<!-- File Selection -->
		<div class="flex items-center justify-between">
			<div class="flex gap-2">
				<button
					@click="selectAll"
					class="text-xs text-purple-400 hover:text-purple-300"
				>
					Select All
				</button>
				<span class="text-gray-600">|</span>
				<button
					@click="deselectAll"
					class="text-xs text-purple-400 hover:text-purple-300"
				>
					Deselect All
				</button>
			</div>
			<span class="text-sm text-gray-400">{{ selectedFiles.length }} / {{
					files.length
				}} selected</span>
		</div>

		<!-- File List -->
		<div class="max-h-48 overflow-y-auto space-y-1">
			<div
				v-for="file in filteredFiles"
				:key="file.id"
				@click="selectedFiles.includes(file.id)
				? selectedFiles = selectedFiles.filter(id => id !== file.id)
				: selectedFiles.push(file.id)"
				:class="[
					'flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors',
					selectedFiles.includes(file.id)
						? 'bg-purple-900/30 border border-purple-700'
						: 'bg-gray-800 hover:bg-gray-700',
				]"
			>
				<input
					type="checkbox"
					:checked="selectedFiles.includes(file.id)"
					class="rounded border-gray-600 text-purple-500 focus:ring-purple-500"
					@click.stop
					@change="selectedFiles.includes(file.id)
					? selectedFiles = selectedFiles.filter(id => id !== file.id)
					: selectedFiles.push(file.id)"
				/>

				<!-- Artwork Placeholder -->
				<div class="w-10 h-10 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
					<svg
						v-if="!file.artwork"
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-gray-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
						/>
					</svg>
					<img
						v-else
						:src="file.artwork"
						class="w-full h-full object-cover rounded"
					/>
				</div>

				<div class="flex-1 min-w-0">
					<div class="text-sm font-medium text-white truncate">
						{{ file.title }}
					</div>
					<div class="text-xs text-gray-500 truncate">
						{{ file.artist }} — {{ file.name }}
					</div>
				</div>
			</div>
		</div>

		<!-- Metadata Editor -->
		<div
			v-if="selectedFiles.length > 0"
			class="space-y-3 border-t border-gray-800 pt-3"
		>
			<div class="text-sm font-medium text-white">
				Edit Metadata ({{ selectedFiles.length }} files)
			</div>

			<div class="grid grid-cols-2 gap-3">
				<div class="space-y-1">
					<label class="text-xs text-gray-500">Title</label>
					<input
						type="text"
						placeholder="Keep existing"
						class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600"
					/>
				</div>
				<div class="space-y-1">
					<label class="text-xs text-gray-500">Artist</label>
					<input
						type="text"
						placeholder="Keep existing"
						class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600"
					/>
				</div>
				<div class="space-y-1">
					<label class="text-xs text-gray-500">Album</label>
					<input
						type="text"
						placeholder="Keep existing"
						class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600"
					/>
				</div>
				<div class="space-y-1">
					<label class="text-xs text-gray-500">Year</label>
					<input
						type="text"
						placeholder="Keep existing"
						class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600"
					/>
				</div>
				<div class="space-y-1">
					<label class="text-xs text-gray-500">Genre</label>
					<input
						type="text"
						placeholder="Keep existing"
						class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600"
					/>
				</div>
				<div class="space-y-1">
					<label class="text-xs text-gray-500">Track Number</label>
					<input
						type="text"
						placeholder="Auto-number"
						class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600"
					/>
				</div>
			</div>

			<div class="space-y-1">
				<label class="text-xs text-gray-500">Comment</label>
				<textarea
					rows="2"
					placeholder="Keep existing"
					class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 resize-none"
				></textarea>
			</div>

			<!-- Artwork Upload -->
			<div class="space-y-1">
				<label class="text-xs text-gray-500">Album Artwork</label>
				<div class="flex gap-2">
					<button class="flex-1 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 border-dashed rounded-lg text-sm text-gray-400 transition-colors">
						Drop image or click to upload
					</button>
					<button class="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm transition-colors">
						Remove
					</button>
				</div>
			</div>

			<button
				@click="applyMetadata"
				class="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
			>
				Apply to {{ selectedFiles.length }} Selected File(s)
			</button>
		</div>
	</div>
</template>
