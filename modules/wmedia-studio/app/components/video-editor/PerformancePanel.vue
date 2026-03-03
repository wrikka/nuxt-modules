<script setup lang="ts">
const showPerformance = ref(false);
const performanceStore = usePerformanceStore();

const proxyResolutions: {
	value: "1/2" | "1/4" | "1/8";
	label: string;
	description: string;
}[] = [
	{ value: "1/2", label: "Half (1/2)", description: "Best balance" },
	{ value: "1/4", label: "Quarter (1/4)", description: "Better performance" },
	{ value: "1/8", label: "Eighth (1/8)", description: "Maximum performance" },
];

const toggleProxy = () => {
	if (performanceStore.isUsingProxy) {
		performanceStore.disableProxyMode();
	} else {
		performanceStore.enableProxyMode("1/2");
	}
};

const formatBytes = (bytes: number): string => {
	if (bytes === 0) return "0 MB";
	const k = 1024;
	const sizes = ["MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]!;
};
</script>

<template>
	<div>
		<!-- Floating Action Button -->
		<button
			class="fixed left-4 bottom-20 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-red-400 ring-offset-2': showPerformance }"
			@click="showPerformance = !showPerformance"
			title="Performance"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polygon points="13 2 3 14 12 14 11 22 21 10 12 10" />
			</svg>
		</button>

		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="translate-y-full opacity-0"
			enter-to-class="translate-y-0 opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-full opacity-0"
		>
			<div
				v-if="showPerformance"
				class="fixed left-4 bottom-36 z-50 w-80 rounded-xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden"
			>
				<div class="flex items-center justify-between p-4 border-b border-gray-800">
					<h3 class="text-white font-semibold">Performance Settings</h3>
					<button
						class="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
						@click="showPerformance = false"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M18 6 6 18M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div class="p-4 space-y-4 max-h-96 overflow-y-auto">
					<!-- Performance Metrics -->
					<div class="p-3 rounded-lg bg-gray-800">
						<h4 class="text-gray-400 text-xs mb-2">Live Metrics</h4>
						<div class="grid grid-cols-2 gap-3">
							<div>
								<div class="text-gray-500 text-[10px]">FPS</div>
								<div class="text-white text-lg font-mono">
									{{ performanceStore.averageFps }}
								</div>
							</div>
							<div>
								<div class="text-gray-500 text-[10px]">Frame Time</div>
								<div class="text-white text-lg font-mono">
									{{ performanceStore.metrics.frameTime.toFixed(1) }}ms
								</div>
							</div>
							<div>
								<div class="text-gray-500 text-[10px]">Memory</div>
								<div class="text-white text-sm font-mono">
									{{ formatBytes(performanceStore.metrics.memoryUsage) }}
								</div>
							</div>
							<div>
								<div class="text-gray-500 text-[10px]">Dropped</div>
								<div class="text-white text-sm font-mono">
									{{ performanceStore.metrics.droppedFrames }}
								</div>
							</div>
						</div>
					</div>

					<!-- Proxy Mode -->
					<div class="border-t border-gray-800 pt-4">
						<div class="flex items-center justify-between mb-3">
							<div>
								<h4 class="text-white text-sm font-medium">Proxy Mode</h4>
								<p class="text-gray-500 text-xs">
									Lower resolution for smooth playback
								</p>
							</div>
							<button
								class="w-12 h-6 rounded-full transition-colors relative"
								:class="performanceStore.isUsingProxy ? 'bg-red-600' : 'bg-gray-700'"
								@click="toggleProxy"
							>
								<span
									class="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
									:class="performanceStore.isUsingProxy ? 'left-6.5' : 'left-0.5'"
								/>
							</button>
						</div>

						<div v-if="performanceStore.isUsingProxy" class="space-y-2">
							<button
								v-for="res in proxyResolutions"
								:key="res.value"
								class="w-full p-2 rounded-lg flex items-center justify-between transition-colors"
								:class="performanceStore.proxySettings.resolution === res.value
								? 'bg-red-900 bg-opacity-50 border border-red-700'
								: 'bg-gray-800 hover:bg-gray-700'"
								@click="performanceStore.enableProxyMode(res.value)"
							>
								<div class="text-left">
									<div class="text-white text-sm">{{ res.label }}</div>
									<div class="text-gray-500 text-xs">{{ res.description }}</div>
								</div>
								<svg
									v-if="performanceStore.proxySettings.resolution === res.value"
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class="text-red-400"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
							</button>
						</div>
					</div>

					<!-- Cache Settings -->
					<div class="border-t border-gray-800 pt-4">
						<h4 class="text-white text-sm font-medium mb-3">Cache Settings</h4>

						<div class="space-y-3">
							<div>
								<div class="flex items-center justify-between mb-1">
									<label class="text-gray-400 text-xs">Memory Cache</label>
									<span class="text-white text-xs">{{
											performanceStore.cacheSettings.maxMemoryMB
										}} MB</span>
								</div>
								<input
									v-model.number="performanceStore.cacheSettings.maxMemoryMB"
									type="range"
									min="512"
									max="8192"
									step="256"
									class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
								>
							</div>

							<div>
								<div class="flex items-center justify-between mb-1">
									<label class="text-gray-400 text-xs">Disk Cache</label>
									<span class="text-white text-xs">{{
											performanceStore.cacheSettings.maxDiskGB
										}} GB</span>
								</div>
								<input
									v-model.number="performanceStore.cacheSettings.maxDiskGB"
									type="range"
									min="1"
									max="50"
									step="1"
									class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
								>
							</div>

							<div>
								<div class="flex items-center justify-between mb-1">
									<label class="text-gray-400 text-xs">Frame Cache</label>
									<span class="text-white text-xs">{{
											performanceStore.cacheSettings.frameCacheSize
										}} frames</span>
								</div>
								<input
									v-model.number="performanceStore.cacheSettings.frameCacheSize"
									type="range"
									min="10"
									max="200"
									step="10"
									class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
								>
							</div>
						</div>
					</div>

					<!-- Quick Actions -->
					<div class="border-t border-gray-800 pt-4 flex gap-2">
						<button
							class="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
							@click="performanceStore.optimizeFor4K"
						>
							Optimize for 4K
						</button>
						<button
							class="flex-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded transition-colors"
							@click="performanceStore.clearCache"
						>
							Clear Cache
						</button>
					</div>

					<button
						class="w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs rounded transition-colors"
						@click="performanceStore.resetToDefaults"
					>
						Reset to Defaults
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>
