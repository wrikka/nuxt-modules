<script setup lang="ts">
interface MidiTrack {
	id: string;
	name: string;
	instrument: string;
	isArmed: boolean;
}

const props = defineProps<{
	midiTracks: MidiTrack[];
}>();

const selectedTrack = ref("");
const renderingFormat = ref<"wav" | "flac" | "mp3">("wav");
const sampleRate = ref(48000);
const bitDepth = ref(24);
const renderRange = ref<"loop" | "selection" | "all">("all");
const isRendering = ref(false);
const renderProgress = ref(0);

const instruments = [
	{ id: "piano", name: "Grand Piano" },
	{ id: "epiano", name: "Electric Piano" },
	{ id: "synth", name: "Synthesizer" },
	{ id: "bass", name: "Bass Guitar" },
	{ id: "strings", name: "String Section" },
	{ id: "brass", name: "Brass Section" },
	{ id: "drums", name: "Drum Kit" },
	{ id: "percussion", name: "Percussion" },
] as const;

const renderMidi = async () => {
	if (!selectedTrack.value) return;

	isRendering.value = true;
	renderProgress.value = 0;

	// Simulate rendering
	for (let i = 0; i <= 100; i += 5) {
		renderProgress.value = i;
		await new Promise(resolve => setTimeout(resolve, 100));
	}

	isRendering.value = false;
};

const previewInstrument = () => {
	console.log("Previewing instrument");
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
						d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
					/>
				</svg>
				MIDI to Audio Render
			</h3>
		</div>

		<div class="p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
			<p class="text-xs text-blue-300">
				Convert MIDI tracks to rendered audio using virtual instruments. This
				freezes the MIDI data into an audio clip.
			</p>
		</div>

		<!-- MIDI Track Selection -->
		<div class="space-y-2">
			<label class="text-sm text-gray-400">MIDI Track</label>
			<select
				v-model="selectedTrack"
				class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
			>
				<option value="">Select a MIDI track...</option>
				<option v-for="track in midiTracks" :key="track.id" :value="track.id">
					{{ track.name }} ({{ track.instrument }})
				</option>
			</select>
		</div>

		<!-- Instrument -->
		<div class="space-y-2">
			<label class="text-sm text-gray-400">Virtual Instrument</label>
			<div class="flex gap-2">
				<select class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white">
					<option v-for="inst in instruments" :key="inst.id" :value="inst.id">
						{{ inst.name }}
					</option>
				</select>
				<button
					@click="previewInstrument"
					class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path d="M8 5v14l11-7z" />
					</svg>
				</button>
			</div>
		</div>

		<!-- Render Range -->
		<div class="space-y-2">
			<label class="text-sm text-gray-400">Render Range</label>
			<div class="flex gap-1 bg-gray-800 p-1 rounded-lg">
				<button
					v-for='range in [
						{ id: "loop", label: "Loop" },
						{ id: "selection", label: "Selection" },
						{ id: "all", label: "All" },
					] as const'
					:key="range.id"
					@click="renderRange = range.id"
					:class="[
						'flex-1 py-2 text-sm font-medium rounded transition-colors',
						renderRange === range.id
							? 'bg-purple-600 text-white'
							: 'text-gray-400 hover:text-white hover:bg-gray-700',
					]"
				>
					{{ range.label }}
				</button>
			</div>
		</div>

		<!-- Format Settings -->
		<div class="space-y-2">
			<label class="text-sm text-gray-400">Output Format</label>
			<div class="grid grid-cols-2 gap-3">
				<select
					v-model="renderingFormat"
					class="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
				>
					<option value="wav">WAV</option>
					<option value="flac">FLAC</option>
					<option value="mp3">MP3</option>
				</select>
				<select
					v-model="sampleRate"
					class="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
				>
					<option :value="44100">44.1 kHz</option>
					<option :value="48000">48 kHz</option>
					<option :value="88200">88.2 kHz</option>
					<option :value="96000">96 kHz</option>
				</select>
			</div>
		</div>

		<!-- Bit Depth (for WAV/FLAC) -->
		<div v-if="renderingFormat !== 'mp3'" class="space-y-2">
			<label class="text-sm text-gray-400">Bit Depth</label>
			<div class="flex gap-1 bg-gray-800 p-1 rounded-lg">
				<button
					v-for="depth in [16, 24, 32]"
					:key="depth"
					@click="bitDepth = depth"
					:class="[
						'flex-1 py-2 text-sm font-medium rounded transition-colors',
						bitDepth === depth
							? 'bg-purple-600 text-white'
							: 'text-gray-400 hover:text-white hover:bg-gray-700',
					]"
				>
					{{ depth }}-bit
				</button>
			</div>
		</div>

		<!-- Progress -->
		<div v-if="isRendering" class="space-y-2">
			<div class="flex justify-between text-sm">
				<span class="text-white">Rendering MIDI...</span>
				<span class="text-purple-400">{{ renderProgress }}%</span>
			</div>
			<div class="h-2 bg-gray-700 rounded-full overflow-hidden">
				<div
					class="h-full bg-purple-600 transition-all duration-100"
					:style="{ width: `${renderProgress}%` }"
				>
				</div>
			</div>
		</div>

		<!-- Render Button -->
		<button
			@click="renderMidi"
			:disabled="!selectedTrack || isRendering"
			class="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
		>
			<svg
				v-if="!isRendering"
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
					d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			Render to Audio
		</button>
	</div>
</template>
