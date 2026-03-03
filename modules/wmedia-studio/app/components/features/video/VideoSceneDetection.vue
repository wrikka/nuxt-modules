<script setup lang="ts">
const isOpen = ref(false);
const isAnalyzing = ref(false);
const videoDuration = ref(120); // seconds

const scenes = ref([
	{ id: 1, start: 0, end: 15, thumbnail: "🎬", label: "Intro", confidence: 98 },
	{
		id: 2,
		start: 15,
		end: 45,
		thumbnail: "👨‍💼",
		label: "Main Content",
		confidence: 95,
	},
	{
		id: 3,
		start: 45,
		end: 75,
		thumbnail: "📊",
		label: "Data Section",
		confidence: 92,
	},
	{
		id: 4,
		start: 75,
		end: 105,
		thumbnail: "🎉",
		label: "Conclusion",
		confidence: 88,
	},
	{
		id: 5,
		start: 105,
		end: 120,
		thumbnail: "🔚",
		label: "Outro",
		confidence: 96,
	},
]);

const detectScenes = () => {
	isAnalyzing.value = true;
	setTimeout(() => {
		isAnalyzing.value = false;
	}, 2000);
};

const splitAtScene = (sceneId: number) => {
	const scene = scenes.value.find(s => s.id === sceneId);
	alert(`Split video at: ${scene?.label} (${scene?.start}s)`);
};

const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};
</script>

<template>
	<div class="relative">
		<!-- Toggle Button -->
		<button
			class="flex items-center gap-2 px-3 py-2 bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-800 transition-colors"
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
					d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
				/>
			</svg>
			<span class="text-sm font-medium">Scene Detection</span>
		</button>

		<!-- Scene Detection Modal -->
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
								class="w-5 h-5 text-rose-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
								/>
							</svg>
							<h3 class="font-semibold text-gray-900 dark:text-white">
								AI Scene Detection
							</h3>
						</div>
						<div class="flex items-center gap-2">
							<button
								class="px-3 py-1.5 text-sm bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 rounded-lg"
								@click="detectScenes"
							>
								{{ isAnalyzing ? "Analyzing..." : "Re-analyze" }}
							</button>
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
							<div class="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mb-4" />
							<p class="text-gray-600">AI is detecting scene changes...</p>
							<p class="text-xs text-gray-400 mt-2">
								Analyzing visual patterns and audio cues
							</p>
						</div>

						<!-- Scenes Timeline -->
						<div v-else>
							<!-- Video Preview Bar -->
							<div class="h-16 bg-gray-900 rounded-lg mb-4 flex items-center px-4">
								<div class="text-white text-sm">🎥 Video Preview</div>
								<div class="ml-auto text-xs text-gray-400">
									{{ formatTime(videoDuration) }}
								</div>
							</div>

							<!-- Scene Markers -->
							<div class="relative h-24 bg-gray-100 dark:bg-gray-900 rounded-lg p-4 mb-4">
								<div class="absolute inset-x-4 top-8 h-2 bg-gray-300 dark:bg-gray-700 rounded-full">
									<div
										v-for="scene in scenes"
										:key="scene.id"
										class="absolute top-0 h-full bg-rose-500 rounded-full"
										:style="{
											left: `${(scene.start / videoDuration) * 100}%`,
											width: `${
												((scene.end - scene.start) / videoDuration) * 100
											}%`,
										}"
									/>
								</div>

								<!-- Scene Points -->
								<div
									v-for="scene in scenes"
									:key="`marker-${scene.id}`"
									class="absolute top-2 transform -translate-x-1/2"
									:style="{ left: `${(scene.start / videoDuration) * 100}%` }"
								>
									<div class="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg shadow flex items-center justify-center text-lg">
										{{ scene.thumbnail }}
									</div>
									<div class="text-xs text-center mt-1 text-gray-500">
										{{ formatTime(scene.start) }}
									</div>
								</div>
							</div>

							<!-- Scene List -->
							<div class="space-y-2">
								<p class="text-xs text-gray-500 mb-2">
									Detected Scenes ({{ scenes.length }} found):
								</p>
								<div
									v-for="scene in scenes"
									:key="scene.id"
									class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
								>
									<div class="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-lg">
										{{ scene.thumbnail }}
									</div>
									<div class="flex-1">
										<div class="flex items-center gap-2">
											<span class="font-medium text-sm">{{ scene.label }}</span>
											<span
												class="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full"
											>
												{{ scene.confidence }}% match
											</span>
										</div>
										<p class="text-xs text-gray-500">
											{{ formatTime(scene.start) }} - {{
												formatTime(scene.end)
											}} ({{ scene.end - scene.start }}s)
										</p>
									</div>
									<button
										class="px-3 py-1.5 text-xs bg-rose-600 text-white rounded hover:bg-rose-700"
										@click="splitAtScene(scene.id)"
									>
										Split Here
									</button>
								</div>
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
