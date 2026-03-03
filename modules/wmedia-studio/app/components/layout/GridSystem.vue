<script setup lang="ts">
const showGrid = ref(false);

const gridSettings = ref({
	columns: 12,
	gutter: 24,
	margin: 48,
	baseline: 8,
	showColumns: true,
	showBaseline: true,
	color: "rgba(59, 130, 246, 0.1)",
});

const presets = [
	{ name: "12 Column", columns: 12, gutter: 24 },
	{ name: "8 Column", columns: 8, gutter: 32 },
	{ name: "4 Column", columns: 4, gutter: 16 },
	{ name: "Bootstrap", columns: 12, gutter: 30 },
];
</script>

<template>
	<div>
		<button
			class="fixed right-4 top-32 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-lime-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-lime-400 ring-offset-2': showGrid }"
			@click="showGrid = !showGrid"
			title="Grid System"
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
				<rect width="18" height="18" x="3" y="3" rx="2" />
				<path d="M3 9h18" />
				<path d="M3 15h18" />
				<path d="M9 3v18" />
				<path d="M15 3v18" />
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
				v-if="showGrid"
				class="fixed right-0 top-0 z-40 h-screen w-80 overflow-hidden border-l border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<div class="border-b border-gray-200 bg-lime-600 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<h2 class="font-bold text-white">Grid</h2>
						<button
							class="text-white/80 hover:text-white"
							@click="showGrid = false"
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
					<!-- Presets -->
					<div class="mb-6 flex flex-wrap gap-2">
						<button
							v-for="preset in presets"
							:key="preset.name"
							class="rounded-full bg-lime-100 px-3 py-1 text-xs font-medium text-lime-700 transition-colors hover:bg-lime-200 dark:bg-lime-900/30 dark:text-lime-300"
							@click="gridSettings.columns = preset.columns;
							gridSettings.gutter = preset.gutter;"
						>
							{{ preset.name }}
						</button>
					</div>

					<!-- Grid Settings -->
					<div class="space-y-4">
						<div>
							<div class="mb-1 flex items-center justify-between">
								<label
									class="text-xs font-medium text-gray-700 dark:text-gray-300"
								>Columns: {{ gridSettings.columns }}</label>
							</div>
							<input
								v-model.number="gridSettings.columns"
								type="range"
								min="4"
								max="24"
								class="w-full"
							/>
						</div>

						<div>
							<div class="mb-1 flex items-center justify-between">
								<label
									class="text-xs font-medium text-gray-700 dark:text-gray-300"
								>Gutter: {{ gridSettings.gutter }}px</label>
							</div>
							<input
								v-model.number="gridSettings.gutter"
								type="range"
								min="0"
								max="100"
								class="w-full"
							/>
						</div>

						<div>
							<div class="mb-1 flex items-center justify-between">
								<label
									class="text-xs font-medium text-gray-700 dark:text-gray-300"
								>Margin: {{ gridSettings.margin }}px</label>
							</div>
							<input
								v-model.number="gridSettings.margin"
								type="range"
								min="0"
								max="200"
								class="w-full"
							/>
						</div>

						<div class="flex gap-4">
							<label class="flex items-center gap-2">
								<input
									v-model="gridSettings.showColumns"
									type="checkbox"
									class="rounded"
								/>
								<span class="text-xs text-gray-600 dark:text-gray-400"
								>Columns</span>
							</label>
							<label class="flex items-center gap-2">
								<input
									v-model="gridSettings.showBaseline"
									type="checkbox"
									class="rounded"
								/>
								<span class="text-xs text-gray-600 dark:text-gray-400"
								>Baseline</span>
							</label>
						</div>
					</div>

					<button class="mt-6 w-full rounded-lg bg-lime-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-lime-700">
						Apply Grid
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>
