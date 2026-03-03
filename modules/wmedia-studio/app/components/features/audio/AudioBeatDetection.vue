<script setup lang="ts">
const isOpen = ref(false);
const isAnalyzing = ref(false);
const bpm = ref(128);
const audioDuration = ref(180); // seconds

const beats = ref([
	{ time: 0, intensity: 1 },
	{ time: 0.47, intensity: 0.8 },
	{ time: 0.94, intensity: 0.9 },
	{ time: 1.41, intensity: 1 },
	{ time: 1.88, intensity: 0.7 },
	{ time: 2.35, intensity: 0.85 },
	{ time: 2.82, intensity: 1 },
	{ time: 3.29, intensity: 0.9 },
]);

const analyzeBeats = () => {
	isAnalyzing.value = true;
	setTimeout(() => {
		isAnalyzing.value = false;
	}, 1500);
};

const snapToBeat = () => {
	alert("Elements snapped to nearest beat markers!");
};

const formatTime = (seconds: number) => {
	return seconds.toFixed(2) + "s";
};
</script>

<template>
	<div class="relative">
		<!-- Toggle Button -->
		<button
			class="flex items-center gap-2 px-3 py-2 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
			@click="isOpen = true"
		>
			<svg
				class="w-4 h-4"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
				/>
			</svg>
			<span class="text-sm font-medium">Beat Detection</span>
		</button>

		<!-- Beat Detection Modal -->
		<Transition>
			<div
				v-if="isOpen"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
				@click.self="isOpen = false"
			>
				<div class="w-[700px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
					<!-- Header -->
					<div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
						<div class="flex items-center gap-2">
							<svg
								class="w-5 h-5 text-amber-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
								/>
							</svg>
							<h3 class="font-semibold text-gray-900 dark:text-white">
								Audio Beat Detection
							</h3>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-sm text-amber-600 font-medium">{{ bpm }}
								BPM</span>
							<button
								class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
								@click="isOpen = false"
							>
								<svg
									class="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					</div>

					<!-- Content -->
					<div class="p-4">
						<!-- Analyzing State -->
						<div
							v-if="isAnalyzing"
							class="flex flex-col items-center justify-center py-12"
						>
							<div class="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4" />
							<p class="text-gray-600">Analyzing audio waveform...</p>
							<p class="text-xs text-gray-400 mt-2">
								Detecting beat patterns and tempo
							</p>
						</div>

						<div v-else>
							<!-- Waveform Visualization -->
							<div class="h-32 bg-gray-900 rounded-lg mb-4 relative overflow-hidden">
								<!-- Waveform Bars -->
								<div class="absolute inset-0 flex items-end justify-center gap-0.5 px-4">
									<div
										v-for="i in 50"
										:key="i"
										class="w-1 bg-amber-500/50 rounded-t"
										:style="{ height: `${Math.random() * 80 + 20}%` }"
									/>
								</div>

								<!-- Beat Markers -->
								<div
									v-for="beat in beats"
									:key="beat.time"
									class="absolute top-0 w-0.5 bg-amber-400"
									:style="{
										left: `${(beat.time / 4) * 100}%`,
										height: `${beat.intensity * 100}%`,
									}"
								>
									<div class="absolute -top-1 -left-1 w-2 h-2 bg-amber-400 rounded-full" />
								</div>
							</div>

							<!-- Beat Grid -->
							<div class="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 mb-4">
								<div class="flex items-center justify-between mb-3">
									<span class="text-sm font-medium"
									>Beat Grid ({{ beats.length }} beats detected)</span>
									<button
										class="px-3 py-1.5 text-xs bg-amber-600 text-white rounded-lg hover:bg-amber-700"
										@click="analyzeBeats"
									>
										Re-analyze
									</button>
								</div>

								<div class="grid grid-cols-8 gap-2">
									<div
										v-for="(beat, index) in beats"
										:key="index"
										class="aspect-square rounded-lg flex items-center justify-center text-xs font-medium"
										:class="[
											beat.intensity > 0.9
												? 'bg-amber-500 text-white'
												: beat.intensity > 0.7
												? 'bg-amber-400 text-white'
												: 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200',
										]"
									>
										{{ index + 1 }}
									</div>
								</div>
							</div>

							<!-- Info -->
							<div class="flex items-center justify-between text-sm">
								<div class="flex items-center gap-4">
									<span class="text-gray-500">Tempo: <strong
											class="text-gray-900 dark:text-white"
										>{{ bpm }} BPM</strong></span>
									<span class="text-gray-500">Duration: <strong
											class="text-gray-900 dark:text-white"
										>{{ audioDuration }}s</strong></span>
									<span class="text-gray-500">Beats: <strong
											class="text-gray-900 dark:text-white"
										>~{{
												Math.floor(bpm * (audioDuration / 60))
											}}</strong></span>
								</div>
								<button
									class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2"
									@click="snapToBeat"
								>
									<svg
										class="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 6h16M4 12h16M4 18h16"
										/>
									</svg>
									Snap to Beat
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
	transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>
