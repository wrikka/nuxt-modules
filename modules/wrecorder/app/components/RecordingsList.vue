<script setup lang="ts">
import type { Recording } from "./types";

const props = defineProps<{
	recordings: Recording[];
}>();

const emit = defineEmits<{
	preview: [recording: Recording];
	download: [recording: Recording];
	upload: [recording: Recording];
	delete: [recording: Recording];
	rename: [recording: Recording, newName: string];
	share: [recording: Recording];
}>();

const searchQuery = ref("");
const activeFilter = ref("all");
const showRenameModal = ref(false);
const renameRecording = ref<Recording | null>(null);
const newName = ref("");
const selectedRecordings = ref<string[]>([]);
const showShareModal = ref(false);
const shareLink = ref("");

const filterOptions = [
	{ value: "all", label: "All" },
	{ value: "today", label: "Today" },
	{ value: "week", label: "This Week" },
	{ value: "month", label: "This Month" },
];

const filteredRecordings = computed(() => {
	let filtered = props.recordings;

	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		filtered = filtered.filter((recording) =>
			recording.name.toLowerCase().includes(query)
		);
	}

	if (activeFilter.value !== "all") {
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
		const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

		filtered = filtered.filter((recording) => {
			const recordingDate = new Date(recording.timestamp);

			if (activeFilter.value === "today") {
				return recordingDate >= today;
			}
			if (activeFilter.value === "week") {
				return recordingDate >= weekAgo;
			}
			if (activeFilter.value === "month") {
				return recordingDate >= monthAgo;
			}
			return true;
		});
	}

	return filtered;
});

const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

const formatTimestamp = (timestamp: number) => {
	const date = new Date(timestamp);
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(diff / 3600000);
	const days = Math.floor(diff / 86400000);

	if (minutes < 1) return "Just now";
	if (minutes < 60) return `${minutes}m ago`;
	if (hours < 24) return `${hours}h ago`;
	return `${days}d ago`;
};

const startRename = (recording: Recording) => {
	renameRecording.value = recording;
	newName.value = recording.name;
	showRenameModal.value = true;
};

const confirmRename = () => {
	if (renameRecording.value && newName.value.trim()) {
		emit("rename", renameRecording.value, newName.value.trim());
		showRenameModal.value = false;
		renameRecording.value = null;
		newName.value = "";
	}
};

const toggleSelect = (recording: Recording) => {
	const index = selectedRecordings.value.indexOf(recording.id);
	if (index > -1) {
		selectedRecordings.value.splice(index, 1);
	} else {
		selectedRecordings.value.push(recording.id);
	}
};

const batchUpload = () => {
	const selected = props.recordings.filter((r) =>
		selectedRecordings.value.includes(r.id)
	);
	selected.forEach((recording) => {
		emit("upload", recording);
	});
	selectedRecordings.value = [];
};

const startShare = (recording: Recording) => {
	const link = `${window.location.origin}/share/${recording.id}`;
	shareLink.value = link;
	showShareModal.value = true;
};

