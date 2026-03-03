<script setup lang="ts">
const showRadius = ref(false);

const radius = ref({
	topLeft: 8,
	topRight: 8,
	bottomRight: 8,
	bottomLeft: 8,
});

const linked = ref(true);

const updateAll = (value: number) => {
	radius.value.topLeft = value;
	radius.value.topRight = value;
	radius.value.bottomRight = value;
	radius.value.bottomLeft = value;
};

const presets = [
	{ name: "None", value: 0 },
	{ name: "Small", value: 4 },
	{ name: "Medium", value: 8 },
	{ name: "Large", value: 16 },
	{ name: "XL", value: 24 },
	{ name: "Full", value: 9999 },
];
</script>

<template>
	<div>
		<button
			class="fixed right-32 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-500 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-zinc-400 ring-offset-2': showRadius }"
			@click="showRadius = !showRadius"
			title="Border Radius"
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
				<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
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
				v-if="showRadius"
				class="fixed bottom-20 right-32 z-50 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<div class="border-b border-gray-200 bg-zinc-500 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<h3 class="font-bold text-white">Border Radius</h3>
						<button
							class="text-white/80 hover:text-white"
							@click="showRadius = false"
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
							class="h-24 w-24 bg-zinc-500"
							:style="{
								borderRadius:
									`${radius.topLeft}px ${radius.topRight}px ${radius.bottomRight}px ${radius.bottomLeft}px`,
							}"
						/>
					</div>

					<!-- Presets -->
					<div class="mb-4 flex flex-wrap gap-2">
						<button
							v-for="preset in presets"
							:key="preset.name"
							class="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
							@click="updateAll(preset.value)"
						>
							{{ preset.name }}
						</button>
					</div>

					<!-- Controls -->
					<div class="mb-4 flex items-center justify-between">
						<label class="flex items-center gap-2 text-sm">
							<input v-model="linked" type="checkbox" class="rounded" />
							<span class="text-gray-700 dark:text-gray-300">Link corners</span>
						</label>
					</div>

					<div v-if="linked" class="mb-4">
						<input
							type="range"
							min="0"
							max="100"
							:value="radius.topLeft"
							@input="updateAll(Number(($event.target as HTMLInputElement).value))"
							class="w-full"
						/>
						<div class="mt-1 text-center text-sm text-gray-600 dark:text-gray-400">
							{{ radius.topLeft }}px
						</div>
					</div>

					<div v-else class="grid grid-cols-2 gap-3">
						<div v-for="(value, key) in radius" :key="key">
							<label class="mb-1 block text-[10px] uppercase text-gray-500">{{
								key.replace(/([A-Z])/g, " $1").trim()
							}}</label>
							<input
								v-model.number="radius[key as keyof typeof radius]"
								type="number"
								class="w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
							/>
						</div>
					</div>

					<button class="mt-6 w-full rounded-lg bg-zinc-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-600">
						Apply Radius
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>
