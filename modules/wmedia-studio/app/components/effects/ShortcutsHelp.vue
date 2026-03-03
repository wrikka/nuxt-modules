<script setup lang="ts">
const showShortcuts = ref(false);
const searchQuery = ref("");

const shortcuts = [
	{
		category: "General",
		items: [
			{ key: "Ctrl + N", description: "New file" },
			{ key: "Ctrl + O", description: "Open file" },
			{ key: "Ctrl + S", description: "Save" },
			{ key: "Ctrl + Z", description: "Undo" },
			{ key: "Ctrl + Shift + Z", description: "Redo" },
		],
	},
	{
		category: "Tools",
		items: [
			{ key: "V", description: "Move tool" },
			{ key: "R", description: "Rectangle" },
			{ key: "O", description: "Ellipse" },
			{ key: "T", description: "Text" },
			{ key: "P", description: "Pen tool" },
		],
	},
	{
		category: "Edit",
		items: [
			{ key: "Ctrl + D", description: "Duplicate" },
			{ key: "Delete", description: "Delete" },
			{ key: "Ctrl + G", description: "Group" },
			{ key: "Ctrl + Shift + G", description: "Ungroup" },
		],
	},
	{
		category: "View",
		items: [
			{ key: "Ctrl + +", description: "Zoom in" },
			{ key: "Ctrl + -", description: "Zoom out" },
			{ key: "Ctrl + 0", description: "Reset zoom" },
			{ key: "Space", description: "Pan" },
		],
	},
];

const filteredShortcuts = computed(() => {
	if (!searchQuery.value) return shortcuts;
	return shortcuts.map(cat => ({
		...cat,
		items: cat.items.filter(item =>
			item.key.toLowerCase().includes(searchQuery.value.toLowerCase())
			|| item.description.toLowerCase().includes(
				searchQuery.value.toLowerCase(),
			)
		),
	})).filter(cat => cat.items.length > 0);
});
</script>

<template>
	<div>
		<button
			class="fixed right-100 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-teal-400 ring-offset-2': showShortcuts }"
			@click="showShortcuts = !showShortcuts"
			title="Keyboard Shortcuts"
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
				<rect x="2" y="4" width="20" height="16" rx="2" />
				<path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10" />
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
				v-if="showShortcuts"
				class="fixed right-100 bottom-20 z-50 w-96 rounded-xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden"
			>
				<div class="flex items-center justify-between p-4 border-b border-gray-800">
					<h3 class="text-white font-semibold">Keyboard Shortcuts</h3>
					<button
						class="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
						@click="showShortcuts = false"
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

				<!-- Search -->
				<div class="p-4 pb-2">
					<div class="relative">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
						>
							<circle cx="11" cy="11" r="8" />
							<path d="m21 21-4.35-4.35" />
						</svg>
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Search shortcuts..."
							class="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
						>
					</div>
				</div>

				<!-- Shortcuts List -->
				<div class="p-4 pt-2 max-h-80 overflow-y-auto space-y-4">
					<div v-for="category in filteredShortcuts" :key="category.category">
						<h4 class="text-gray-500 text-xs font-medium uppercase mb-2">
							{{ category.category }}
						</h4>
						<div class="space-y-1">
							<div
								v-for="item in category.items"
								:key="item.key"
								class="flex items-center justify-between p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
							>
								<span class="text-gray-300 text-sm">{{
									item.description
								}}</span>
								<kbd
									class="px-2 py-1 bg-gray-900 rounded text-xs font-mono text-teal-400 border border-gray-700"
								>
									{{ item.key }}
								</kbd>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
