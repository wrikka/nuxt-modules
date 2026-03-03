<script setup lang="ts">
const showExport = ref(false);
const format = ref<"png" | "jpg" | "svg" | "pdf">("png");
const scale = ref(1);
const quality = ref(90);
const includeBackground = ref(true);
const selectionOnly = ref(false);

const exportDesign = () => {
	// TODO: Implement export logic
	showExport.value = false;
};
</script>

<template>
	<div>
		<button
			class="fixed right-88 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-lime-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-lime-400 ring-offset-2': showExport }"
			@click="showExport = !showExport"
			title="Export"
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
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
				<polyline points="7 10 12 15 17 10" />
				<line x1="12" y1="15" x2="12" y2="3" />
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
				v-if="showExport"
				class="fixed right-88 bottom-20 z-50 w-80 rounded-xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden"
			>
				<div class="flex items-center justify-between p-4 border-b border-gray-800">
					<h3 class="text-white font-semibold">Export</h3>
					<button
						class="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
						@click="showExport = false"
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

				<div class="p-4 space-y-4">
					<!-- Format -->
					<div>
						<label class="text-gray-400 text-xs mb-2 block">Format</label>
						<div class="grid grid-cols-4 gap-2">
							<button
								v-for='f in ["png", "jpg", "svg", "pdf"] as const'
								:key="f"
								class="px-3 py-2 rounded-lg text-sm font-medium transition-colors uppercase"
								:class="format === f
								? 'bg-lime-600 text-white'
								: 'bg-gray-800 text-gray-400 hover:bg-gray-700'"
								@click="format = f"
							>
								{{ f }}
							</button>
						</div>
					</div>

					<!-- Scale -->
					<div>
						<div class="flex items-center justify-between mb-1">
							<label class="text-gray-400 text-xs">Scale</label>
							<span class="text-white text-xs">{{ scale }}x</span>
						</div>
						<div class="flex gap-2">
							<button
								v-for="s in [0.5, 1, 2, 3, 4]"
								:key="s"
								class="flex-1 px-2 py-1 rounded text-xs transition-colors"
								:class="scale === s
								? 'bg-lime-600 text-white'
								: 'bg-gray-800 text-gray-400 hover:bg-gray-700'"
								@click="scale = s"
							>
								{{ s }}x
							</button>
						</div>
					</div>

					<!-- Quality (for JPG) -->
					<div v-if="format === 'jpg'">
						<div class="flex items-center justify-between mb-1">
							<label class="text-gray-400 text-xs">Quality</label>
							<span class="text-white text-xs">{{ quality }}%</span>
						</div>
						<input
							v-model.number="quality"
							type="range"
							min="1"
							max="100"
							class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-lime-500"
						>
					</div>

					<!-- Options -->
					<div class="space-y-2">
						<label class="flex items-center gap-2 cursor-pointer">
							<input
								v-model="includeBackground"
								type="checkbox"
								class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-lime-600 focus:ring-lime-500"
							>
							<span class="text-gray-300 text-sm">Include background</span>
						</label>
						<label class="flex items-center gap-2 cursor-pointer">
							<input
								v-model="selectionOnly"
								type="checkbox"
								class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-lime-600 focus:ring-lime-500"
							>
							<span class="text-gray-300 text-sm">Selection only</span>
						</label>
					</div>

					<!-- Export Button -->
					<button
						class="w-full px-4 py-3 bg-lime-600 hover:bg-lime-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
						@click="exportDesign"
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
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="7 10 12 15 17 10" />
							<line x1="12" y1="15" x2="12" y2="3" />
						</svg>
						Export {{ format.toUpperCase() }}
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>
