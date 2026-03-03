<script setup lang="ts">
const showBlendModes = ref(false);

const blendModes = [
	{ name: "Normal", value: "normal" },
	{ name: "Multiply", value: "multiply" },
	{ name: "Screen", value: "screen" },
	{ name: "Overlay", value: "overlay" },
	{ name: "Darken", value: "darken" },
	{ name: "Lighten", value: "lighten" },
	{ name: "Color Dodge", value: "color-dodge" },
	{ name: "Color Burn", value: "color-burn" },
	{ name: "Hard Light", value: "hard-light" },
	{ name: "Soft Light", value: "soft-light" },
	{ name: "Difference", value: "difference" },
	{ name: "Exclusion", value: "exclusion" },
	{ name: "Hue", value: "hue" },
	{ name: "Saturation", value: "saturation" },
	{ name: "Color", value: "color" },
	{ name: "Luminosity", value: "luminosity" },
];

const selectedMode = ref("normal");
const opacity = ref(100);

const previewImages = [
	"https://picsum.photos/200/200?random=1",
	"https://picsum.photos/200/200?random=2",
];
</script>

<template>
	<div>
		<button
			class="fixed right-4 top-44 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-fuchsia-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-fuchsia-400 ring-offset-2': showBlendModes }"
			@click="showBlendModes = !showBlendModes"
			title="Blend Modes"
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
				<circle cx="12" cy="12" r="4" />
				<path d="m4.93 4.93 4.24 4.24" />
				<path d="m14.83 14.83 4.24 4.24" />
				<path d="m14.83 9.17 4.24-4.24" />
				<path d="m4.93 19.07 4.24-4.24" />
			</svg>
		</button>

		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="translate-x-full opacity-0"
			enter-to-class="translate-x-0 opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="translate-x-0 opacity-100"
			leave-to-class="translate-x-full opacity-0"
		>
			<div
				v-if="showBlendModes"
				class="fixed right-0 top-0 z-40 h-screen w-80 overflow-hidden border-l border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<div class="border-b border-gray-200 bg-gradient-to-r from-fuchsia-600 to-pink-600 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<h2 class="font-bold text-white">Blend Modes</h2>
						<button
							class="text-white/80 hover:text-white"
							@click="showBlendModes = false"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
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

				<div class="h-[calc(100vh-80px)] overflow-y-auto p-4">
					<!-- Preview -->
					<div class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
						<div class="relative mx-auto h-40 w-40 overflow-hidden rounded-lg">
							<img
								:src="previewImages[0]"
								class="absolute inset-0 h-full w-full object-cover"
							/>
							<img
								:src="previewImages[1]"
								class="absolute inset-0 h-full w-full object-cover"
								:style="{ mixBlendMode: selectedMode, opacity: opacity / 100 } as any"
							/>
						</div>
						<p class="mt-2 text-center text-xs text-gray-500">
							{{ selectedMode }} ({{ opacity }}%)
						</p>
					</div>

					<!-- Opacity -->
					<div class="mb-4">
						<label
							class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
						>Opacity: {{ opacity }}%</label>
						<input
							v-model.number="opacity"
							type="range"
							min="0"
							max="100"
							class="w-full"
						/>
					</div>

					<!-- Blend Modes Grid -->
					<div class="grid grid-cols-2 gap-2">
						<button
							v-for="mode in blendModes"
							:key="mode.value"
							class="rounded-lg border border-gray-200 py-2 text-xs font-medium transition-colors dark:border-gray-700"
							:class="selectedMode === mode.value
							? 'bg-fuchsia-600 text-white'
							: 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'"
							@click="selectedMode = mode.value"
						>
							{{ mode.name }}
						</button>
					</div>

					<button class="mt-6 w-full rounded-lg bg-fuchsia-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-fuchsia-700">
						Apply to Selected
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>
