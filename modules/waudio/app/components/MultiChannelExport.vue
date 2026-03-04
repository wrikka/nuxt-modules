<script setup lang="ts">
interface ExportFormat {
	id: string;
	name: string;
	extension: string;
	selected: boolean;
	settings: {
		bitrate?: number;
		sampleRate: number;
		bitDepth?: number;
	};
}

const props = defineProps<{
	audioBuffer: AudioBuffer | null;
	projectName: string;
}>();

const isExporting = ref(false);
const exportProgress = ref(0);
const currentFormat = ref("");

const formats = ref<ExportFormat[]>([
	{
		id: "wav",
		name: "WAV (Lossless)",
		extension: "wav",
		selected: true,
		settings: { sampleRate: 48000, bitDepth: 24 },
	},
	{
		id: "mp3",
		name: "MP3 (Compressed)",
		extension: "mp3",
		selected: true,
		settings: { sampleRate: 48000, bitrate: 320 },
	},
	{
		id: "flac",
		name: "FLAC (Lossless)",
		extension: "flac",
		selected: false,
		settings: { sampleRate: 48000 },
	},
	{
		id: "ogg",
		name: "OGG Vorbis",
		extension: "ogg",
		selected: false,
		settings: { sampleRate: 48000, bitrate: 256 },
	},
	{
		id: "m4a",
		name: "M4A (AAC)",
		extension: "m4a",
		selected: false,
		settings: { sampleRate: 48000, bitrate: 256 },
	},
	{
		id: "aiff",
		name: "AIFF (Lossless)",
		extension: "aiff",
		selected: false,
		settings: { sampleRate: 48000, bitDepth: 24 },
	},
]);

const selectedFormats = computed(() => formats.value.filter(f => f.selected));
const outputFolder = ref("");

const toggleFormat = (format: ExportFormat) => {
	format.selected = !format.selected;
};

const selectOutputFolder = async () => {
	// In real implementation, this would use electron or browser file picker
	outputFolder.value = "/exports/audio-project";
};

const startExport = async () => {
	if (!props.audioBuffer || selectedFormats.value.length === 0) return;

	isExporting.value = true;
	exportProgress.value = 0;

	const totalFormats = selectedFormats.value.length;

	for (let i = 0; i < totalFormats; i++) {
		currentFormat.value = selectedFormats.value[i]!.name;
		const progressPerFormat = 100 / totalFormats;

		for (let p = 0; p <= 100; p += 10) {
			exportProgress.value = (i * progressPerFormat)
				+ (p / 100 * progressPerFormat);
			await new Promise(resolve => setTimeout(resolve, 50));
		}
	}

	isExporting.value = false;
	currentFormat.value = "";
};

const selectAll = () => {
	formats.value.forEach(f => f.selected = true);
};

const deselectAll = () => {
	formats.value.forEach(f => f.selected = false);
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
						d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
					/>
				</svg>
				Multi-Channel Export
			</h3>
			<span class="text-sm text-gray-400">{{ selectedFormats.length }} formats
				selected</span>
		</div>

		<!-- Format Selection -->
		<div class="space-y-2">
			<div class="flex items-center justify-between">
				<span class="text-xs text-gray-400">Export Formats</span>
				<div class="flex gap-2">
					<button
						@click="selectAll"
						class="text-xs text-purple-400 hover:text-purple-300"
					>
						All
					</button>
					<span class="text-gray-600">|</span>
					<button
						@click="deselectAll"
						class="text-xs text-purple-400 hover:text-purple-300"
					>
						None
					</button>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-2">
				<div
					v-for="format in formats"
					:key="format.id"
					@click="toggleFormat(format)"
					:class="[
						'p-3 rounded-lg cursor-pointer transition-colors border',
						format.selected
							? 'bg-purple-900/30 border-purple-600'
							: 'bg-gray-800 border-gray-700 hover:border-gray-600',
					]"
				>
					<div class="flex items-center gap-2">
						<input
							type="checkbox"
							:checked="format.selected"
							class="rounded border-gray-600 text-purple-500 focus:ring-purple-500"
							@click.stop
							@change="toggleFormat(format)"
						/>
						<div class="flex-1">
							<div class="text-sm font-medium text-white">
								{{ format.name }}
							</div>
							<div class="text-xs text-gray-500">
								{{ format.settings.sampleRate / 1000 }}kHz
								<span v-if="format.settings.bitrate"
								>• {{ format.settings.bitrate }}kbps</span>
								<span v-if="format.settings.bitDepth"
								>• {{ format.settings.bitDepth }}bit</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Output Folder -->
		<div class="space-y-2">
			<label class="text-xs text-gray-400">Output Location</label>
			<div class="flex gap-2">
				<input
					v-model="outputFolder"
					type="text"
					placeholder="Select output folder..."
					class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
					readonly
				/>
				<button
					@click="selectOutputFolder"
					class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
				>
					Browse
				</button>
			</div>
		</div>

		<!-- Export Preview -->
		<div class="p-3 bg-gray-800 rounded-lg space-y-2">
			<div class="text-xs text-gray-400">Files to be created:</div>
			<div class="space-y-1 max-h-32 overflow-y-auto">
				<div
					v-for="format in selectedFormats"
					:key="format.id"
					class="flex items-center gap-2 text-sm"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 text-purple-400"
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
					<span class="text-gray-300">{{ projectName }}.{{
							format.extension
						}}</span>
				</div>
				<div
					v-if="selectedFormats.length === 0"
					class="text-sm text-gray-500 italic"
				>
					Select at least one format
				</div>
			</div>
		</div>

		<!-- Progress -->
		<div v-if="isExporting" class="space-y-2">
			<div class="flex justify-between text-sm">
				<span class="text-white">Exporting {{ currentFormat }}...</span>
				<span class="text-purple-400">{{ Math.round(exportProgress) }}%</span>
			</div>
			<div class="h-2 bg-gray-700 rounded-full overflow-hidden">
				<div
					class="h-full bg-purple-600 transition-all duration-100"
					:style="{ width: `${exportProgress}%` }"
				>
				</div>
			</div>
		</div>

		<!-- Export Button -->
		<button
			@click="startExport"
			:disabled="!audioBuffer || selectedFormats.length === 0 || isExporting
			|| !outputFolder"
			class="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
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
					d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
				/>
			</svg>
			Export {{ selectedFormats.length }} Format{{
				selectedFormats.length !== 1 ? "s" : ""
			}}
		</button>
	</div>
</template>