const copyShareLink = async () => {
	try {
		await navigator.clipboard.writeText(shareLink.value);
		alert("Link copied to clipboard!");
	} catch (error) {
		console.error("Failed to copy link:", error);
	}
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
			Recordings ({{ filteredRecordings.length }})
		</h2>

		<div class="space-y-3 mb-4">
			<div class="relative">
				<Icon
					name="mdi:magnify"
					class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
				/>
				<input
					v-model="searchQuery"
					type="text"
					placeholder="Search recordings..."
					class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
				/>
			</div>

			<div class="flex items-center space-x-2">
				<button
					v-for="filter in filterOptions"
					:key="filter.value"
					@click="activeFilter = filter.value"
					:class="[
						'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
						activeFilter === filter.value
							? 'bg-purple-600 text-white'
							: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
					]"
				>
					{{ filter.label }}
				</button>
			</div>
		</div>

		<div v-if="filteredRecordings.length === 0" class="text-center py-8">
			<Icon name="mdi:video-off" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
			<p class="text-gray-600 dark:text-gray-400">
				No recordings yet. Start recording to see them here.
			</p>
		</div>

		<div v-else class="space-y-3 max-h-[600px] overflow-y-auto">
			<div
				v-for="recording in filteredRecordings"
				:key="recording.id"
				class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
			>
				<div class="flex items-start justify-between mb-3">
					<div class="flex-1">
						<h3 class="font-medium text-gray-900 dark:text-white mb-1">
							{{ recording.name }}
						</h3>
						<p class="text-sm text-gray-600 dark:text-gray-400">
							{{ formatDuration(recording.duration) }} • {{
								formatTimestamp(recording.timestamp)
							}}
						</p>
					</div>
					<div class="flex items-center space-x-1">
						<button
							@click="startRename(recording)"
							class="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all"
							title="Rename"
						>
							<Icon name="mdi:pencil" class="w-5 h-5" />
						</button>
						<button
							@click="$emit('preview', recording)"
							class="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
							title="Preview"
						>
							<Icon name="mdi:play-circle" class="w-5 h-5" />
						</button>
						<button
							@click="$emit('download', recording)"
							class="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all"
							title="Download"
						>
							<Icon name="mdi:download" class="w-5 h-5" />
						</button>
						<button
							@click="$emit('upload', recording)"
							class="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
							title="Upload to Server"
						>
							<Icon name="mdi:cloud-upload" class="w-5 h-5" />
						</button>
						<button
							@click="toggleSelect(recording)"
							:class="[
								'p-2 rounded-lg transition-all',
								selectedRecordings.includes(recording.id)
									? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
									: 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20',
							]"
							title="Select for batch upload"
						>
							<Icon name="mdi:checkbox-marked" class="w-5 h-5" />
						</button>
						<button
							@click="$emit('share', recording)"
							class="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
							title="Share Link"
						>
							<Icon name="mdi:share-variant" class="w-5 h-5" />
						</button>
						<button
							@click="$emit('delete', recording)"
							class="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
							title="Delete"
						>
							<Icon name="mdi:delete" class="w-5 h-5" />
						</button>
					</div>
				</div>

				<video
					:src="recording.url"
					class="w-full rounded-lg bg-black"
					controls
					preload="metadata"
				/>
			</div>
		</div>
	</div>

	<div
		v-if="showRenameModal"
		class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
		@click="showRenameModal = false"
	>
		<div
			class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
			@click.stop
		>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
				Rename Recording
			</h3>
			<input
				v-model="newName"
				type="text"
				placeholder="Enter new name..."
				class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
				@keyup.enter="confirmRename"
			/>
			<div class="flex justify-end space-x-3">
				<button
					@click="showRenameModal = false"
					class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
				>
					Cancel
				</button>
				<button
					@click="confirmRename"
					class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
				>
					Rename
				</button>
			</div>
		</div>
	</div>

	<div
		v-if="selectedRecordings.length > 0"
		class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 flex items-center space-x-4 z-50"
	>
		<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
			{{ selectedRecordings.length }} selected
		</span>
		<button
			@click="batchUpload"
			class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center space-x-2"
		>
			<Icon name="mdi:cloud-upload" class="w-4 h-4" />
			<span>Upload All</span>
		</button>
		<button
			@click="selectedRecordings = []"
			class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
		>
			Cancel
		</button>
	</div>

	<div
		v-if="showShareModal"
		class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
		@click="showShareModal = false"
	>
		<div
			class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
			@click.stop
		>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
				Share Recording
			</h3>
			<div class="space-y-4">
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>
						Share Link
					</label>
					<div class="flex space-x-2">
						<input
							:value="shareLink"
							readonly
							class="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
						/>
						<button
							@click="copyShareLink"
							class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
						>
							Copy
						</button>
					</div>
				</div>
				<div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
					<Icon name="mdi:information" class="w-4 h-4" />
					<span>Link expires in 7 days</span>
				</div>
			</div>
			<div class="flex justify-end mt-6">
				<button
					@click="showShareModal = false"
					class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
				>
					Close
				</button>
			</div>
		</div>
	</div>
</template>
