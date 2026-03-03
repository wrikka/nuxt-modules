<script setup lang="ts">
const showTransform = ref(false);
const posX = ref(0);
const posY = ref(0);
const width = ref(100);
const height = ref(100);
const rotation = ref(0);
const scaleX = ref(1);
const scaleY = ref(1);
const linkScale = ref(true);

const updateScale = (axis: "x" | "y", value: number) => {
	if (linkScale.value) {
		scaleX.value = value;
		scaleY.value = value;
	} else if (axis === "x") {
		scaleX.value = value;
	} else {
		scaleY.value = value;
	}
};

const resetTransform = () => {
	posX.value = 0;
	posY.value = 0;
	rotation.value = 0;
	scaleX.value = 1;
	scaleY.value = 1;
};
</script>

<template>
	<div>
		<button
			class="fixed right-124 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-sky-400 ring-offset-2': showTransform }"
			@click="showTransform = !showTransform"
			title="Transform"
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
				<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
				<polyline points="3.27 6.96 12 12.01 20.73 6.96" />
				<line x1="12" y1="22.08" x2="12" y2="12" />
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
				v-if="showTransform"
				class="fixed right-124 bottom-20 z-50 w-72 rounded-xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden"
			>
				<div class="flex items-center justify-between p-4 border-b border-gray-800">
					<h3 class="text-white font-semibold">Transform</h3>
					<div class="flex gap-2">
						<button
							class="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
							@click="resetTransform"
							title="Reset"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" />
							</svg>
						</button>
						<button
							class="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
							@click="showTransform = false"
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
				</div>

				<div class="p-4 space-y-4">
					<!-- Position -->
					<div>
						<label class="text-gray-400 text-xs mb-2 block">Position</label>
						<div class="grid grid-cols-2 gap-2">
							<div>
								<label class="text-gray-500 text-[10px] mb-1 block">X</label>
								<input
									v-model.number="posX"
									type="number"
									class="w-full bg-gray-800 text-white text-sm rounded px-2 py-1"
								/>
							</div>
							<div>
								<label class="text-gray-500 text-[10px] mb-1 block">Y</label>
								<input
									v-model.number="posY"
									type="number"
									class="w-full bg-gray-800 text-white text-sm rounded px-2 py-1"
								/>
							</div>
						</div>
					</div>

					<!-- Size -->
					<div class="border-t border-gray-800 pt-4">
						<label class="text-gray-400 text-xs mb-2 block">Size</label>
						<div class="grid grid-cols-2 gap-2">
							<div>
								<label class="text-gray-500 text-[10px] mb-1 block">W</label>
								<input
									v-model.number="width"
									type="number"
									class="w-full bg-gray-800 text-white text-sm rounded px-2 py-1"
								/>
							</div>
							<div>
								<label class="text-gray-500 text-[10px] mb-1 block">H</label>
								<input
									v-model.number="height"
									type="number"
									class="w-full bg-gray-800 text-white text-sm rounded px-2 py-1"
								/>
							</div>
						</div>
						<div class="flex gap-2 mt-2">
							<button class="flex-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded transition-colors">
								Fit
							</button>
							<button class="flex-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded transition-colors">
								Fill
							</button>
							<button class="flex-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded transition-colors">
								Stretch
							</button>
						</div>
					</div>

					<!-- Rotation -->
					<div class="border-t border-gray-800 pt-4">
						<div class="flex items-center justify-between mb-1">
							<label class="text-gray-400 text-xs">Rotation</label>
							<span class="text-white text-xs">{{ rotation }}°</span>
						</div>
						<input
							v-model.number="rotation"
							type="range"
							min="-180"
							max="180"
							class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
						>
						<div class="flex gap-2 mt-2">
							<button
								class="flex-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded transition-colors"
								@click="rotation = 0"
							>
								0°
							</button>
							<button
								class="flex-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded transition-colors"
								@click="rotation = 90"
							>
								90°
							</button>
							<button
								class="flex-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded transition-colors"
								@click="rotation = 180"
							>
								180°
							</button>
							<button
								class="flex-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded transition-colors"
								@click="rotation = -90"
							>
								-90°
							</button>
						</div>
					</div>

					<!-- Scale -->
					<div class="border-t border-gray-800 pt-4">
						<div class="flex items-center justify-between mb-2">
							<label class="text-gray-400 text-xs">Scale</label>
							<button
								class="p-1 rounded hover:bg-gray-800 text-gray-400 transition-colors"
								@click="linkScale = !linkScale"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									:class="linkScale ? 'text-sky-400' : 'text-gray-500'"
								>
									<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
									<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
								</svg>
							</button>
						</div>
						<div class="grid grid-cols-2 gap-2">
							<div>
								<label class="text-gray-500 text-[10px] mb-1 block">X: {{
										scaleX.toFixed(2)
									}}</label>
								<input
									:value="scaleX"
									type="range"
									min="0.1"
									max="3"
									step="0.1"
									class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
									@input="(e) =>
									updateScale(
										'x',
										parseFloat((e.target as HTMLInputElement).value),
									)"
								>
							</div>
							<div>
								<label class="text-gray-500 text-[10px] mb-1 block">Y: {{
										scaleY.toFixed(2)
									}}</label>
								<input
									:value="scaleY"
									type="range"
									min="0.1"
									max="3"
									step="0.1"
									class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
									@input="(e) =>
									updateScale(
										'y',
										parseFloat((e.target as HTMLInputElement).value),
									)"
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
