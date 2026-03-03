<script setup lang="ts">
const showShadow = ref(false);

const shadow = ref({
	x: 0,
	y: 4,
	blur: 8,
	spread: 0,
	color: "#000000",
	opacity: 20,
	inset: false,
});

const presets = [
	{ name: "Small", x: 0, y: 1, blur: 2, spread: 0 },
	{ name: "Medium", x: 0, y: 4, blur: 8, spread: 0 },
	{ name: "Large", x: 0, y: 8, blur: 16, spread: 0 },
	{ name: "XLarge", x: 0, y: 16, blur: 32, spread: 0 },
	{ name: "Inner", x: 0, y: 2, blur: 4, spread: 0, inset: true },
];

const getShadowStyle = () => {
	const alpha = Math.round((shadow.value.opacity / 100) * 255).toString(16)
		.padStart(2, "0");
	const color = shadow.value.color + alpha;
	return `${
		shadow.value.inset ? "inset " : ""
	}${shadow.value.x}px ${shadow.value.y}px ${shadow.value.blur}px ${shadow.value.spread}px ${color}`;
};
</script>

<template>
	<div>
		<button
			class="fixed right-4 top-80 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-stone-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-stone-400 ring-offset-2': showShadow }"
			@click="showShadow = !showShadow"
			title="Shadow Effects"
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
				<path d="M5 10h14" />
				<path d="M5 14h14" />
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
				v-if="showShadow"
				class="fixed right-0 top-0 z-40 h-screen w-80 overflow-hidden border-l border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<div class="border-b border-gray-200 bg-stone-600 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<h2 class="font-bold text-white">Shadow</h2>
						<button
							class="text-white/80 hover:text-white"
							@click="showShadow = false"
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
					<div class="mb-6 flex h-32 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800">
						<div
							class="h-20 w-20 rounded-lg bg-white"
							:style="{ boxShadow: getShadowStyle() }"
						/>
					</div>

					<!-- Presets -->
					<div class="mb-4 flex flex-wrap gap-2">
						<button
							v-for="preset in presets"
							:key="preset.name"
							class="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300"
							@click="Object.assign(shadow, preset)"
						>
							{{ preset.name }}
						</button>
					</div>

					<!-- Controls -->
					<div class="space-y-4">
						<div>
							<label class="mb-1 block text-xs text-gray-600 dark:text-gray-400"
							>X Offset: {{ shadow.x }}px</label>
							<input
								v-model.number="shadow.x"
								type="range"
								min="-50"
								max="50"
								class="w-full"
							/>
						</div>
						<div>
							<label class="mb-1 block text-xs text-gray-600 dark:text-gray-400"
							>Y Offset: {{ shadow.y }}px</label>
							<input
								v-model.number="shadow.y"
								type="range"
								min="-50"
								max="50"
								class="w-full"
							/>
						</div>
						<div>
							<label class="mb-1 block text-xs text-gray-600 dark:text-gray-400"
							>Blur: {{ shadow.blur }}px</label>
							<input
								v-model.number="shadow.blur"
								type="range"
								min="0"
								max="100"
								class="w-full"
							/>
						</div>
						<div>
							<label class="mb-1 block text-xs text-gray-600 dark:text-gray-400"
							>Spread: {{ shadow.spread }}px</label>
							<input
								v-model.number="shadow.spread"
								type="range"
								min="-50"
								max="50"
								class="w-full"
							/>
						</div>
						<div>
							<label class="mb-1 block text-xs text-gray-600 dark:text-gray-400"
							>Opacity: {{ shadow.opacity }}%</label>
							<input
								v-model.number="shadow.opacity"
								type="range"
								min="0"
								max="100"
								class="w-full"
							/>
						</div>
						<div>
							<label class="mb-1 block text-xs text-gray-600 dark:text-gray-400"
							>Color</label>
							<input
								v-model="shadow.color"
								type="color"
								class="h-10 w-full rounded"
							/>
						</div>
						<label class="flex items-center gap-2">
							<input v-model="shadow.inset" type="checkbox" class="rounded" />
							<span class="text-sm text-gray-700 dark:text-gray-300"
							>Inset</span>
						</label>
					</div>

					<button class="mt-6 w-full rounded-lg bg-stone-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700">
						Apply Shadow
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>
