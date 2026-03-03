<script setup lang="ts">
const props = defineProps<{
	audioContext: AudioContext | null;
}>();

const visualizationType = ref<
	"waveform" | "spectrum" | "circular" | "particles"
>("waveform");
const colorScheme = ref<"purple" | "rainbow" | "fire" | "ocean">("purple");
const sensitivity = ref(75);
const smoothing = ref(50);
const isPlaying = ref(false);

const presets = [
	{
		name: "Classic Waveform",
		type: "waveform",
		color: "purple",
		sensitivity: 75,
	},
	{
		name: "Colorful Spectrum",
		type: "spectrum",
		color: "rainbow",
		sensitivity: 85,
	},
	{ name: "Neon Circular", type: "circular", color: "fire", sensitivity: 90 },
	{
		name: "Particle Burst",
		type: "particles",
		color: "ocean",
		sensitivity: 70,
	},
];

const applyPreset = (preset: typeof presets[0]) => {
	visualizationType.value = preset.type as any;
	colorScheme.value = preset.color as any;
	sensitivity.value = preset.sensitivity;
};

const togglePlay = () => {
	isPlaying.value = !isPlaying.value;
};

const exportFrame = () => {
	console.log("Exporting visualization frame");
};

const startRecording = () => {
	console.log("Starting visualization recording");
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
						d="M13 10V3L4 14h7v7l9-11h-7z"
					/>
				</svg>
				Audio-Reactive Visuals
			</h3>
			<button
				@click="togglePlay"
				:class="[
					'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
					isPlaying ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400',
				]"
			>
				{{ isPlaying ? "Active" : "Paused" }}
			</button>
		</div>

		<div class="p-3 bg-purple-900/20 border border-purple-800 rounded-lg">
			<p class="text-xs text-purple-300">
				Generate beat-synced visualizations that react to your audio in
				real-time. Perfect for live performances and video content.
			</p>
		</div>

		<!-- Visualization Preview -->
		<div class="relative h-48 bg-gray-800 rounded-lg overflow-hidden">
			<div class="absolute inset-0 flex items-center justify-center">
				<div class="text-center">
					<div class="text-lg font-medium text-white mb-2">
						{{ visualizationType }} View
					</div>
					<div class="text-sm text-gray-500">
						{{ colorScheme }} color scheme
					</div>
				</div>
			</div>

			<!-- Simulated visualization bars -->
			<div class="absolute bottom-0 left-0 right-0 h-full flex items-end justify-around px-4 pb-4">
				<div
					v-for="i in 16"
					:key="i"
					class="w-4 rounded-t transition-all duration-75"
					:class="{
						'bg-purple-500': colorScheme === 'purple',
						'bg-gradient-to-t from-red-500 via-yellow-500 to-green-500':
							colorScheme === 'rainbow',
						'bg-gradient-to-t from-red-600 to-yellow-400':
							colorScheme === 'fire',
						'bg-gradient-to-t from-blue-600 to-cyan-400':
							colorScheme === 'ocean',
					}"
					:style="{
						height: isPlaying ? `${10 + Math.random() * sensitivity}%` : '10%',
					}"
				>
				</div>
			</div>
		</div>

		<!-- Type Selection -->
		<div class="space-y-2">
			<label class="text-sm text-gray-400">Visualization Type</label>
			<div class="grid grid-cols-2 gap-2">
				<button
					v-for='type in [
						{ id: "waveform", label: "Waveform", icon: "wave" },
						{ id: "spectrum", label: "Spectrum", icon: "bars" },
						{ id: "circular", label: "Circular", icon: "circle" },
						{ id: "particles", label: "Particles", icon: "dots" },
					] as const'
					:key="type.id"
					@click="visualizationType = type.id"
					:class="[
						'p-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
						visualizationType === type.id
							? 'bg-purple-600 text-white'
							: 'bg-gray-800 text-gray-400 hover:bg-gray-750',
					]"
				>
					<svg
						v-if="type.icon === 'wave'"
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
							d="M3 12h2l2-9 4 18 4-18 2 9h2"
						/>
					</svg>
					<svg
						v-else-if="type.icon === 'bars'"
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
							d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
						/>
					</svg>
					<svg
						v-else-if="type.icon === 'circle'"
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<circle cx="12" cy="12" r="9" stroke-width="2" />
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
							d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
						/>
					</svg>
					{{ type.label }}
				</button>
			</div>
		</div>

		<!-- Color Scheme -->
		<div class="space-y-2">
			<label class="text-sm text-gray-400">Color Scheme</label>
			<div class="flex gap-2">
				<button
					v-for='color in [
						{ id: "purple", label: "Purple", class: "bg-purple-500" },
						{
							id: "rainbow",
							label: "Rainbow",
							class:
								"bg-gradient-to-r from-red-500 via-yellow-500 to-green-500",
						},
						{
							id: "fire",
							label: "Fire",
							class: "bg-gradient-to-r from-red-600 to-yellow-400",
						},
						{
							id: "ocean",
							label: "Ocean",
							class: "bg-gradient-to-r from-blue-600 to-cyan-400",
						},
					] as const'
					:key="color.id"
					@click="colorScheme = color.id"
					:class="[
						'flex-1 py-2 rounded-lg text-xs font-medium transition-all',
						color.class,
						colorScheme === color.id
							? 'ring-2 ring-white scale-105'
							: 'opacity-70 hover:opacity-100',
					]"
				>
					{{ color.label }}
				</button>
			</div>
		</div>

		<!-- Controls -->
		<div class="space-y-3">
			<div class="space-y-1">
				<div class="flex justify-between text-sm">
					<span class="text-gray-400">Sensitivity</span>
					<span class="text-white">{{ sensitivity }}%</span>
				</div>
				<input
					v-model="sensitivity"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>

			<div class="space-y-1">
				<div class="flex justify-between text-sm">
					<span class="text-gray-400">Smoothing</span>
					<span class="text-white">{{ smoothing }}%</span>
				</div>
				<input
					v-model="smoothing"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>
		</div>

		<!-- Presets -->
		<div class="space-y-2">
			<label class="text-sm text-gray-400">Quick Presets</label>
			<div class="flex flex-wrap gap-2">
				<button
					v-for="preset in presets"
					:key="preset.name"
					@click="applyPreset(preset)"
					class="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
				>
					{{ preset.name }}
				</button>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-2">
			<button
				@click="exportFrame"
				class="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
			>
				Export Frame
			</button>
			<button
				@click="startRecording"
				class="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
			>
				Record Video
			</button>
		</div>
	</div>
</template>
