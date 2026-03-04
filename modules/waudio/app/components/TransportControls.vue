<script setup lang="ts">
const {
	isPlaying,
	currentTime,
	duration,
	bpm,
	timeSignature,
	snapToGrid,
	metronomeSettings,
	formatTime,
	playMultiTrack,
	stopMultiTrack,
	setBPM,
	setTimeSignature,
	toggleSnapToGrid,
} = useAudioEditor();

const handlePlayMultiTrack = async () => {
	await playMultiTrack();
};

const handleStopMultiTrack = () => {
	stopMultiTrack();
};

const handleBPMChange = (event: Event) => {
	const target = event.target as HTMLInputElement;
	const value = parseInt(target.value);
	if (!isNaN(value) && value >= 20 && value <= 300) {
		setBPM(value);
	}
};

const handleTimeSignatureChange = (event: Event) => {
	const target = event.target as HTMLSelectElement;
	setTimeSignature(parseInt(target.value), timeSignature.value.denominator);
};

const handleDenominatorChange = (event: Event) => {
	const target = event.target as HTMLSelectElement;
	setTimeSignature(timeSignature.value.numerator, parseInt(target.value));
};

const handleToggleSnapToGrid = () => {
	toggleSnapToGrid();
};

const handleToggleMetronome = () => {
	metronomeSettings.value.enabled = !metronomeSettings.value.enabled;
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 px-4 py-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<span class="text-gray-400 text-sm font-medium">Transport</span>
				<button
					@click="handlePlayMultiTrack"
					:class="[
						'flex items-center gap-1 px-3 py-1.5 rounded transition-colors text-sm font-medium',
						isPlaying
							? 'bg-orange-600 hover:bg-orange-700'
							: 'bg-green-600 hover:bg-green-700',
					]"
					title="Play/Pause"
				>
					<svg
						v-if="!isPlaying"
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
							d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<svg
						v-else
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
							d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					{{ isPlaying ? "Pause" : "Play" }}
				</button>
				<button
					@click="handleStopMultiTrack"
					class="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors text-sm font-medium"
					title="Stop"
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
							d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
						/>
					</svg>
					Stop
				</button>
				<div class="flex items-center gap-2 bg-gray-800 rounded px-3 py-1.5">
					<span class="text-white text-sm font-mono">{{
						formatTime(currentTime)
					}}</span>
					<span class="text-gray-500 text-sm">/</span>
					<span class="text-gray-400 text-sm font-mono">{{
						formatTime(duration)
					}}</span>
				</div>
			</div>
			<div class="flex items-center gap-4">
				<div class="flex items-center gap-2">
					<label class="text-gray-400 text-xs">BPM</label>
					<input
						:value="bpm"
						@input="handleBPMChange"
						type="number"
						min="20"
						max="300"
						class="w-16 bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-700 focus:border-blue-500 focus:outline-none"
					>
				</div>
				<div class="flex items-center gap-2">
					<label class="text-gray-400 text-xs">Time Sig</label>
					<select
						:value="timeSignature.numerator"
						@change="handleTimeSignatureChange"
						class="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-700 focus:border-blue-500 focus:outline-none"
					>
						<option v-for="n in [2, 3, 4, 5, 6, 7]" :key="n" :value="n">
							{{ n }}
						</option>
					</select>
					<span class="text-gray-400 text-sm">/</span>
					<select
						:value="timeSignature.denominator"
						@change="handleDenominatorChange"
						class="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-700 focus:border-blue-500 focus:outline-none"
					>
						<option v-for="d in [2, 4, 8, 16]" :key="d" :value="d">
							{{ d }}
						</option>
					</select>
				</div>
				<button
					@click="handleToggleSnapToGrid"
					:class="[
						'flex items-center gap-1 px-2 py-1 rounded transition-colors text-xs',
						snapToGrid
							? 'bg-blue-600 hover:bg-blue-700 text-white'
							: 'bg-gray-700 hover:bg-gray-600 text-gray-300',
					]"
					title="Snap to Grid"
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
							d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
						/>
					</svg>
					Snap
				</button>
				<button
					@click="handleToggleMetronome"
					:class="[
						'flex items-center gap-1 px-2 py-1 rounded transition-colors text-xs',
						metronomeSettings.enabled
							? 'bg-purple-600 hover:bg-purple-700 text-white'
							: 'bg-gray-700 hover:bg-gray-600 text-gray-300',
					]"
					title="Metronome"
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
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					Metro
				</button>
			</div>
		</div>
	</div>
</template>
