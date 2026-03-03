<script setup lang="ts">
interface Stem {
	id: string;
	name: string;
	type: "vocals" | "drums" | "bass" | "other" | "piano";
	icon: string;
	color: string;
	volume: number;
	muted: boolean;
	solo: boolean;
	waveform: string;
}

const isProcessing = ref(false);
const progress = ref(0);
const uploadedAudio = ref<File | null>(null);
const separationQuality = ref("high");
const stems = ref<Stem[]>([]);
const showAdvancedSettings = ref(false);
const selectedAlgorithm = ref("spleeter");

const mockStems: Stem[] = [
	{
		id: "1",
		name: "Vocals",
		type: "vocals",
		icon: "mdi:microphone",
		color: "#FF5733",
		volume: 100,
		muted: false,
		solo: false,
		waveform: "/waveforms/vocals.png",
	},
	{
		id: "2",
		name: "Drums",
		type: "drums",
		icon: "mdi:drum",
		color: "#33FF57",
		volume: 100,
		muted: false,
		solo: false,
		waveform: "/waveforms/drums.png",
	},
	{
		id: "3",
		name: "Bass",
		type: "bass",
		icon: "mdi:guitar-electric",
		color: "#3357FF",
		volume: 100,
		muted: false,
		solo: false,
		waveform: "/waveforms/bass.png",
	},
	{
		id: "4",
		name: "Other",
		type: "other",
		icon: "mdi:music",
		color: "#FF33F5",
		volume: 100,
		muted: false,
		solo: false,
		waveform: "/waveforms/other.png",
	},
];

function handleFileUpload(event: Event) {
	const input = event.target as HTMLInputElement;
	if (input.files?.[0]) {
		uploadedAudio.value = input.files[0];
		startSeparation();
	}
}

function startSeparation() {
	isProcessing.value = true;
	progress.value = 0;

	const interval = setInterval(() => {
		progress.value += 5;
		if (progress.value >= 100) {
			clearInterval(interval);
			isProcessing.value = false;
			stems.value = mockStems;
		}
	}, 200);
}

function toggleMute(stemId: string) {
	const stem = stems.value.find(s => s.id === stemId);
	if (stem) stem.muted = !stem.muted;
}

function toggleSolo(stemId: string) {
	const stem = stems.value.find(s => s.id === stemId);
	if (stem) {
		stem.solo = !stem.solo;
		stems.value.forEach(s => {
			if (s.id !== stemId) s.muted = stem.solo;
		});
	}
}

function downloadStem(stem: Stem) {
	alert(`Downloading ${stem.name} stem...`);
}

function downloadAllStems() {
	alert("Downloading all stems as ZIP...");
}
</script>

