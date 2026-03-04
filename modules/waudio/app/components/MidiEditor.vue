<script setup lang="ts">
import type { MidiNote, MidiTrack } from "#shared/types/audio";
import { nanoid } from "nanoid";

const props = defineProps<{
	tracks: MidiTrack[];
}>();

const emit = defineEmits<{
	addTrack: [track: MidiTrack];
	updateTrack: [trackId: string, notes: MidiNote[]];
	deleteTrack: [trackId: string];
}>();

const selectedTrackId = ref<string | null>(null);
const selectedInstrument = ref("piano");
const isRecording = ref(false);

const instruments = [
	{ value: "piano", label: "Grand Piano" },
	{ value: "electric_piano", label: "Electric Piano" },
	{ value: "synth", label: "Synthesizer" },
	{ value: "bass", label: "Bass Guitar" },
	{ value: "strings", label: "Strings" },
	{ value: "drums", label: "Drum Kit" },
	{ value: "organ", label: "Organ" },
	{ value: "brass", label: "Brass" },
];

const addMidiTrack = () => {
	const track: MidiTrack = {
		id: nanoid(),
		name: `MIDI Track ${props.tracks.length + 1}`,
		instrument: selectedInstrument.value,
		notes: [],
		volume: 1,
	};

	emit("addTrack", track);
	selectedTrackId.value = track.id;
};

const deleteTrack = (trackId: string) => {
	emit("deleteTrack", trackId);
	if (selectedTrackId.value === trackId) {
		selectedTrackId.value = null;
	}
};

const selectedTrack = computed(() => {
	return props.tracks.find(t => t.id === selectedTrackId.value);
});

// Piano roll display
const octaves = [1, 2, 3, 4, 5, 6, 7];
const notesPerOctave = 12;
const noteNames = [
	"C",
	"C#",
	"D",
	"D#",
	"E",
	"F",
	"F#",
	"G",
	"G#",
	"A",
	"A#",
	"B",
];

const getNoteLabel = (octave: number, noteIndex: number): string => {
	return `${noteNames[noteIndex]}${octave}`;
};

const getNoteColor = (noteIndex: number): string => {
	// White keys vs black keys
	const isBlackKey = [1, 3, 6, 8, 10].includes(noteIndex);
	return isBlackKey ? "#374151" : "#4b5563";
};

const formatDuration = (beats: number): string => {
	const bars = Math.floor(beats / 4);
	const remaining = beats % 4;
	return `${bars}.${remaining.toFixed(1)}`;
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium"
			>MIDI Editor / Piano Roll</span>
			<div class="flex items-center gap-2">
				<span v-if="props.tracks.length" class="text-xs text-gray-500">{{
						props.tracks.length
					}} track(s)</span>
			</div>
		</div>

		<!-- Add Track -->
		<div class="flex items-center gap-2 mb-4">
			<select
				v-model="selectedInstrument"
				class="flex-1 bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700"
			>
				<option
					v-for="inst in instruments"
					:key="inst.value"
					:value="inst.value"
				>
					{{ inst.label }}
				</option>
			</select>
			<button
				@click="addMidiTrack"
				class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
			>
				Add Track
			</button>
		</div>

		<!-- Track List -->
		<div v-if="props.tracks.length > 0" class="space-y-2 mb-4">
			<div
				v-for="track in props.tracks"
				:key="track.id"
				class="flex items-center gap-2 p-2 rounded cursor-pointer"
				:class="selectedTrackId === track.id
				? 'bg-blue-900/30 border border-blue-700'
				: 'bg-gray-800 hover:bg-gray-700'"
				@click="selectedTrackId = track.id"
			>
				<div
					class="w-3 h-3 rounded"
					:style="{
						backgroundColor: track.instrument === 'drums'
							? '#f97316'
							: '#3b82f6',
					}"
				/>
				<span class="flex-1 text-sm text-gray-300">{{ track.name }}</span>
				<span class="text-xs text-gray-500 capitalize">{{
					track.instrument
				}}</span>
				<span class="text-xs text-gray-500">{{ track.notes.length }}
					notes</span>
				<button
					@click.stop="deleteTrack(track.id)"
					class="p-1 text-gray-400 hover:text-red-400"
				>
					<svg
						class="w-4 h-4"
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
		</div>

		<!-- Piano Roll -->
		<div v-if="selectedTrack" class="bg-gray-800 rounded p-2">
			<div class="flex items-center justify-between mb-2">
				<span class="text-gray-400 text-xs">Piano Roll - {{
						selectedTrack.name
					}}</span>
				<div class="flex items-center gap-2">
					<button
						@click="isRecording = !isRecording"
						:class="[
							'px-2 py-1 rounded text-xs transition-colors',
							isRecording
								? 'bg-red-600 text-white animate-pulse'
								: 'bg-gray-700 text-gray-300',
						]"
					>
						{{ isRecording ? "Recording..." : "Record" }}
					</button>
				</div>
			</div>

			<!-- Simplified piano keyboard display -->
			<div class="h-48 overflow-y-auto bg-gray-900 rounded">
				<div
					v-for="octave in octaves.slice().reverse()"
					:key="octave"
					class="flex"
				>
					<div
						v-for="(noteName, noteIndex) in noteNames"
						:key="noteIndex"
						class="flex-1 h-8 border-b border-gray-800 flex items-center px-2"
						:style="{ backgroundColor: getNoteColor(noteIndex) }"
					>
						<span
							class="text-xs"
							:class="[1, 3, 6, 8, 10].includes(noteIndex)
							? 'text-gray-400'
							: 'text-gray-300'"
						>
							{{ noteName }}{{ octave }}
						</span>
					</div>
				</div>
			</div>

			<!-- Notes list -->
			<div
				v-if="selectedTrack.notes.length > 0"
				class="mt-2 max-h-32 overflow-y-auto"
			>
				<div
					v-for="(note, i) in selectedTrack.notes"
					:key="note.id"
					class="flex items-center gap-2 text-xs p-1 hover:bg-gray-700"
				>
					<span class="text-gray-400 w-8">{{ i + 1 }}</span>
					<span class="text-gray-300">Pitch: {{ note.pitch }}</span>
					<span class="text-gray-500">Velocity: {{ note.velocity }}</span>
					<span class="text-gray-500">Duration: {{
							formatDuration(note.duration)
						}}</span>
				</div>
			</div>
			<div v-else class="text-center text-xs text-gray-500 py-4">
				Click piano keys to add notes, or click Record to capture MIDI input
			</div>
		</div>

		<!-- Info -->
		<p
			v-if="props.tracks.length === 0"
			class="text-xs text-gray-500 text-center py-4"
		>
			Add a MIDI track to start composing with virtual instruments
		</p>
	</div>
</template>
