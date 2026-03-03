<script setup lang="ts">
const isPresenting = ref(false);
const currentSlide = ref(1);
const totalSlides = ref(12);
const notes = ref(
	"Key points to cover:\n- Product benefits\n- Pricing overview\n- Q&A session",
);

const startPresentation = () => {
	isPresenting.value = true;
};

const exitPresentation = () => {
	isPresenting.value = false;
};

const nextSlide = () => {
	if (currentSlide.value < totalSlides.value) currentSlide.value++;
};

const prevSlide = () => {
	if (currentSlide.value > 1) currentSlide.value--;
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<div v-if="!isPresenting">
			<div class="flex items-center justify-between mb-6">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					Presentation Mode
				</h3>
				<span
					class="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs rounded"
				>Beta</span>
			</div>

			<!-- Preview -->
			<div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
				<div class="text-center">
					<Icon
						name="mdi:presentation-play"
						class="w-16 h-16 text-gray-400 mb-2"
					/>
					<p class="text-gray-500">Project Preview</p>
					<p class="text-sm text-gray-400">{{ totalSlides }} slides ready</p>
				</div>
			</div>

			<!-- Presenter Notes -->
			<div class="mb-4">
				<label class="text-sm text-gray-600 dark:text-gray-400 mb-1 block"
				>Presenter Notes</label>
				<textarea
					v-model="notes"
					rows="3"
					class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg text-sm"
				/>
			</div>

			<button
				@click="startPresentation"
				class="w-full py-2 bg-purple-500 text-white rounded-lg flex items-center justify-center gap-2"
			>
				<Icon name="mdi:presentation-play" class="w-5 h-5" />
				Start Presentation
			</button>
		</div>

		<!-- Presentation Overlay -->
		<div v-else class="fixed inset-0 bg-black z-50 flex flex-col">
			<!-- Slide Area -->
			<div class="flex-1 flex items-center justify-center p-8">
				<div class="w-full max-w-4xl aspect-video bg-white rounded-lg shadow-2xl flex items-center justify-center">
					<div class="text-center">
						<h2 class="text-4xl font-bold text-gray-900 mb-4">
							Slide {{ currentSlide }}
						</h2>
						<p class="text-xl text-gray-500">Presentation Content Here</p>
					</div>
				</div>
			</div>

			<!-- Controls -->
			<div class="h-16 bg-gray-900 flex items-center justify-between px-6">
				<div class="flex items-center gap-4">
					<button
						@click="exitPresentation"
						class="text-white hover:text-red-400"
					>
						<Icon name="mdi:close" class="w-6 h-6" />
					</button>
					<span class="text-white">{{ currentSlide }} / {{ totalSlides }}</span>
				</div>
				<div class="flex items-center gap-2">
					<button
						@click="prevSlide"
						:disabled="currentSlide === 1"
						class="p-2 text-white hover:bg-gray-800 rounded disabled:opacity-50"
					>
						<Icon name="mdi:chevron-left" class="w-6 h-6" />
					</button>
					<button
						@click="nextSlide"
						:disabled="currentSlide === totalSlides"
						class="p-2 text-white hover:bg-gray-800 rounded disabled:opacity-50"
					>
						<Icon name="mdi:chevron-right" class="w-6 h-6" />
					</button>
				</div>
				<div class="flex items-center gap-2">
					<button class="p-2 text-white hover:bg-gray-800 rounded">
						<Icon name="mdi:laser-pointer" class="w-5 h-5" />
					</button>
					<button class="p-2 text-white hover:bg-gray-800 rounded">
						<Icon name="mdi:draw" class="w-5 h-5" />
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
