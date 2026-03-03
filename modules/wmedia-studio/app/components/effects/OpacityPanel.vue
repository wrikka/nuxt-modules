<script setup lang="ts">
const showOpacity = ref(false);

const opacity = ref(100);

const presets = [
	{ name: "Invisible", value: 0 },
	{ name: "Faint", value: 25 },
	{ name: "Light", value: 50 },
	{ name: "Medium", value: 75 },
	{ name: "Opaque", value: 100 },
];
</script>

<template>
	<div>
		<button
			class="fixed right-56 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gray-500 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-gray-400 ring-offset-2': showOpacity }"
			@click="showOpacity = !showOpacity"
			title="Opacity"
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
				<circle cx="12" cy="12" r="10" />
				<path
					d="M12 2a10 10 0 0 1 0 20 10 10 0 0 1 0-20"
					fill="currentColor"
					fill-opacity="0.3"
				/>
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
				v-if="showOpacity"
				class="fixed bottom-20 right-56 z-50 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<div class="border-b border-gray-200 bg-gray-500 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<h3 class="font-bold text-white">Opacity</h3>
						<button
							class="text-white/80 hover:text-white"
							@click="showOpacity = false"
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
							class="flex h-24 w-24 items-center justify-center rounded bg-gray-500 text-white"
							:style="{ opacity: opacity / 100 }"
						>
							{{ opacity }}%
						</div>
					</div>

					<!-- Presets -->
					<div class="mb-4 flex flex-wrap gap-2">
						<button
							v-for="preset in presets"
							:key="preset.name"
							class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
							@click="opacity = preset.value"
						>
							{{ preset.name }}
						</button>
					</div>

					<!-- Slider -->
					<div class="mb-2">
						<input
							v-model.number="opacity"
							type="range"
							min="0"
							max="100"
							class="w-full"
						/>
					</div>

					<div class="flex items-center justify-between">
						<input
							v-model.number="opacity"
							type="number"
							min="0"
							max="100"
							class="w-20 rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
						/>
						<span class="text-sm text-gray-500">%</span>
					</div>

					<button class="mt-6 w-full rounded-lg bg-gray-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-600">
						Apply Opacity
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>
