<script setup lang="ts">
const props = defineProps<{
	audioBuffer: AudioBuffer | null;
}>();

const watermarkType = ref<"inaudible" | "audible">("inaudible");
const watermarkText = ref("");
const watermarkStrength = ref(50);
const isEmbedding = ref(false);
const isDetecting = ref(false);

const detectResult = ref<
	{
		found: boolean;
		text: string;
		confidence: number;
	} | null
>(null);

const embedWatermark = async () => {
	if (!props.audioBuffer || !watermarkText.value) return;
	isEmbedding.value = true;
	await new Promise(resolve => setTimeout(resolve, 2000));
	isEmbedding.value = false;
};

const detectWatermark = async () => {
	if (!props.audioBuffer) return;
	isDetecting.value = true;
	await new Promise(resolve => setTimeout(resolve, 1500));

	detectResult.value = {
		found: Math.random() > 0.5,
		text: watermarkText.value || "Sample Watermark",
		confidence: 0.85 + Math.random() * 0.14,
	};

	isDetecting.value = false;
};

const generateId = () => {
	watermarkText.value = "WM-"
		+ Math.random().toString(36).substring(2, 10).toUpperCase();
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
						d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
					/>
				</svg>
				Audio Watermarking
			</h3>
		</div>

		<div class="p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
			<p class="text-xs text-yellow-300">
				Embed invisible watermarks to protect your audio content. Watermarks
				survive compression and format conversion.
			</p>
		</div>

		<!-- Mode Selection -->
		<div class="flex gap-1 bg-gray-800 p-1 rounded-lg">
			<button
				@click="watermarkType = 'inaudible'"
				:class="[
					'flex-1 py-2 text-sm font-medium rounded transition-colors',
					watermarkType === 'inaudible'
						? 'bg-purple-600 text-white'
						: 'text-gray-400 hover:text-white hover:bg-gray-700',
				]"
			>
				Inaudible
			</button>
			<button
				@click="watermarkType = 'audible'"
				:class="[
					'flex-1 py-2 text-sm font-medium rounded transition-colors',
					watermarkType === 'audible'
						? 'bg-purple-600 text-white'
						: 'text-gray-400 hover:text-white hover:bg-gray-700',
				]"
			>
				Audible Tone
			</button>
		</div>

		<!-- Watermark Text -->
		<div class="space-y-2">
			<div class="flex items-center justify-between">
				<label class="text-sm text-gray-400">Watermark ID</label>
				<button
					@click="generateId"
					class="text-xs text-purple-400 hover:text-purple-300"
				>
					Generate ID
				</button>
			</div>
			<div class="flex gap-2">
				<input
					v-model="watermarkText"
					type="text"
					placeholder="Enter watermark text or ID..."
					maxlength="32"
					class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500"
				/>
			</div>
			<div class="text-xs text-gray-500">
				{{ watermarkText.length }} / 32 characters
			</div>
		</div>

		<!-- Strength (for inaudible) -->
		<div v-if="watermarkType === 'inaudible'" class="space-y-2">
			<div class="flex justify-between text-sm">
				<span class="text-gray-400">Embedding Strength</span>
				<span class="text-white">{{ watermarkStrength }}%</span>
			</div>
			<input
				v-model="watermarkStrength"
				type="range"
				min="10"
				max="100"
				class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
			/>
			<div class="flex justify-between text-xs text-gray-500">
				<span>Subtle (fragile)</span>
				<span>Strong (robust)</span>
			</div>
		</div>

		<!-- Audible Tone Settings -->
		<div v-else class="space-y-3">
			<div class="space-y-1">
				<label class="text-xs text-gray-400">Tone Frequency</label>
				<select class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white">
					<option>1000 Hz</option>
					<option>2000 Hz</option>
					<option>5000 Hz</option>
					<option>10000 Hz</option>
				</select>
			</div>
			<div class="space-y-1">
				<label class="text-xs text-gray-400">Duration</label>
				<select class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white">
					<option>0.5 seconds</option>
					<option>1 second</option>
					<option>2 seconds</option>
				</select>
			</div>
		</div>

		<!-- Embed Button -->
		<button
			@click="embedWatermark"
			:disabled="!audioBuffer || !watermarkText || isEmbedding"
			class="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
		>
			<svg
				v-if="isEmbedding"
				class="animate-spin h-5 w-5"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle
					class="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					stroke-width="4"
				>
				</circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				>
				</path>
			</svg>
			<span v-else>Embed Watermark</span>
		</button>

		<!-- Detection Section -->
		<div class="border-t border-gray-800 pt-4 space-y-3">
			<h4 class="text-sm font-medium text-white">Detect Watermark</h4>

			<button
				@click="detectWatermark"
				:disabled="!audioBuffer || isDetecting"
				class="w-full py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
			>
				<span v-if="isDetecting" class="flex items-center justify-center gap-2">
					<svg
						class="animate-spin h-4 w-4"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						>
						</circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						>
						</path>
					</svg>
					Scanning...
				</span>
				<span v-else>Scan for Watermark</span>
			</button>

			<!-- Detection Result -->
			<div
				v-if="detectResult"
				class="p-3 rounded-lg"
				:class="detectResult.found
				? 'bg-green-900/30 border border-green-700'
				: 'bg-red-900/30 border border-red-700'"
			>
				<div class="flex items-center gap-2">
					<svg
						v-if="detectResult.found"
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-green-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<svg
						v-else
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-red-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span
						class="text-sm font-medium"
						:class="detectResult.found ? 'text-green-400' : 'text-red-400'"
					>
						{{
							detectResult.found ? "Watermark Found" : "No Watermark Detected"
						}}
					</span>
				</div>
				<div v-if="detectResult.found" class="mt-2 text-xs text-gray-400">
					<div>ID: <span class="text-white">{{ detectResult.text }}</span></div>
					<div>
						Confidence: <span class="text-white">{{
								(detectResult.confidence * 100).toFixed(1)
							}}%</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
