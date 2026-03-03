<script setup lang="ts">
interface Shortcut {
	key: string;
	modifiers: string[];
	description: string;
	category: string;
}

const props = defineProps<{
	isOpen: boolean;
}>();

const emit = defineEmits<{
	close: [];
}>();

const searchQuery = ref("");
const selectedCategory = ref("all");

const categories = [
	{ id: "all", name: "All Shortcuts" },
	{ id: "general", name: "General" },
	{ id: "edit", name: "Edit" },
	{ id: "view", name: "View" },
	{ id: "selection", name: "Selection" },
	{ id: "layers", name: "Layers" },
];

const shortcuts: Shortcut[] = [
	{
		key: "N",
		modifiers: ["Ctrl"],
		description: "New Project",
		category: "general",
	},
	{
		key: "O",
		modifiers: ["Ctrl"],
		description: "Open Project",
		category: "general",
	},
	{ key: "S", modifiers: ["Ctrl"], description: "Save", category: "general" },
	{ key: "Z", modifiers: ["Ctrl"], description: "Undo", category: "edit" },
	{
		key: "Z",
		modifiers: ["Ctrl", "Shift"],
		description: "Redo",
		category: "edit",
	},
	{ key: "C", modifiers: ["Ctrl"], description: "Copy", category: "edit" },
	{ key: "V", modifiers: ["Ctrl"], description: "Paste", category: "edit" },
	{ key: "X", modifiers: ["Ctrl"], description: "Cut", category: "edit" },
	{ key: "D", modifiers: ["Ctrl"], description: "Duplicate", category: "edit" },
	{
		key: "Delete",
		modifiers: [],
		description: "Delete Selection",
		category: "edit",
	},
	{ key: "+", modifiers: ["Ctrl"], description: "Zoom In", category: "view" },
	{ key: "-", modifiers: ["Ctrl"], description: "Zoom Out", category: "view" },
	{
		key: "0",
		modifiers: ["Ctrl"],
		description: "Reset Zoom",
		category: "view",
	},
	{
		key: "G",
		modifiers: ["Ctrl"],
		description: "Toggle Grid",
		category: "view",
	},
	{
		key: "R",
		modifiers: ["Ctrl"],
		description: "Toggle Rulers",
		category: "view",
	},
	{
		key: "A",
		modifiers: ["Ctrl"],
		description: "Select All",
		category: "selection",
	},
	{
		key: "A",
		modifiers: [],
		description: "Direct Select",
		category: "selection",
	},
	{
		key: "Escape",
		modifiers: [],
		description: "Deselect",
		category: "selection",
	},
	{
		key: "[",
		modifiers: ["Ctrl"],
		description: "Send Backward",
		category: "layers",
	},
	{
		key: "]",
		modifiers: ["Ctrl"],
		description: "Bring Forward",
		category: "layers",
	},
	{
		key: "[",
		modifiers: ["Ctrl", "Shift"],
		description: "Send to Back",
		category: "layers",
	},
	{
		key: "]",
		modifiers: ["Ctrl", "Shift"],
		description: "Bring to Front",
		category: "layers",
	},
	{
		key: "G",
		modifiers: ["Ctrl", "Shift"],
		description: "Group",
		category: "layers",
	},
	{
		key: "G",
		modifiers: ["Ctrl", "Shift", "Alt"],
		description: "Ungroup",
		category: "layers",
	},
];

const filteredShortcuts = computed(() => {
	let filtered = shortcuts;
	if (selectedCategory.value !== "all") {
		filtered = filtered.filter(s => s.category === selectedCategory.value);
	}
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		filtered = filtered.filter(s =>
			s.description.toLowerCase().includes(query)
			|| s.key.toLowerCase().includes(query)
		);
	}
	return filtered;
});
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
		@click.self="emit('close')"
	>
		<div class="w-full max-w-2xl h-[70vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
			<!-- Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
				<div class="flex items-center gap-3">
					<Icon name="mdi:keyboard" class="w-5 h-5 text-blue-500" />
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						Keyboard Shortcuts
					</h2>
				</div>
				<button
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
					@click="emit('close')"
				>
					<Icon name="mdi:close" class="w-5 h-5 text-gray-500" />
				</button>
			</div>

			<!-- Search & Filter -->
			<div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
				<div class="relative">
					<Icon
						name="mdi:magnify"
						class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
					/>
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Search shortcuts..."
						class="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
					>
				</div>
				<div class="flex flex-wrap gap-2">
					<button
						v-for="cat in categories"
						:key="cat.id"
						:class="[
							'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
							selectedCategory === cat.id
								? 'bg-blue-500 text-white'
								: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200',
						]"
						@click="selectedCategory = cat.id"
					>
						{{ cat.name }}
					</button>
				</div>
			</div>

			<!-- Shortcuts List -->
			<div class="flex-1 overflow-y-auto p-6">
				<div class="space-y-2">
					<div
						v-for="shortcut in filteredShortcuts"
						:key="`${shortcut.key}-${shortcut.description}`"
						class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
					>
						<span class="text-sm text-gray-700 dark:text-gray-300">{{
							shortcut.description
						}}</span>
						<div class="flex items-center gap-1">
							<kbd
								v-for="mod in shortcut.modifiers"
								:key="mod"
								class="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono text-gray-600 dark:text-gray-400"
							>
								{{ mod }}
							</kbd>
							<kbd
								class="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono text-gray-900 dark:text-white font-semibold"
							>
								{{ shortcut.key }}
							</kbd>
						</div>
					</div>
				</div>

				<!-- Empty State -->
				<div v-if="filteredShortcuts.length === 0" class="text-center py-12">
					<Icon
						name="mdi:magnify-close"
						class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3"
					/>
					<p class="text-gray-500 dark:text-gray-400">No shortcuts found</p>
				</div>
			</div>
		</div>
	</div>
</template>
