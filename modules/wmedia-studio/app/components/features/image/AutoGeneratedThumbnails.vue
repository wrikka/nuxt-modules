<script setup lang="ts">
const isOpen = ref(false);
const isGenerating = ref(false);

const thumbnails = ref([
	{ id: 1, style: "Clean & Minimal", image: "⬜", confidence: 94 },
	{ id: 2, style: "Bold & Vibrant", image: "🎨", confidence: 87 },
	{ id: 3, style: "Professional", image: "💼", confidence: 91 },
	{ id: 4, style: "Playful", image: "🎭", confidence: 82 },
]);

const selectedThumbnail = ref<number | null>(null);

const generateThumbnails = () => {
	isGenerating.value = true;
	setTimeout(() => {
		isGenerating.value = false;
	}, 3000);
};

const selectThumbnail = (id: number) => {
	selectedThumbnail.value = id;
};

const applyThumbnail = () => {
	if (selectedThumbnail.value) {
		alert("Thumbnail applied to your design!");
		isOpen.value = false;
	}
};
</script>

<template>
	<div class="relative">
		<!-- Toggle Button -->
		<button
			class="flex items-center gap-2 px-3 py-2 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
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
					d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
				/>
			</svg>
			<span class="text-sm font-medium">AI Thumbnails</span>
		</button>

		<!-- Modal -->
		<Transition>
			<div
				v-if="isOpen"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
				@click.self="isOpen = false"
			>
				<div class="w-[600px] max-h-[80vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
					<!-- Header -->
					<div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
						<div class="flex items-center gap-2">
							<svg
								class="w-5 h-5 text-orange-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
								/>
							</svg>
							<h3 class="font-semibold text-gray-900 dark:text-white">
								AI Thumbnail Generator
							</h3>
						</div>
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

					<!-- Content -->
					<div class="p-4">
						<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
							AI will analyze your design and generate optimized thumbnail
							variations
						</p>

						<!-- Generating State -->
						<div
							v-if="isGenerating"
							class="flex flex-col items-center justify-center py-12"
						>
							<div class="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4" />
							<p class="text-gray-600 dark:text-gray-400">
								AI is generating thumbnails...
							</p>
							<p class="text-xs text-gray-400 mt-2">
								Analyzing colors, composition, and style
							</p>
						</div>

						<!-- Thumbnails Grid -->
						<div v-else class="grid grid-cols-2 gap-4">
							<div
								v-for="thumb in thumbnails"
								:key="thumb.id"
								:class="[
									'relative p-4 rounded-xl cursor-pointer transition-all border-2',
									selectedThumbnail === thumb.id
										? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
										: 'border-gray-200 dark:border-gray-700 hover:border-orange-300',
								]"
								@click="selectThumbnail(thumb.id)"
							>
								<!-- Preview Placeholder -->
								<div class="aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center text-4xl mb-3">
									{{ thumb.image }}
								</div>

								<!-- Info -->
								<div class="flex items-center justify-between">
									<span class="font-medium text-sm">{{ thumb.style }}</span>
									<span
										class="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full"
									>
										{{ thumb.confidence }}% match
									</span>
								</div>

								<!-- Selection Indicator -->
								<div
									v-if="selectedThumbnail === thumb.id"
									class="absolute top-2 right-2 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center"
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
											d="M5 13l4 4L19 7"
										/>
									</svg>
								</div>
							</div>
						</div>

						<!-- Regenerate Button -->
						<button
							v-if="!isGenerating"
							class="w-full mt-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-orange-400 hover:text-orange-500 transition-colors"
							@click="generateThumbnails"
						>
							🔄 Generate More Variations
						</button>
					</div>

					<!-- Footer -->
					<div class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
						<p class="text-xs text-gray-500">
							{{ thumbnails.length }} variations generated
						</p>
						<button
							class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
							:disabled="!selectedThumbnail"
							@click="applyThumbnail"
						>
							Apply Thumbnail
						</button>
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
