<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	shortcuts: { key: string; description: string; category: string }[];
}>();

const emit = defineEmits<{
	close: [];
}>();

const searchQuery = ref("");
const selectedCategory = ref("All");

const categories = computed(() => {
	const cats = new Set(props.shortcuts.map(s => s.category));
	return ["All", ...Array.from(cats)];
});

const filteredShortcuts = computed(() => {
	let result = props.shortcuts;
	if (selectedCategory.value !== "All") {
		result = result.filter(s => s.category === selectedCategory.value);
	}
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		result = result.filter(s =>
			s.key.toLowerCase().includes(query)
			|| s.description.toLowerCase().includes(query)
		);
	}
	return result;
});

const formatKey = (key: string) => {
	return key.replace(/\+/g, " + ").replace(/Command|Ctrl/g, "⌘").replace(
		/Alt/g,
		"⌥",
	).replace(/Shift/g, "⇧");
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		@click.self="emit('close')"
	>
		<div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
			<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
					<Icon name="mdi:keyboard" class="w-5 h-5" />
					Keyboard Shortcuts
				</h3>
				<button
					@click="emit('close')"
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
				>
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
			</div>

			<div class="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
				<div class="relative">
					<Icon
						name="mdi:magnify"
						class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
					/>
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Search shortcuts..."
						class="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
					/>
				</div>
				<div class="flex gap-2 flex-wrap">
					<button
						v-for="cat in categories"
						:key="cat"
						@click="selectedCategory = cat"
						:class="[
							'px-3 py-1 rounded-full text-xs',
							selectedCategory === cat
								? 'bg-blue-500 text-white'
								: 'bg-gray-100 dark:bg-gray-700 text-gray-600',
						]"
					>
						{{ cat }}
					</button>
				</div>
			</div>

			<div class="max-h-96 overflow-y-auto p-4">
				<div class="space-y-2">
					<div
						v-for="shortcut in filteredShortcuts"
						:key="shortcut.key"
						class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
					>
						<span class="text-sm text-gray-700 dark:text-gray-300">{{
							shortcut.description
						}}</span>
						<kbd
							class="px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-sm font-mono"
						>{{ formatKey(shortcut.key) }}</kbd>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
