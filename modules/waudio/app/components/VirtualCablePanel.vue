<script setup lang="ts">
const sources = ref([
	{ id: "mic", name: "Microphone", status: "available", volume: 80 },
	{ id: "desktop", name: "Desktop Audio", status: "available", volume: 100 },
	{ id: "app1", name: "Spotify", status: "unavailable", volume: 100 },
	{ id: "app2", name: "Chrome", status: "unavailable", volume: 100 },
	{ id: "app3", name: "Zoom", status: "unavailable", volume: 100 },
]);

const selectedSource = ref("");
const isCapturing = ref(false);
const bufferSize = ref(1024);
const latency = ref("low");

const toggleCapture = () => {
	isCapturing.value = !isCapturing.value;
};

const refreshSources = () => {
	// Simulate refreshing available sources
	sources.value.forEach(s => {
		if (s.id !== "mic" && s.id !== "desktop") {
			s.status = Math.random() > 0.5 ? "available" : "unavailable";
		}
	});
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
				Virtual Cable Routing
			</h3>
			<button
				@click="refreshSources"
				class="p-1.5 text-gray-400 hover:text-white transition-colors"
				title="Refresh Sources"
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
						d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
					/>
				</svg>
			</button>
		</div>

		<div class="p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
			<p class="text-xs text-yellow-300">
				Route audio from other applications directly into the editor. Requires
				virtual audio cable driver (VB-Cable or similar).
			</p>
		</div>

		<!-- Audio Sources -->
		<div class="space-y-2">
			<label class="text-sm text-gray-400">Available Sources</label>
			<div class="space-y-1">
				<div
					v-for="source in sources"
					:key="source.id"
					@click="source.status === 'available' && (selectedSource = source.id)"
					:class="[
						'flex items-center justify-between p-3 rounded-lg transition-colors',
						source.status === 'available'
							? 'bg-gray-800 hover:bg-gray-750 cursor-pointer'
							: 'bg-gray-800/50 cursor-not-allowed',
						selectedSource === source.id ? 'ring-1 ring-purple-500' : '',
					]"
				>
					<div class="flex items-center gap-3">
						<div
							class="w-2 h-2 rounded-full"
							:class="source.status === 'available' ? 'bg-green-500' : 'bg-gray-600'"
						>
						</div>
						<span
							:class="[
								'text-sm',
								source.status === 'available' ? 'text-white' : 'text-gray-500',
							]"
						>
							{{ source.name }}
						</span>
					</div>

					<div class="flex items-center gap-2">
						<span
							v-if="source.status === 'unavailable'"
							class="text-xs text-gray-500"
						>Not running</span>
						<div v-else class="flex items-center gap-2">
							<input
								v-model="source.volume"
								type="range"
								min="0"
								max="100"
								class="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
								@click.stop
							/>
							<span class="text-xs text-gray-400 w-8">{{
									source.volume
								}}%</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Settings -->
		<div class="space-y-3">
			<label class="text-sm text-gray-400">Routing Settings</label>

			<div class="grid grid-cols-2 gap-3">
				<div class="space-y-1">
					<label class="text-xs text-gray-500">Buffer Size</label>
					<select
						v-model="bufferSize"
						class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
					>
						<option :value="256">256 samples</option>
						<option :value="512">512 samples</option>
						<option :value="1024">1024 samples</option>
						<option :value="2048">2048 samples</option>
						<option :value="4096">4096 samples</option>
					</select>
				</div>

				<div class="space-y-1">
					<label class="text-xs text-gray-500">Latency Priority</label>
					<select
						v-model="latency"
						class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
					>
						<option value="low">Low Latency</option>
						<option value="balanced">Balanced</option>
						<option value="quality">Quality</option>
					</select>
				</div>
			</div>
		</div>

		<!-- Capture Button -->
		<button
			@click="toggleCapture"
			:disabled="!selectedSource"
			:class="[
				'w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2',
				isCapturing
					? 'bg-red-600 hover:bg-red-700 text-white'
					: 'bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white',
			]"
		>
			<svg
				v-if="isCapturing"
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
					d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
				/>
			</svg>
			<svg
				v-else
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
					d="M13 10V3L4 14h7v7l9-11h-7z"
				/>
			</svg>
			{{ isCapturing ? "Stop Capture" : "Start Capture" }}
		</button>

		<!-- Recording Indicator -->
		<div
			v-if="isCapturing"
			class="flex items-center justify-center gap-2 text-red-400"
		>
			<span class="relative flex h-3 w-3">
				<span
					class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
				></span>
				<span
					class="relative inline-flex rounded-full h-3 w-3 bg-red-500"
				></span>
			</span>
			<span class="text-sm">Recording from {{
					sources.find(s => s.id === selectedSource)?.name
				}}</span>
		</div>
	</div>
</template>
