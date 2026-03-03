<script setup lang="ts">
const showTransform = ref(false);

const transform = ref({
	x: 0,
	y: 0,
	scale: 1,
	rotate: 0,
	skewX: 0,
	skewY: 0,
});

const reset = () => {
	transform.value = { x: 0, y: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0 };
};
</script>

<template>
	<div>
		<button
			class="fixed right-44 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-500 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-neutral-400 ring-offset-2': showTransform }"
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
				<path d="M12 3v18" />
				<path d="m7 8 5-5 5 5" />
				<path d="m7 16 5 5 5-5" />
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
				class="fixed bottom-20 right-44 z-50 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<div class="border-b border-gray-200 bg-neutral-500 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<h3 class="font-bold text-white">Transform</h3>
						<button
							class="text-white/80 hover:text-white"
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
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M18 6 6 18" />
								<path d="m6 6 12 12" />
							</svg>
						</button>
					</div>
				</div>

				<div class="p-4">
					<!-- Preview -->
					<div class="mb-6 flex justify-center">
						<div
							class="flex h-24 w-24 items-center justify-center rounded bg-neutral-500 text-white"
							:style="{
								transform:
									`translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}) rotate(${transform.rotate}deg) skew(${transform.skewX}deg, ${transform.skewY}deg)`,
							}"
						>
							Preview
						</div>
					</div>

					<!-- Controls -->
					<div class="space-y-4">
						<div class="grid grid-cols-2 gap-3">
							<div>
								<label
									class="mb-1 block text-xs text-gray-600 dark:text-gray-400"
								>X: {{ transform.x }}px</label>
								<input
									v-model.number="transform.x"
									type="range"
									min="-200"
									max="200"
									class="w-full"
								/>
							</div>
							<div>
								<label
									class="mb-1 block text-xs text-gray-600 dark:text-gray-400"
								>Y: {{ transform.y }}px</label>
								<input
									v-model.number="transform.y"
									type="range"
									min="-200"
									max="200"
									class="w-full"
								/>
							</div>
						</div>

						<div>
							<label
								class="mb-1 block text-xs text-gray-600 dark:text-gray-400"
							>Scale: {{ transform.scale }}</label>
							<input
								v-model.number="transform.scale"
								type="range"
								min="0.1"
								max="3"
								step="0.1"
								class="w-full"
							/>
						</div>

						<div>
							<label class="mb-1 block text-xs text-gray-600 dark:text-gray-400"
							>Rotate: {{ transform.rotate }}°</label>
							<input
								v-model.number="transform.rotate"
								type="range"
								min="-360"
								max="360"
								class="w-full"
							/>
						</div>

						<div class="grid grid-cols-2 gap-3">
							<div>
								<label
									class="mb-1 block text-xs text-gray-600 dark:text-gray-400"
								>Skew X: {{ transform.skewX }}°</label>
								<input
									v-model.number="transform.skewX"
									type="range"
									min="-45"
									max="45"
									class="w-full"
								/>
							</div>
							<div>
								<label
									class="mb-1 block text-xs text-gray-600 dark:text-gray-400"
								>Skew Y: {{ transform.skewY }}°</label>
								<input
									v-model.number="transform.skewY"
									type="range"
									min="-45"
									max="45"
									class="w-full"
								/>
							</div>
						</div>
					</div>

					<div class="mt-6 flex gap-2">
						<button
							class="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
							@click="reset"
						>
							Reset
						</button>
						<button class="flex-1 rounded-lg bg-neutral-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-600">
							Apply
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
