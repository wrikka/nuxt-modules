<script setup lang="ts">
const showGrid = ref(false);
const gridType = ref<"columns" | "rows" | "both">("both");
const columns = ref(12);
const columnWidth = ref(80);
const gutterWidth = ref(20);
const marginWidth = ref(40);
const showBaseline = ref(false);
const baselineHeight = ref(8);
</script>

<template>
	<div>
		<button
			class="fixed right-64 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-slate-400 ring-offset-2': showGrid }"
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
				<rect x="3" y="3" width="18" height="18" rx="2" />
				<path d="M3 9h18M9 21V9" />
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
				v-if="showGrid"
				class="fixed right-64 bottom-20 z-50 w-80 rounded-xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden"
			>
				<div class="flex items-center justify-between p-4 border-b border-gray-800">
					<h3 class="text-white font-semibold">Grid System</h3>
					<button
						class="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
						@click="showGrid = false"
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
					<!-- Grid Type -->
					<div>
						<label class="text-gray-400 text-xs mb-2 block">Grid Type</label>
						<div class="flex rounded-lg bg-gray-800 p-1">
							<button
								class="flex-1 px-2 py-1.5 text-xs rounded-md transition-colors"
								:class="gridType === 'columns'
								? 'bg-slate-600 text-white'
								: 'text-gray-400 hover:text-white'"
								@click="gridType = 'columns'"
							>
								Columns
							</button>
							<button
								class="flex-1 px-2 py-1.5 text-xs rounded-md transition-colors"
								:class="gridType === 'rows'
								? 'bg-slate-600 text-white'
								: 'text-gray-400 hover:text-white'"
								@click="gridType = 'rows'"
							>
								Rows
							</button>
							<button
								class="flex-1 px-2 py-1.5 text-xs rounded-md transition-colors"
								:class="gridType === 'both'
								? 'bg-slate-600 text-white'
								: 'text-gray-400 hover:text-white'"
								@click="gridType = 'both'"
							>
								Both
							</button>
						</div>
					</div>

					<!-- Column Settings -->
					<div v-if="gridType !== 'rows'" class="space-y-3">
						<div>
							<div class="flex items-center justify-between mb-1">
								<label class="text-gray-400 text-xs">Columns</label>
								<span class="text-white text-xs">{{ columns }}</span>
							</div>
							<input
								v-model.number="columns"
								type="range"
								min="1"
								max="24"
								class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-slate-500"
							>
						</div>

						<div>
							<div class="flex items-center justify-between mb-1">
								<label class="text-gray-400 text-xs">Column Width</label>
								<span class="text-white text-xs">{{ columnWidth }}px</span>
							</div>
							<input
								v-model.number="columnWidth"
								type="range"
								min="20"
								max="200"
								class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-slate-500"
							>
						</div>

						<div>
							<div class="flex items-center justify-between mb-1">
								<label class="text-gray-400 text-xs">Gutter</label>
								<span class="text-white text-xs">{{ gutterWidth }}px</span>
							</div>
							<input
								v-model.number="gutterWidth"
								type="range"
								min="0"
								max="100"
								class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-slate-500"
							>
						</div>

						<div>
							<div class="flex items-center justify-between mb-1">
								<label class="text-gray-400 text-xs">Margin</label>
								<span class="text-white text-xs">{{ marginWidth }}px</span>
							</div>
							<input
								v-model.number="marginWidth"
								type="range"
								min="0"
								max="200"
								class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-slate-500"
							>
						</div>
					</div>

					<!-- Baseline Grid -->
					<div class="border-t border-gray-800 pt-4">
						<div class="flex items-center justify-between mb-2">
							<label class="text-gray-400 text-xs">Baseline Grid</label>
							<button
								class="w-10 h-5 rounded-full transition-colors relative"
								:class="showBaseline ? 'bg-slate-600' : 'bg-gray-700'"
								@click="showBaseline = !showBaseline"
							>
								<span
									class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
									:class="showBaseline ? 'left-5' : 'left-0.5'"
								/>
							</button>
						</div>
						<div v-if="showBaseline">
							<div class="flex items-center justify-between mb-1">
								<label class="text-gray-400 text-xs">Line Height</label>
								<span class="text-white text-xs">{{ baselineHeight }}px</span>
							</div>
							<input
								v-model.number="baselineHeight"
								type="range"
								min="4"
								max="32"
								step="4"
								class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-slate-500"
							>
						</div>
					</div>

					<!-- Presets -->
					<div class="border-t border-gray-800 pt-4">
						<label class="text-gray-400 text-xs mb-2 block">Presets</label>
						<div class="grid grid-cols-3 gap-2">
							<button class="p-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs transition-colors">
								Bootstrap
							</button>
							<button class="p-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs transition-colors">
								Tailwind
							</button>
							<button class="p-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs transition-colors">
								Material
							</button>
							<button class="p-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs transition-colors">
								960.gs
							</button>
							<button class="p-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs transition-colors">
								1200px
							</button>
							<button class="p-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs transition-colors">
								Custom
							</button>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