<template>
	<div class="stem-separation">
		<h2 class="text-2xl font-bold mb-4">
			<Icon name="mdi:album" class="mr-2" />
			Stem Separation
		</h2>
		<p class="text-gray-500 mb-6">
			Isolate vocals, drums, bass, instruments from mixed audio
		</p>

		<!-- Upload -->
		<div
			v-if="!uploadedAudio && !isProcessing && stems.length === 0"
			class="upload-section mb-6"
		>
			<div class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
				<Icon name="mdi:music-box" class="text-6xl text-gray-400 mb-4" />
				<p class="text-lg mb-4">Upload audio to separate stems</p>
				<p class="text-sm text-gray-500 mb-4">
					Supports MP3, WAV, FLAC, OGG, M4A
				</p>
				<label class="cursor-pointer">
					<input
						type="file"
						accept="audio/*"
						class="hidden"
						@change="handleFileUpload"
					/>
					<span
						class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block"
					>
						Select Audio File
					</span>
				</label>
			</div>
		</div>

		<!-- Processing -->
		<div v-if="isProcessing" class="processing-section text-center py-12">
			<Icon
				name="mdi:waveform"
				class="text-6xl text-blue-500 animate-pulse mb-4"
			/>
			<p class="text-lg mb-4">AI is separating audio stems...</p>
			<div class="w-full max-w-md mx-auto bg-gray-200 rounded-full h-4 mb-4">
				<div
					class="bg-blue-600 h-4 rounded-full transition-all"
					:style="{ width: `${progress}%` }"
				/>
			</div>
			<p class="text-sm text-gray-500">{{ progress }}% complete</p>
			<div class="mt-4 text-sm text-gray-500">
				<p>
					Analyzing: Frequency spectrum, Harmonic content, Transients, Stereo
					field
				</p>
			</div>
		</div>

		<!-- Settings Panel -->
		<div v-if="uploadedAudio && !isProcessing" class="settings-panel mb-6">
			<div class="bg-gray-50 rounded-lg p-4">
				<div class="flex items-center justify-between mb-4">
					<h3 class="font-semibold">Separation Settings</h3>
					<button
						@click="showAdvancedSettings = !showAdvancedSettings"
						class="text-blue-600 text-sm hover:underline"
					>
						{{ showAdvancedSettings ? "Hide" : "Show" }} Advanced
					</button>
				</div>

				<div class="grid grid-cols-3 gap-4">
					<div>
						<label class="block text-sm mb-1">Quality</label>
						<select
							v-model="separationQuality"
							class="w-full border rounded px-3 py-2"
						>
							<option value="fast">Fast (Lower Quality)</option>
							<option value="high">High Quality</option>
							<option value="maximum">Maximum (Slowest)</option>
						</select>
					</div>
					<div>
						<label class="block text-sm mb-1">Output Format</label>
						<select class="w-full border rounded px-3 py-2">
							<option>WAV (Lossless)</option>
							<option>FLAC (Compressed)</option>
							<option>MP3 320kbps</option>
						</select>
					</div>
					<div>
						<label class="block text-sm mb-1">Stem Count</label>
						<select class="w-full border rounded px-3 py-2">
							<option>2 Stems (Vocals + Other)</option>
							<option>4 Stems (Vocals, Drums, Bass, Other)</option>
							<option>5 Stems (+ Piano)</option>
						</select>
					</div>
				</div>

				<div v-if="showAdvancedSettings" class="mt-4 grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm mb-1">Algorithm</label>
						<select
							v-model="selectedAlgorithm"
							class="w-full border rounded px-3 py-2"
						>
							<option value="spleeter">Spleeter (Deezer)</option>
							<option value="demucs">Demucs (Meta)</option>
							<option value="openunmix">OpenUnmix</option>
							<option value="custom">Custom Model</option>
						</select>
					</div>
					<div>
						<label class="block text-sm mb-1">GPU Acceleration</label>
						<select class="w-full border rounded px-3 py-2">
							<option>Auto-detect</option>
							<option>CUDA (NVIDIA)</option>
							<option>ROCm (AMD)</option>
							<option>CPU Only</option>
						</select>
					</div>
				</div>
			</div>
		</div>

		<!-- Stems Mixer -->
		<div v-if="stems.length > 0" class="stems-mixer">
			<div class="flex items-center justify-between mb-4">
				<h3 class="font-semibold">Stem Mixer</h3>
				<button
					@click="downloadAllStems"
					class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
				>
					<Icon name="mdi:download" class="mr-1" />
					Download All Stems
				</button>
			</div>

			<div class="space-y-3">
				<div
					v-for="stem in stems"
					:key="stem.id"
					class="stem-track flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
				>
					<!-- Stem Info -->
					<div class="flex items-center gap-3 w-32">
						<div
							class="w-10 h-10 rounded flex items-center justify-center"
							:style="{ backgroundColor: stem.color + '20' }"
						>
							<Icon :name="stem.icon" :style="{ color: stem.color }" />
						</div>
						<span class="font-medium">{{ stem.name }}</span>
					</div>

					<!-- Waveform -->
					<div class="flex-1 h-16 bg-gray-200 rounded overflow-hidden relative">
						<img
							:src="stem.waveform"
							class="w-full h-full object-cover opacity-50"
						/>
						<div class="absolute inset-0 flex items-center justify-center">
							<Icon name="mdi:waveform" class="text-gray-400" />
						</div>
					</div>

					<!-- Controls -->
					<div class="flex items-center gap-3 w-48">
						<button
							@click="toggleMute(stem.id)"
							class="p-2 rounded"
							:class="stem.muted ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200'"
						>
							<Icon :name="stem.muted ? 'mdi:volume-off' : 'mdi:volume-high'" />
						</button>
						<button
							@click="toggleSolo(stem.id)"
							class="p-2 rounded text-sm font-bold"
							:class="stem.solo
							? 'bg-yellow-100 text-yellow-700'
							: 'hover:bg-gray-200'"
						>
							S
						</button>
						<div class="flex-1">
							<input
								v-model="stem.volume"
								type="range"
								min="0"
								max="100"
								class="w-full"
							/>
						</div>
						<span class="text-sm w-8">{{ stem.volume }}%</span>
					</div>

					<!-- Download -->
					<button
						@click="downloadStem(stem)"
						class="p-2 hover:bg-gray-200 rounded"
					>
						<Icon name="mdi:download" />
					</button>
				</div>
			</div>

			<!-- Master Controls -->
			<div class="mt-4 bg-gray-800 text-white rounded-lg p-4">
				<div class="flex items-center gap-4">
					<div class="flex items-center gap-2">
						<Icon name="mdi:music" class="text-xl" />
						<span class="font-medium">Master</span>
					</div>
					<div class="flex-1 flex items-center gap-2">
						<span class="text-sm">L</span>
						<div class="flex-1 h-8 bg-gray-700 rounded overflow-hidden">
							<div class="h-full bg-green-500" style="width: 70%"></div>
						</div>
						<div class="flex-1 h-8 bg-gray-700 rounded overflow-hidden">
							<div class="h-full bg-green-500" style="width: 65%"></div>
						</div>
						<span class="text-sm">R</span>
					</div>
					<div class="w-32">
						<input type="range" min="0" max="100" value="100" class="w-full" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.stem-separation {
	padding: 1.5rem;
}

.stem-track {
	transition: all 0.2s;
}
</style>
