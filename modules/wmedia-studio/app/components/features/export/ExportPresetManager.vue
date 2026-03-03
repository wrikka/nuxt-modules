<script setup lang="ts">
const isOpen = ref(false);

const presets = ref([
	{
		id: 1,
		name: "Web Optimized",
		format: "PNG",
		quality: 80,
		width: 1920,
		height: 1080,
		usage: 15,
	},
	{
		id: 2,
		name: "Print Quality",
		format: "PDF",
		quality: 100,
		width: 3000,
		height: 2000,
		usage: 3,
	},
	{
		id: 3,
		name: "Social Media",
		format: "JPG",
		quality: 90,
		width: 1200,
		height: 630,
		usage: 24,
	},
	{
		id: 4,
		name: "Mobile App",
		format: "PNG",
		quality: 100,
		width: 1080,
		height: 1920,
		usage: 8,
	},
]);

const selectedPreset = ref<number | null>(null);

const applyPreset = (preset: typeof presets.value[0]) => {
	selectedPreset.value = preset.id;
};

const exportDesign = () => {
	if (selectedPreset.value) {
		const preset = presets.value.find(p => p.id === selectedPreset.value);
		alert(`Exporting with preset: ${preset?.name}`);
	}
};

const saveNewPreset = () => {
	alert("Saving new export preset...");
};
</script>

<template>
	<div class="relative">
		<!-- Toggle Button -->
		<button
			class="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
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
					d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
				/>
			</svg>
			<span class="text-sm font-medium">Export</span>
		</button>

		<!-- Export Modal -->
		<Transition>
			<div
				v-if="isOpen"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
				@click.self="isOpen = false"
			>
				<div class="w-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
					<!-- Header -->
					<div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
						<div class="flex items-center gap-2">
							<svg
								class="w-5 h-5 text-slate-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
								/>
							</svg>
							<h3 class="font-semibold text-gray-900 dark:text-white">
								Export Preset Manager
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

					<!-- Presets List -->
					<div class="p-4">
						<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
							Select an export preset:
						</p>

						<div class="space-y-2">
							<div
								v-for="preset in presets"
								:key="preset.id"
								:class="[
									'p-3 rounded-lg cursor-pointer transition-all border-2',
									selectedPreset === preset.id
										? 'border-slate-500 bg-slate-50 dark:bg-slate-900/50'
										: 'border-gray-200 dark:border-gray-700 hover:border-slate-300',
								]"
								@click="applyPreset(preset)"
							>
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-3">
										<div class="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center text-lg">
											{{ preset.format }}
										</div>
										<div>
											<p class="font-medium text-sm">{{ preset.name }}</p>
											<p class="text-xs text-gray-500">
												{{ preset.width }}×{{ preset.height }} • {{
													preset.quality
												}}% quality
											</p>
										</div>
									</div>
									<div class="text-right">
										<p class="text-xs text-gray-400">
											Used {{ preset.usage }} times
										</p>
										<svg
											v-if="selectedPreset === preset.id"
											class="w-5 h-5 text-slate-600 mt-1"
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
						</div>

						<!-- Custom Settings Preview -->
						<div
							v-if="selectedPreset"
							class="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
						>
							<p class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
								Export Settings:
							</p>
							<div class="grid grid-cols-2 gap-2 text-xs">
								<div class="flex justify-between">
									<span class="text-gray-500">Format:</span>
									<span>{{
										presets.find(p => p.id === selectedPreset)?.format
									}}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-500">Quality:</span>
									<span>{{
											presets.find(p => p.id === selectedPreset)?.quality
										}}%</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-500">Dimensions:</span>
									<span>{{
											presets.find(p => p.id === selectedPreset)?.width
										}}×{{
											presets.find(p => p.id === selectedPreset)?.height
										}}</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Footer -->
					<div class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
						<button
							class="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
							@click="saveNewPreset"
						>
							+ New Preset
						</button>
						<button
							class="px-4 py-2 bg-slate-600 text-white rounded-lg text-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
							:disabled="!selectedPreset"
							@click="exportDesign"
						>
							Export Now
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
