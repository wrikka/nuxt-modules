<script setup lang="ts">
import { nanoid } from "nanoid";

interface AudioFile {
	id: string;
	name: string;
	url: string;
	duration: number;
	file: File;
}

const emit = defineEmits<{
	"select-audio": [audio: AudioFile];
}>();

const searchQuery = ref("");
const audioFiles = ref<AudioFile[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const selectedTrackId = ref<string | null>(null);

const { tracks, addClipToTrack, formatTime } = useAudioEditor();

const filteredAudioFiles = computed(() => {
	if (!searchQuery.value) return audioFiles.value;
	const query = searchQuery.value.toLowerCase();
	return audioFiles.value.filter((audio) =>
		audio.name.toLowerCase().includes(query)
	);
});

const handleImport = () => {
	fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
	const target = event.target as HTMLInputElement;
	const files = target.files;
	if (!files) return;

	for (const file of Array.from(files)) {
		const url = URL.createObjectURL(file);
		const audio = new Audio(url);
		await new Promise<void>((resolve) => {
			audio.onloadedmetadata = () => {
				audioFiles.value.push({
					id: nanoid(),
					name: file.name,
					url,
					duration: audio.duration,
					file,
				});
				resolve();
			};
		});
	}

	target.value = "";
};

const handleSelectAudio = (audio: AudioFile) => {
	emit("select-audio", audio);
};

const handleDeleteAudio = (audioId: string) => {
	audioFiles.value = audioFiles.value.filter((a) => a.id !== audioId);
};

const handlePreview = (audio: AudioFile) => {
	const previewAudio = new Audio(audio.url);
	previewAudio.play();
};

const handleAddToTrack = async (audio: AudioFile) => {
	if (!selectedTrackId.value) {
		if (tracks.value.length === 0) {
			const { createTrack } = useAudioEditor();
			const newTrack = createTrack("Track 1");
			selectedTrackId.value = newTrack.id;
		} else {
			selectedTrackId.value = tracks.value[0]?.id ?? null;
		}
	}

	if (selectedTrackId.value) {
		await addClipToTrack(audio.file, selectedTrackId.value);
	}
};

const handleDragStart = (event: DragEvent, audio: AudioFile) => {
	if (event.dataTransfer) {
		event.dataTransfer.setData("audio-id", audio.id);
		event.dataTransfer.effectAllowed = "copy";
	}
};
</script>

<template>
	<div class="w-72 bg-gray-900 border-l border-gray-700 flex flex-col">
		<div class="h-12 bg-gray-800 flex items-center justify-between px-4 border-b border-gray-700">
			<span class="text-white font-medium">Audio Library</span>
			<button
				@click="handleImport"
				class="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
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
						d="M12 4v16m8-8H4"
					/>
				</svg>
				Import
			</button>
			<input
				ref="fileInput"
				type="file"
				accept="audio/*"
				multiple
				class="hidden"
				@change="handleFileChange"
			>
		</div>

		<div class="flex-1 overflow-y-auto p-4">
			<div class="mb-4">
				<input
					v-model="searchQuery"
					type="text"
					placeholder="Search audio..."
					class="w-full bg-gray-800 text-white text-sm rounded px-3 py-2 border border-gray-700 focus:border-blue-500 focus:outline-none"
				>
			</div>

			<div
				v-if="filteredAudioFiles.length === 0"
				class="text-gray-500 text-sm text-center py-8"
			>
				{{ searchQuery ? "No audio files found" : "No audio files imported" }}
			</div>

			<div v-else class="space-y-2">
				<div
					v-for="audio in filteredAudioFiles"
					:key="audio.id"
					class="bg-gray-800 rounded p-3 hover:bg-gray-700 transition-colors cursor-pointer group"
					@click="handleSelectAudio(audio)"
					@dragstart="handleDragStart($event, audio)"
					draggable="true"
				>
					<div class="flex items-start justify-between mb-2">
						<div class="flex-1 min-w-0">
							<p class="text-white text-sm font-medium truncate">
								{{ audio.name }}
							</p>
							<p class="text-gray-400 text-xs">
								{{ formatTime(audio.duration) }}
							</p>
						</div>
						<button
							@click.stop="handleDeleteAudio(audio.id)"
							class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
							title="Delete"
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
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
						</button>
					</div>
					<div class="flex items-center gap-2">
						<button
							@click.stop="handlePreview(audio)"
							class="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs transition-colors"
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
									d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							Preview
						</button>
						<button
							@click.stop="handleAddToTrack(audio)"
							class="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors"
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
									d="M12 4v16m8-8H4"
								/>
							</svg>
							Add to Track
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
